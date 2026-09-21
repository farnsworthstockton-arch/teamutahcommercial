/*
 * inquiry.js: sends the site's inquiry forms to the team.
 *
 * Every lead form on the site sends through TUCInquiry. It POSTs the inquiry to
 * the team's own inquiry service, which saves it and pings the team's phones.
 * If that fails for ANY reason (no connection, service down, too many tries,
 * a bad reply, a timeout), it falls back to the old behaviour: it opens the
 * visitor's own email app addressed to Robert with the inquiry filled in, and
 * shows a note with the email address and phone number. Either way the inquiry
 * reaches a person.
 *
 * A form opts in with a data-tuc-inquiry attribute. That adds the same hidden
 * "Website" honeypot field the RSVP page uses (only bots fill it in).
 */
(function (window, document) {
    'use strict';

    var LIVE_ENDPOINT = 'https://inquiry.146-190-119-77.sslip.io/api/inquiry';
    var LOCAL_ENDPOINT = 'http://127.0.0.1:3564/api/inquiry';
    var TEAM_EMAIL = 'Robert@teamutahcre.com';
    var TEAM_PHONE = '801-898-8810';
    var TIMEOUT_MS = 12000;
    var MAX_MAILTO_BODY = 1500;   // longer mailto: links fail to open in some email apps
    var LIMITS = { name: 100, email: 254, phone: 40, message: 5000, listing: 300, page: 500 };
    var SKIP_TYPES = { hidden: 1, submit: 1, button: 1, reset: 1, image: 1, file: 1, password: 1 };
    var pageLoadedAt = Date.now();

    function isLocalPreview() {
        return /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    }

    // Only a local preview may point somewhere else (for testing). The live site
    // always posts to the team's service, so no crafted link can redirect a lead.
    function endpoint() {
        if (isLocalPreview()) return window.TUC_INQUIRY_ENDPOINT || LOCAL_ENDPOINT;
        return LIVE_ENDPOINT;
    }

    function clip(value, max) {
        var text = String(value == null ? '' : value).trim();
        return text.length > max ? text.slice(0, max) : text;
    }

    function clipMessage(value) {
        var text = String(value == null ? '' : value).trim();
        if (text.length <= LIMITS.message) return text;
        var note = '\n[message shortened]';
        return text.slice(0, LIMITS.message - note.length) + note;
    }

    // ---- honeypot ------------------------------------------------------------

    function protect(container) {
        if (!container || container.querySelector('input[name="website"]')) return;
        var wrap = document.createElement('div');
        wrap.setAttribute('aria-hidden', 'true');
        wrap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
        var label = document.createElement('label');
        label.textContent = 'Website';
        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'website';
        input.tabIndex = -1;
        input.setAttribute('autocomplete', 'off');
        label.appendChild(input);
        wrap.appendChild(label);
        container.appendChild(wrap);
    }

    function protectAll() {
        var boxes = document.querySelectorAll('[data-tuc-inquiry]');
        for (var i = 0; i < boxes.length; i++) protect(boxes[i]);
    }

    // ---- reading a form --------------------------------------------------------

    function tidy(text) {
        return String(text || '').replace(/\s+/g, ' ').replace(/\*/g, '')
            .replace(/\(\s*optional\s*\)/ig, '').replace(/\boptional\s*$/i, '')
            .replace(/[\s:.…]+$/, '').trim();
    }

    function prettyName(name) {
        name = String(name || '').replace(/[_-]+/g, ' ').trim();
        return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Field';
    }

    function fieldLabel(el) {
        var text = el.labels && el.labels.length ? tidy(el.labels[0].textContent) : '';
        return text || tidy(el.getAttribute('aria-label')) || prettyName(el.name || el.id);
    }

    // The question a group of radio buttons or checkboxes answers.
    function groupLabel(el) {
        var node = el.parentElement;
        for (var depth = 0; node && depth < 6; depth++, node = node.parentElement) {
            if (node.tagName === 'FIELDSET') {
                var legend = node.querySelector('legend');
                if (legend) return tidy(legend.textContent);
            }
            var labelledBy = node.getAttribute('aria-labelledby');
            if (labelledBy && document.getElementById(labelledBy)) {
                return tidy(document.getElementById(labelledBy).textContent);
            }
            var role = node.getAttribute('role');
            if ((role === 'group' || role === 'radiogroup') && node.getAttribute('aria-label')) {
                return tidy(node.getAttribute('aria-label'));
            }
            for (var i = 0; i < node.children.length; i++) {
                var child = node.children[i];
                if (child.tagName === 'LABEL' && !child.htmlFor && !child.querySelector('input, select, textarea')) {
                    return tidy(child.textContent);
                }
            }
            if (node.tagName === 'FORM') break;
        }
        return prettyName(el.name);
    }

    function optionText(el) {
        var text = el.labels && el.labels.length ? tidy(el.labels[0].textContent) : '';
        return text || el.value;
    }

    // Every other filled-in field of the form as "Question: answer" lines, in
    // page order, so nothing the visitor typed or picked is lost.
    function describe(container, skipIds) {
        var entries = [];
        var groups = {};
        var fields = container.querySelectorAll('input, select, textarea');
        for (var i = 0; i < fields.length; i++) {
            var el = fields[i];
            var type = (el.type || '').toLowerCase();
            if (el.name === 'website' || el.disabled || SKIP_TYPES[type]) continue;
            if (el.id && skipIds.indexOf(el.id) !== -1) continue;
            if (type === 'checkbox' || type === 'radio') {
                if (!el.checked) continue;
                var key = type + ':' + (el.name || el.id);
                if (!groups[key]) {
                    groups[key] = { label: groupLabel(el), values: [] };
                    entries.push(groups[key]);
                }
                groups[key].values.push(optionText(el));
            } else if (el.tagName === 'SELECT') {
                if (!el.value) continue;
                var option = el.options[el.selectedIndex];
                entries.push({ label: fieldLabel(el), values: [option ? tidy(option.text) || el.value : el.value] });
            } else {
                var value = String(el.value || '').trim();
                if (value) entries.push({ label: fieldLabel(el), values: [value] });
            }
        }
        return entries.map(function (entry) {
            var value = entry.values.join(', ');
            return entry.label + (value.indexOf('\n') !== -1 ? ':\n' : ': ') + value;
        }).join('\n');
    }

    function valueOf(id) {
        var el = id ? document.getElementById(id) : null;
        return el ? String(el.value || '').trim() : '';
    }

    // map: { name: id or [firstId, lastId], email: id, phone: id, message: id, skip: [ids] }
    function collect(container, map, intro) {
        var nameIds = [].concat(map.name || []);
        var used = nameIds.concat(map.email || [], map.phone || [], map.message || [], map.skip || []);
        return {
            name: nameIds.map(valueOf).filter(Boolean).join(' '),
            email: valueOf(map.email),
            phone: valueOf(map.phone),
            message: [intro || '', valueOf(map.message), describe(container, used)]
                .filter(Boolean).join('\n\n')
        };
    }

    // ---- sending -----------------------------------------------------------------

    function post(payload) {
        return new Promise(function (resolve, reject) {
            if (!window.fetch) { reject(new Error('this browser cannot send forms')); return; }
            var ctrl = window.AbortController ? new AbortController() : null;
            var settled = false;
            var timer = setTimeout(function () {
                if (settled) return;
                settled = true;
                if (ctrl) ctrl.abort();
                reject(new Error('timed out'));
            }, TIMEOUT_MS);
            window.fetch(endpoint(), {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                cache: 'no-store',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: ctrl ? ctrl.signal : undefined
            }).then(function (res) {
                return res.json().catch(function () { return null; }).then(function (data) {
                    if (res.ok && data && data.ok === true) return data;
                    throw new Error('HTTP ' + res.status + (data && data.error ? ': ' + data.error : ''));
                });
            }).then(function (data) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve(data);
            }, function (err) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                reject(err);
            });
        });
    }

    function mailtoFor(p, subject) {
        var lines = [];
        if (p.name) lines.push('Name: ' + p.name);
        if (p.phone) lines.push('Phone: ' + p.phone);
        if (p.email) lines.push('Email: ' + p.email);
        if (p.listing) lines.push('About: ' + p.listing);
        if (p.message) lines.push('', p.message);
        var body = lines.join('\n');
        if (body.length > MAX_MAILTO_BODY) body = body.slice(0, MAX_MAILTO_BODY) + '\n[...]';
        return 'mailto:' + TEAM_EMAIL + '?subject=' + encodeURIComponent(subject || ('Website inquiry: ' + p.listing)) +
            '&body=' + encodeURIComponent(body);
    }

    // fields: { name, email, phone, message }
    // opts:   { form, listing, container, subject, mailto }
    // Resolves { ok: true, id } when saved, or { ok: false, mailto } after
    // falling back to the visitor's email app. Never rejects.
    function send(fields, opts) {
        opts = opts || {};
        var trap = opts.container ? opts.container.querySelector('input[name="website"]') : null;
        var payload = {
            name: clip(fields.name, LIMITS.name),
            email: clip(fields.email, LIMITS.email),
            phone: clip(fields.phone, LIMITS.phone),
            message: clipMessage(fields.message),
            listing: clip(opts.listing || document.title, LIMITS.listing),
            page: clip(window.location.href, LIMITS.page),
            form: opts.form || 'unknown',
            website: trap ? trap.value : '',
            elapsed_ms: Date.now() - pageLoadedAt
        };
        return post(payload).then(function (reply) {
            return { ok: true, id: reply.id };
        }, function (err) {
            var url = opts.mailto || mailtoFor(payload, opts.subject);
            if (window.console && console.warn) {
                console.warn('Inquiry service unavailable (' + (err && err.message) + '); opening email instead.');
            }
            TUCInquiry.openMailto(url);
            return { ok: false, mailto: url };
        });
    }

    // ---- showing the result ------------------------------------------------------

    function noteFor(container) {
        var next = container.nextElementSibling;
        if (next && next.className === 'tuc-inquiry-note') return next;
        var note = document.createElement('p');
        note.className = 'tuc-inquiry-note';
        note.setAttribute('role', 'status');
        note.setAttribute('aria-live', 'polite');
        note.style.cssText = 'margin:0.9rem auto 0;max-width:40rem;font-size:0.95rem;line-height:1.5;' +
            'font-weight:600;text-align:center;color:inherit;';
        container.parentNode.insertBefore(note, container.nextSibling);
        return note;
    }

    function link(href, text) {
        var a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        a.style.cssText = 'color:inherit;text-decoration:underline;';
        return a;
    }

    function showThanks(container, text) {
        var note = noteFor(container);
        note.textContent = text || 'Thank you! Your message was sent to our team. We\'ll be in touch soon.';
    }

    function showFallback(container) {
        var note = noteFor(container);
        note.textContent = 'We couldn\'t send this from the page, so your email app should open with your ' +
            'message filled in. Just press Send. No email app? Email ';
        note.appendChild(link('mailto:' + TEAM_EMAIL, TEAM_EMAIL));
        note.appendChild(document.createTextNode(' or call '));
        note.appendChild(link('tel:' + TEAM_PHONE.replace(/[^0-9]/g, ''), TEAM_PHONE));
        note.appendChild(document.createTextNode('.'));
    }

    function clearNote(container) {
        var next = container.nextElementSibling;
        if (next && next.className === 'tuc-inquiry-note') next.textContent = '';
    }

    function setBusy(button, busy) {
        if (!button) return;
        if (busy) {
            button.__tucHtml = button.innerHTML;
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
            button.textContent = 'Sending...';
        } else {
            button.disabled = false;
            button.removeAttribute('aria-busy');
            if (button.__tucHtml != null) button.innerHTML = button.__tucHtml;
        }
    }

    // One call per form: read it, send it, show the result.
    // opts: { form, listing, subject, mailto, intro, button, thanks, onSent(result), onFallback(result) }
    function submit(container, map, opts) {
        opts = opts || {};
        var button = opts.button || container.querySelector('[type="submit"]') || container.querySelector('button');
        if (button && button.disabled) return Promise.resolve({ ok: false, busy: true });
        clearNote(container);
        setBusy(button, true);
        var fields = collect(container, map, opts.intro);
        return send(fields, {
            form: opts.form, listing: opts.listing, subject: opts.subject,
            mailto: opts.mailto, container: container
        }).then(function (result) {
            setBusy(button, false);
            if (result.ok) {
                if (opts.onSent) {
                    opts.onSent(result);
                } else {
                    if (typeof container.reset === 'function') container.reset();
                    showThanks(container, opts.thanks);
                }
            } else {
                showFallback(container);
                if (opts.onFallback) opts.onFallback(result);
            }
            return result;
        });
    }

    var TUCInquiry = {
        submit: submit,
        send: send,
        collect: collect,
        protect: protect,
        showThanks: showThanks,
        showFallback: showFallback,
        endpoint: endpoint,
        // Kept separate so a local test can watch the fallback without an email app opening.
        openMailto: function (url) { window.location.href = url; }
    };
    window.TUCInquiry = TUCInquiry;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectAll);
    } else {
        protectAll();
    }
})(window, document);
