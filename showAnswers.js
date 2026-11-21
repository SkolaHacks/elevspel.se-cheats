//
// Copyright (C) SkolaHacks. All Rights Reserved.
//
// See our GitHub: https://github.com/SkolaHacks
//
// This is apart of the elevspel.se-cheats repository
// Author: @Nipfswd
//
(() => {
    const FILL = false;

    const decode = (b64) => {
        try {
            return decodeURIComponent(escape(atob(b64)));
        } catch {
            return atob(b64);
        }
    };

    document.querySelectorAll('.es-answer').forEach((el) => el.remove());

    const hidden = document.querySelectorAll('input[name="correct[]"]');
    if (!hidden.length) {
        console.warn('No correct[] fields found on this page.');
        return;
    }

    const rows = [];
    hidden.forEach((h, i) => {
        const answer = decode(h.value);
        const input = h.parentElement.querySelector('input.tal, input[name^="userval"]');

        const tag = document.createElement('span');
        tag.className = 'es-answer';
        tag.textContent = ' → ' + answer;
        tag.style.cssText = 'color:#d62828;font-weight:bold;margin-left:6px;';
        h.after(tag);

        if (FILL && input) {
            input.value = answer;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const tr = h.closest('tr');
        const left = tr?.querySelector('input[name="left[]"]')?.value;
        const right = tr?.querySelector('input[name="right[]"]')?.value;
        rows.push({ '#': i + 1, problem: left != null ? `${left} · ${right}` : '', answer });
    });

    console.table(rows);
})();
