/* ============================================================
   motion.js — small, dependency-free motion helpers
   - TUCMotion.reveal(elements): fade-and-rise as they scroll into view
   - TUCMotion.countUp(el, to, opts): count a number up from zero
   - TUCMotion.drawOnView(el): add .is-drawn when el scrolls into view
   Everything is skipped when the visitor has "reduce motion" turned on,
   and the hidden starting states are only ever added by this script,
   so if it fails to load, the page simply shows everything as normal.
   ============================================================ */
(function () {
    'use strict';

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canObserve = 'IntersectionObserver' in window;

    // ---- Fade-and-rise on scroll --------------------------------------
    var revealObserver = null;
    var REVEAL_MS = 550;
    var STAGGER_MS = 80;

    function onReveal(entries) {
        var shown = 0;
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            revealObserver.unobserve(el);
            var delay = Math.min(shown, 5) * STAGGER_MS; // cards that arrive together go one after another
            shown++;
            el.style.setProperty('--tuc-d', delay + 'ms');
            el.classList.add('is-in');
            // hand the card back to its own hover transitions once it has landed
            setTimeout(function () {
                el.classList.remove('tuc-reveal', 'is-in');
                el.style.removeProperty('--tuc-d');
            }, delay + REVEAL_MS + 50);
        });
    }

    function reveal(elements) {
        if (reduced || !canObserve || !elements) return;
        if (!revealObserver) {
            revealObserver = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
        }
        Array.prototype.forEach.call(elements, function (el) {
            el.classList.add('tuc-reveal');
            revealObserver.observe(el);
        });
    }

    // ---- Count a number up from zero ----------------------------------
    // Screen readers get the final text straight away; the rolling digits are hidden from them.
    var COUNT_MS = 1100;

    function finalText(to, opts) {
        return (opts.prefix || '') + Number(to).toLocaleString() + (opts.suffix || '');
    }

    function countUp(el, to, opts) {
        opts = opts || {};
        if (!el || !isFinite(to)) return; // bad number: leave the page's own text alone
        if (el._tucTimer) { clearTimeout(el._tucTimer); el._tucTimer = null; }
        var text = finalText(to, opts);
        if (reduced || !(to > 0) || to < 10) { el.textContent = text; return; }

        el.textContent = '';
        var sr = document.createElement('span');
        sr.className = 'tuc-sr-only';
        sr.textContent = text;
        var vis = document.createElement('span');
        vis.setAttribute('aria-hidden', 'true');
        el.appendChild(sr);
        el.appendChild(vis);

        var start = null;
        function frame(now) {
            if (start === null) start = now;
            var t = Math.min(1, (now - start) / COUNT_MS);
            var eased = 1 - Math.pow(1 - t, 3); // fast start, gentle landing
            vis.textContent = finalText(Math.round(to * eased), opts);
            if (t < 1) requestAnimationFrame(frame);
            else el.textContent = text; // finish on plain text
        }
        vis.textContent = finalText(0, opts);
        requestAnimationFrame(frame);
    }

    // Show "0" now and count up later; if the count never comes (data failed), put the original back.
    function prime(el) {
        if (reduced || !el) return;
        var original = el.textContent;
        el.textContent = (original.match(/^\D*/) || [''])[0] + '0' + (original.match(/[^\d,]*$/) || [''])[0];
        el._tucTimer = setTimeout(function () { el.textContent = original; }, 4000);
    }

    // Count up text like "40+ years", "506+" or "39" the first time it scrolls into view.
    function countOnView(elements) {
        Array.prototype.forEach.call(elements || [], function (el) {
            var m = el.textContent.trim().match(/^(\D*?)(\d[\d,]*)(.*)$/);
            if (!m) return;
            var to = parseInt(m[2].replace(/,/g, ''), 10);
            var opts = { prefix: m[1], suffix: m[3] };
            // small numbers and years ("2015") are not worth counting
            if (reduced || !canObserve || to < 10 || (to >= 1900 && to <= 2100)) return;
            var io = new IntersectionObserver(function (entries) {
                if (!entries[0].isIntersecting) return;
                io.disconnect();
                countUp(el, to, opts);
            }, { threshold: 0.6 });
            io.observe(el);
        });
    }

    // ---- Start a CSS drawing once it is on screen ----------------------
    function drawOnView(el) {
        if (!el) return;
        if (reduced || !canObserve) { el.classList.add('is-drawn', 'no-motion'); return; }
        el.classList.add('tuc-draw-ready');
        var io = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting) return;
            io.disconnect();
            el.classList.add('is-drawn');
        }, { threshold: 0.45 });
        io.observe(el);
    }

    window.TUCMotion = {
        reduced: reduced,
        reveal: reveal,
        countUp: countUp,
        prime: prime,
        countOnView: countOnView,
        drawOnView: drawOnView
    };
})();
