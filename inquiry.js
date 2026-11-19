/*
 * inquiry.js: sends the site's lead forms straight to the team.
 *
 * Each form builds its request as lines ("Name: ...", "Email: ...", ...) and
 * calls TUCInquiry.sendLines(to, subject, lines, opts). That POSTs the request
 * to the team's inquiry service, which saves it and emails it to the team
 * (Reply-To = the visitor, so hitting Reply answers them).
 *
 * If that fails for ANY reason (offline, service down, timeout, too many tries,
 * email not delivered), it falls back to the old way: it opens the visitor's
 * own email app with the request filled in, and the page says "press Send",
 * with a phone number, an email address and a link that opens the email again.
 * Either way the request reaches a person.
 *
 * Forms marked data-tuc-lead also get:
 *   - a hidden "website" honeypot field (only bots fill it in);
 *   - an UNTICKED "OK to call or text me" box, when the form asks for a phone;
 *   - a one-line privacy note linking to /privacy.html.
 * data-tuc-lead="compact" (one-line forms) puts the privacy note under the form.
 */
(function (window, document) {
    'use strict';

    var LIVE_ENDPOINT = 'https://inquiry.207-244-224-240.sslip.io/api/inquiry';
    var LOCAL_ENDPOINT = 'http://127.0.0.1:3564/api/inquiry';
    var TEAM_RE = /^([a-z]+)@teamutahcre\.com$/i;
    var TEAM_PHONE = '801-898-8810';
    var TEAM_PHONE_LINK = 'tel:+18018988810';
    var TIMEOUT_MS = 20000;
    var LIMITS = { name: 100, email: 254, phone: 40, message: 5000, listing: 300, page: 500, form: 40 };
    var FIELD_RE = /^(name|contact|email|phone|cell phone):\s*(.*)$/i;
    var pageLoadedAt = Date.now();
    var lastForm = null;

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

    function mailtoUrl(to, subject, lines) {
        return 'mailto:' + to
            + '?subject=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(lines.join(String.fromCharCode(10)));
    }

    // ---- which form is sending -------------------------------------------------

    function leadFormOf(node) {
        while (node && node !== document) {
            if (node.tagName === 'FORM') return node;
            node = node.parentNode;
        }
        return null;
    }

    // Capture phase runs before the page's own handlers, so by the time a page
    // calls sendLines we know which form the visitor used (also for forms sent
    // by a button click instead of a submit event).
    document.addEventListener('submit', function (e) { lastForm = leadFormOf(e.target) || lastForm; }, true);
    document.addEventListener('click', function (e) {
        var form = leadFormOf(e.target);
        if (form) lastForm = form;
    }, true);

    // ---- what the page shows ---------------------------------------------------

    function el(tag, text, attrs) {
        var node = document.createElement(tag);
        if (text) node.textContent = text;
        for (var key in (attrs || {})) node.setAttribute(key, attrs[key]);
        return node;
    }

    function findNote(form) {
        var scope = form;
        for (var depth = 0; scope && depth < 3; depth++, scope = scope.parentNode) {
            var note = scope.querySelector && scope.querySelector('[role="status"][id$="-sent"]');
            if (note) return note;
        }
        return null;
    }

    function againLink(url) {
        var p = el('span');
        p.appendChild(el('br'));
        var a = el('a', 'Didn’t open? Tap here to open your email app with your request filled in.',
                   { href: url, 'class': 'tuc-mailto-again' });
        a.style.color = 'inherit';
        a.style.textDecoration = 'underline';
        p.appendChild(a);
        return p;
    }

    // A "-sent" note under the form: swap its text, keep its look.
    function noteUi(note) {
        var original = note.innerHTML;
        return {
            sending: function () {
                note.innerHTML = '';
                note.appendChild(el('strong', 'Sending your request…'));
                note.hidden = false;
            },
            sent: function () {
                note.innerHTML = '';
                note.appendChild(el('strong', 'Thanks, your request was sent.'));
                note.appendChild(document.createTextNode(
                    ' It went straight to our team, and we’ll get back to you soon. Need us sooner? Call '));
                var tel = el('a', TEAM_PHONE, { href: TEAM_PHONE_LINK });
                tel.style.color = 'inherit';
                tel.style.whiteSpace = 'nowrap';
                note.appendChild(tel);
                note.appendChild(document.createTextNode('.'));
                note.hidden = false;
            },
            fallback: function (url) {
                note.innerHTML = original;  // the page's own "Almost done: press Send" text
                note.appendChild(againLink(url));
                note.hidden = false;
            }
        };
    }

    // A pop-up or box with a heading and paragraphs ("Almost done: press Send").
    function boxUi(box) {
        var title = box.querySelector('h2, h3');
        var paras = box.querySelectorAll('p, .response-note');
        var main = paras.length ? paras[0] : null;
        var saved = {
            title: title ? title.innerHTML : '',
            main: main ? main.innerHTML : '',
            extras: Array.prototype.map.call(paras, function (p) { return p.style.display; })
        };
        var extraLink = null;
        function extras(show) {
            for (var i = 1; i < paras.length; i++) paras[i].style.display = show ? saved.extras[i] : 'none';
        }
        return {
            sending: function () {
                if (title) title.textContent = 'Sending your request…';
                if (main) main.textContent = 'One moment.';
                extras(false);
            },
            sent: function () {
                if (title) title.textContent = 'Request sent';
                if (main) {
                    main.textContent = 'Thanks! It went straight to our team, and we’ll get back to you soon. '
                        + 'Need us sooner? Call ' + TEAM_PHONE + '.';
                }
                extras(false);
            },
            fallback: function (url) {
                if (title) title.innerHTML = saved.title;
                if (main) {
                    main.innerHTML = saved.main;
                    if (extraLink && extraLink.parentNode) extraLink.parentNode.removeChild(extraLink);
                    extraLink = againLink(url);
                    main.appendChild(extraLink);
                }
                extras(true);
            }
        };
    }

    var quietUi = { sending: function () {}, sent: function () {}, fallback: function () {} };

    function uiFor(form, opts) {
        if (opts.overlay) return boxUi(opts.overlay);
        var note = opts.note || (form && findNote(form));
        return note ? noteUi(note) : quietUi;
    }

    // The form's send button: a real submit button, or (on forms sent by a
    // click handler) the button whose class says "submit".
    function submitButton(form) {
        return form.querySelector('button[type="submit"], input[type="submit"], button:not([type])')
            || form.querySelector('button[class*="submit"]');
    }

    function setBusy(form, busy) {
        if (!form) return;
        form.setAttribute('aria-busy', busy ? 'true' : 'false');
        var button = submitButton(form);
        if (button) button.disabled = busy;
    }

    // ---- sending ---------------------------------------------------------------

    function parse(lines) {
        var out = { name: '', email: '', phone: '', rest: [] };
        for (var i = 0; i < lines.length; i++) {
            var line = String(lines[i] == null ? '' : lines[i]);
            var m = FIELD_RE.exec(line);
            if (m) {
                var key = m[1].toLowerCase();
                var value = m[2].trim();
                if (/^not given$/i.test(value)) value = '';
                if (key === 'email' && !out.email) { out.email = value; continue; }
                if ((key === 'phone' || key === 'cell phone') && !out.phone) { out.phone = value; continue; }
                if ((key === 'name' || key === 'contact') && !out.name) { out.name = value; continue; }
            }
            out.rest.push(line);
        }
        return out;
    }

    // "1031 Exchange Consultation: Pat Buyer" -> "1031 Exchange Consultation"
    // (the team's email already leads with the name).
    function aboutLine(subject, name) {
        var text = String(subject || '');
        if (name && text.slice(-name.length) === name) {
            text = text.slice(0, -name.length).replace(/[\s:\u2014-]+$/, '');
        }
        return text || String(subject || '');
    }

    function formId(opts) {
        var id = opts.form || (window.location.pathname.split('/').pop() || 'home').replace(/\.html?$/i, '');
        return clip(String(id).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'site', LIMITS.form);
    }

    function post(payload) {
        if (!window.fetch || !window.AbortController) return Promise.resolve(false);
        var controller = new AbortController();
        var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
        return window.fetch(endpoint(), {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        }).then(function (resp) {
            if (!resp.ok) return false;
            return resp.json().then(function (body) {
                // "alerted: false" = saved, but nobody was emailed: use the fallback too.
                return !!(body && body.ok && body.alerted !== false);
            });
        }).catch(function () {
            return false;
        }).then(function (delivered) {
            clearTimeout(timer);
            return delivered;
        });
    }

    function openMailto(url) {
        window.location.href = url;
    }

    /*
     * Send one request. Returns a Promise of 'sent', 'fallback' or 'mailto'.
     *   to       the address the page would have emailed. Only team addresses
     *            are posted; anything else (e.g. emailing visitors their own
     *            estimate) just opens their email app, as before.
     *   opts     { overlay: element, note: element, agent: 'randy',
     *              mailto: 'mailto:...' (fallback link, e.g. with a cc),
     *              form: 'id', listing: 'what it is about' }
     */
    function sendLines(to, subject, lines, opts) {
        opts = opts || {};
        lines = lines || [];
        var url = opts.mailto || mailtoUrl(to, subject, lines);
        var team = TEAM_RE.exec(String(to || '').trim());
        if (!team) {
            TUCInquiry.openMailto(url);
            return Promise.resolve('mailto');
        }
        var form = opts.formElement || lastForm;
        if (form && form.getAttribute('aria-busy') === 'true') return Promise.resolve('busy');
        var ui = uiFor(form, opts);
        var fields = parse(lines);
        var consentBox = form && form.querySelector('input[name="tuc_consent"]');
        var trap = form && form.querySelector('input[name="website"]');
        var agent = opts.agent || (team[1].toLowerCase() === 'robert' ? '' : team[1].toLowerCase());
        var payload = {
            name: clip(fields.name, LIMITS.name),
            email: clip(fields.email, LIMITS.email),
            phone: clip(fields.phone, LIMITS.phone),
            message: clip(fields.rest.join('\n'), LIMITS.message),
            listing: clip(opts.listing || aboutLine(subject, fields.name), LIMITS.listing),
            page: clip(window.location.href.split('#')[0], LIMITS.page),
            form: formId(opts),
            agent: clip(agent, 20),
            website: trap ? trap.value : '',
            elapsed_ms: Date.now() - pageLoadedAt
        };
        if (consentBox) payload.consent = !!consentBox.checked;

        ui.sending();
        setBusy(form, true);
        return post(payload).then(function (delivered) {
            setBusy(form, false);
            if (delivered) {
                ui.sent();
                return 'sent';
            }
            ui.fallback(url);
            TUCInquiry.openMailto(url);
            return 'fallback';
        });
    }

    // ---- extras added to every lead form ---------------------------------------

    var STYLE = [
        '.tuc-lead-extras{grid-column:1/-1;flex-basis:100%;width:100%;text-align:left;margin:.4rem 0 .7rem;}',
        '.tuc-consent{display:flex!important;gap:.55rem;align-items:flex-start;font-size:.88rem!important;',
        'line-height:1.45;font-weight:400!important;cursor:pointer;margin:0 0 .45rem!important;text-transform:none!important;',
        'letter-spacing:normal!important;color:inherit;}',
        '.tuc-consent input[type="checkbox"]{width:18px!important;height:18px!important;min-width:18px;',
        'padding:0!important;margin:.15rem 0 0!important;flex:none;appearance:auto!important;',
        '-webkit-appearance:checkbox!important;box-shadow:none!important;border:none;}',
        '.tuc-privacy{font-size:.8rem!important;line-height:1.45;opacity:.85;margin:0!important;color:inherit;}',
        '.tuc-privacy a,.tuc-consent a{color:inherit!important;text-decoration:underline;}',
        '.tuc-privacy-below{text-align:center;margin:.7rem auto 0!important;max-width:40rem;}'
    ].join('');

    function addStyle() {
        if (document.getElementById('tuc-lead-style')) return;
        var style = el('style');
        style.id = 'tuc-lead-style';
        style.textContent = STYLE;
        document.head.appendChild(style);
    }

    function honeypot(form) {
        if (form.querySelector('input[name="website"]')) return;
        var wrap = el('div', '', { 'aria-hidden': 'true' });
        wrap.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
        var label = el('label', 'Website');
        var input = el('input', '', { type: 'text', name: 'website', tabindex: '-1', autocomplete: 'off' });
        label.appendChild(input);
        wrap.appendChild(label);
        form.appendChild(wrap);
    }

    function privacyNote(extraClass) {
        var p = el('p', 'We use what you send only to answer your request. See our ', { 'class': 'tuc-privacy ' + (extraClass || '') });
        p.appendChild(el('a', 'Privacy Policy', { href: '/privacy.html' }));
        p.appendChild(document.createTextNode('.'));
        return p;
    }

    function enhance(form) {
        if (form.getAttribute('data-tuc-ready')) return;
        form.setAttribute('data-tuc-ready', '1');
        honeypot(form);
        if (form.getAttribute('data-tuc-lead') === 'compact') {
            form.parentNode.insertBefore(privacyNote('tuc-privacy-below'), form.nextSibling);
            return;
        }
        var box = el('div', '', { 'class': 'tuc-lead-extras' });
        if (form.querySelector('input[type="tel"]') && !form.querySelector('input[name="tuc_consent"]')) {
            var label = el('label', '', { 'class': 'tuc-consent' });
            var check = el('input', '', { type: 'checkbox', name: 'tuc_consent', value: 'yes' });
            label.appendChild(check);
            label.appendChild(el('span', 'It’s OK to call or text me about this request at the number above. '
                + '(Optional. Message and data rates may apply.)'));
            box.appendChild(label);
        }
        box.appendChild(privacyNote());
        var button = submitButton(form);
        if (button && button.parentNode) {
            button.parentNode.insertBefore(box, button);
        } else {
            form.appendChild(box);
        }
    }

    function enhanceAll() {
        addStyle();
        var forms = document.querySelectorAll('form[data-tuc-lead]');
        for (var i = 0; i < forms.length; i++) enhance(forms[i]);
    }

    var TUCInquiry = {
        sendLines: sendLines,
        enhance: enhanceAll,
        endpoint: endpoint,
        openMailto: openMailto
    };
    window.TUCInquiry = TUCInquiry;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceAll);
    } else {
        enhanceAll();
    }
})(window, document);
