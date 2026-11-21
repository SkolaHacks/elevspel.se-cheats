//
// Copyright (C) SkolaHacks. All Rights Reserved.
//
// See our GitHub: https://github.com/SkolaHacks
//
// This is apart of the elevspel.se-cheats repository
// Author: @Nipfswd
//
(() => {
    const ID = 'es-answer-panel';
    const STORE = 'es-answer-panel-settings';
    document.getElementById(ID)?.remove();
    document.querySelectorAll('.es-answer').forEach((el) => el.remove());
    document.querySelectorAll('.es-correct').forEach((el) => el.classList.remove('es-correct'));
    clearInterval(window.__esAnswerPoll);

    const STRINGS = {
        en: {
            details: 'Details', settings: 'Settings',
            minimize: 'Minimize', close: 'Close',
            search: 'Search Details', answers: 'Answers', items: (n) => `${n} items`,
            question: (n) => `Question ${n}`, clickToFill: 'Click to fill',
            fillAll: 'Fill All', showInline: 'Show Inline', refresh: 'Refresh',
            noAnswers: 'No supported game found on this page.', nothing: 'Nothing to show',
            ready: 'Ready', refreshed: 'Refreshed',
            set: (n, a) => `Set [${n}] = ${a}`, filled: (n) => `Filled ${n} fields`,
            filledCount: (d, t) => `${d} / ${t} done`,
            inlineOn: 'Inline labels on', inlineOff: 'Inline labels off',
            mode: 'Mode', modeCloze: 'Fill in', modeMC: 'Multiple choice', modeFree: 'Free input', modeNone: 'None',
            answering: (n, t) => `Answering ${n} / ${t}…`,
            doneSteps: 'Done. Press Next to finish.', notCurrent: 'Go to that question first',
            general: 'General', behaviour: 'Behaviour',
            language: 'Language', languageTip: 'Language of the panel',
            autoFill: 'Auto-fill on load', autoFillTip: 'Fill every box as soon as the panel opens',
            inlineDefault: 'Inline labels on load', inlineDefaultTip: 'Show answer badges next to the boxes at start',
            autoRefresh: 'Auto-refresh', autoRefreshTip: 'Re-read answers when the board changes',
            autoAdvance: 'Auto-advance', autoAdvanceTip: 'Step-by-step games: press Next after answering',
            autoCheck: 'Auto-check', autoCheckTip: 'Free input: press Check after typing',
            typeChars: 'Type letter by letter', typeCharsTip: 'Free input: type one key at a time',
            delay: 'Step delay (ms)', delayTip: 'Step-by-step games: wait between answers',
            reset: 'Reset to Defaults', saved: 'Settings saved', resetDone: 'Settings reset',
        },
        sv: {
            details: 'Detaljer', settings: 'Inställningar',
            minimize: 'Minimera', close: 'Stäng',
            search: 'Sök i detaljer', answers: 'Svar', items: (n) => `${n} st`,
            question: (n) => `Fråga ${n}`, clickToFill: 'Klicka för att fylla i',
            fillAll: 'Fyll i alla', showInline: 'Visa vid rutor', refresh: 'Uppdatera',
            noAnswers: 'Inget spel som stöds hittades på sidan.', nothing: 'Inget att visa',
            ready: 'Redo', refreshed: 'Uppdaterad',
            set: (n, a) => `Satte [${n}] = ${a}`, filled: (n) => `Fyllde i ${n} rutor`,
            filledCount: (d, t) => `${d} / ${t} klara`,
            inlineOn: 'Etiketter vid rutor på', inlineOff: 'Etiketter vid rutor av',
            mode: 'Läge', modeCloze: 'Fyll i', modeMC: 'Flerval', modeFree: 'Skriv själv', modeNone: 'Inget',
            answering: (n, t) => `Svarar ${n} / ${t}…`,
            doneSteps: 'Klart. Tryck Nästa för att avsluta.', notCurrent: 'Gå till den frågan först',
            general: 'Allmänt', behaviour: 'Beteende',
            language: 'Språk', languageTip: 'Panelens språk',
            autoFill: 'Fyll i automatiskt', autoFillTip: 'Fyll i alla rutor direkt när panelen öppnas',
            inlineDefault: 'Etiketter vid start', inlineDefaultTip: 'Visa svarsmärken vid rutorna från början',
            autoRefresh: 'Uppdatera automatiskt', autoRefreshTip: 'Läs om svaren när spelplanen ändras',
            autoAdvance: 'Gå vidare automatiskt', autoAdvanceTip: 'Steg-för-steg-spel: tryck Nästa efter varje svar',
            autoCheck: 'Rätta automatiskt', autoCheckTip: 'Skriv själv: tryck Rätta efter skrivandet',
            typeChars: 'Skriv bokstav för bokstav', typeCharsTip: 'Skriv själv: en tangent i taget',
            delay: 'Fördröjning (ms)', delayTip: 'Steg-för-steg-spel: väntetid mellan svaren',
            reset: 'Återställ standard', saved: 'Inställningar sparade', resetDone: 'Inställningar återställda',
        },
    };

    const DEFAULTS = {
        lang: (document.documentElement.lang || navigator.language || 'en').toLowerCase().startsWith('sv') ? 'sv' : 'en',
        autoFill: false,
        inlineDefault: false,
        autoRefresh: true,
        autoAdvance: true,
        autoCheck: true,
        typeChars: false,
        delay: 600,
    };

    const load = () => {
        try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORE) || '{}') }; }
        catch { return { ...DEFAULTS }; }
    };
    const save = () => {
        try { localStorage.setItem(STORE, JSON.stringify(cfg)); } catch {}
    };

    let cfg = load();
    const T = () => STRINGS[cfg.lang] || STRINGS.en;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const decode = (b64) => {
        if (!b64) return '';
        try {
            return decodeURIComponent(escape(atob(b64)));
        } catch {
            try { return atob(b64); } catch { return '?'; }
        }
    };
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const visible = (el) => !!el && getComputedStyle(el).display !== 'none' && el.offsetParent !== null;

    const waitFor = async (fn, timeout = 3000) => {
        const end = Date.now() + timeout;
        while (Date.now() < end) {
            if (fn()) return true;
            await sleep(80);
        }
        return false;
    };

    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
    const key = (el, type, k) => el.dispatchEvent(new KeyboardEvent(type, { key: k, bubbles: true }));

    const typeInto = async (input, text) => {
        input.focus();
        if (!cfg.typeChars) {
            nativeSetter.call(input, text);
            fire(input, 'input');
            key(input, 'keyup', text.slice(-1) || 'a');
            fire(input, 'change');
            return;
        }
        nativeSetter.call(input, '');
        fire(input, 'input');
        for (const ch of text) {
            key(input, 'keydown', ch);
            nativeSetter.call(input, input.value + ch);
            fire(input, 'input');
            key(input, 'keyup', ch);
            await sleep(60 + Math.random() * 90);
        }
        fire(input, 'change');
    };

    const detectFree = () => {
        const rows = [...document.querySelectorAll('.qrow')].filter((r) => r.querySelector('input.spelledinput'));
        if (!rows.length) return null;
        return rows.map((row, i) => {
            const input = row.querySelector('input.spelledinput');
            const chosen = row.querySelector('input[name="chosen[]"]');
            const check = row.querySelector('.checkAnswer');
            const card = row.querySelector('.questionCard');
            const answer = decode(input.dataset.correct || row.querySelector('input[name="correct[]"]')?.value);
            const alts = [decode(input.dataset.ca1), decode(input.dataset.ca2)].filter(Boolean);
            return {
                n: i,
                problem: card?.textContent.trim() || null,
                answer: alts.length ? `${answer} / ${alts.join(' / ')}` : answer,
                typed: answer,
                anchor: input,
                stepped: true,
                isCurrent: () => visible(row),
                isDone: () => !!chosen?.value,
                fill: async () => {
                    if (!visible(row) || chosen?.value) return false;
                    await typeInto(input, answer);
                    if (cfg.autoCheck && check) {
                        await waitFor(() => !check.disabled, 2000);
                        await sleep(150);
                        check.click();
                    }
                    return true;
                },
            };
        });
    };

    const detectCloze = () => {
        const hidden = [...document.querySelectorAll('input[name="correct[]"]')];
        if (!hidden.length) return null;
        return hidden.map((h, i) => {
            const tr = h.closest('tr');
            const left = tr?.querySelector('input[name="left[]"]')?.value;
            const right = tr?.querySelector('input[name="right[]"]')?.value;
            const input = h.parentElement.querySelector('input.tal, input[name^="userval"]');
            const answer = decode(h.value);
            return {
                n: i,
                problem: left != null ? `${left} · ${right}` : null,
                answer,
                anchor: h,
                hookInput: input,
                isCurrent: () => true,
                isDone: () => !!input && input.value === answer,
                fill: () => {
                    if (!input) return;
                    input.value = answer;
                    fire(input, 'input');
                    fire(input, 'change');
                },
            };
        });
    };

    const detectMultipleChoice = () => {
        const rows = [...document.querySelectorAll('.qrow')].filter((r) => r.querySelector('.choice[data-indexval]'));
        if (!rows.length) return null;
        return rows.map((row, i) => {
            const right = row.querySelector('.choice[data-indexval="1"]');
            const chosen = row.querySelector('input[name="chosen[]"]');
            const card = row.querySelector('.questionCard');
            return {
                n: i,
                problem: card?.textContent.trim() || null,
                answer: right?.textContent.trim() ?? '?',
                anchor: right?.closest('.btn') || right,
                highlight: true,
                stepped: true,
                isCurrent: () => visible(row),
                isDone: () => !!chosen?.value,
                fill: () => {
                    if (!right || !visible(row) || chosen?.value) return false;
                    (right.closest('.clickable') || right).click();
                    return true;
                },
            };
        });
    };

    const DETECTORS = [
        { key: 'free', name: () => T().modeFree, run: detectFree },
        { key: 'mc', name: () => T().modeMC, run: detectMultipleChoice },
        { key: 'cloze', name: () => T().modeCloze, run: detectCloze },
    ];

    let mode = null;
    const collect = () => {
        for (const d of DETECTORS) {
            const list = d.run();
            if (list) { mode = d; return list; }
        }
        mode = null;
        return [];
    };
    const stepped = () => mode?.key === 'mc' || mode?.key === 'free';

    const css = `
        #${ID}{
            --bg0:#0f0f0f; --bg1:#151515; --bg2:#1a1a1a; --bg3:#242424; --bg4:#2f2f2f;
            --line:#0b0b0b; --txt:#c0c0c0; --txt-dim:#7a7a7a; --hi:#ffffff;
            --accent:#0070e0; --accent-hi:#1a8cff; --warn:#e5a50a; --ok:#4caf50; --sel:#26bbff;
            position:fixed; top:80px; right:20px; width:320px; z-index:2147483646;
            background:var(--bg1); color:var(--txt);
            border:1px solid var(--line); border-radius:4px;
            box-shadow:0 0 0 1px #000, 0 12px 40px rgba(0,0,0,.7);
            font:12px/1.35 "Roboto","Segoe UI",Arial,sans-serif; overflow:hidden;
            user-select:none;
        }
        #${ID} *{box-sizing:border-box}
        #${ID} .tb{display:flex; align-items:stretch; height:28px; background:var(--bg0);
            padding:0 4px 0 0; cursor:move; border-bottom:1px solid var(--line)}
        #${ID} .tab{display:flex; align-items:center; gap:6px; padding:0 12px; cursor:pointer;
            color:var(--txt-dim); border-top:2px solid transparent; font-weight:500; letter-spacing:.2px}
        #${ID} .tab:hover{color:var(--txt); background:#121212}
        #${ID} .tab.act{background:var(--bg1); color:var(--hi); border-top-color:var(--warn)}
        #${ID} .tab svg{width:12px; height:12px; fill:currentColor}
        #${ID} .tab.act svg{fill:var(--warn)}
        #${ID} .tb .sp{flex:1}
        #${ID} .wb{width:26px; margin:3px 0; display:flex; align-items:center; justify-content:center;
            color:var(--txt-dim); cursor:pointer; border-radius:2px; font-size:14px}
        #${ID} .wb:hover{background:var(--bg4); color:var(--hi)}
        #${ID} .wb.x:hover{background:#c42b1c; color:#fff}
        #${ID} .page{display:none}
        #${ID} .page.act{display:block}
        #${ID} .tools{display:flex; gap:6px; align-items:center; padding:6px; background:var(--bg2); border-bottom:1px solid var(--line)}
        #${ID} .srch{flex:1; min-width:0; height:24px; background:var(--bg0); border:1px solid #383838; border-radius:12px;
            color:var(--txt); padding:0 10px 0 24px; font:inherit; outline:none;
            background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%237a7a7a' d='M6.5 1a5.5 5.5 0 014.38 8.82l3.65 3.65-1.06 1.06-3.65-3.65A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z'/%3E%3C/svg%3E");
            background-repeat:no-repeat; background-position:8px center; background-size:11px}
        #${ID} .srch:focus{border-color:var(--accent)}
        #${ID} .mode{flex:none; height:20px; padding:0 8px; display:flex; align-items:center; border-radius:2px;
            background:var(--bg0); border:1px solid #383838; color:var(--sel); font-size:10.5px;
            text-transform:uppercase; letter-spacing:.5px; font-weight:700}
        #${ID} .mode.none{color:var(--txt-dim)}
        #${ID} .cat{display:flex; align-items:center; gap:6px; height:26px; padding:0 8px;
            background:var(--bg3); color:var(--hi); font-weight:700; text-transform:uppercase;
            font-size:11px; letter-spacing:.6px; cursor:pointer; border-bottom:1px solid var(--line)}
        #${ID} .cat .arr{display:inline-block; transition:transform .12s; color:var(--txt-dim); font-size:9px}
        #${ID} .cat.closed .arr{transform:rotate(-90deg)}
        #${ID} .cat .cnt{margin-left:auto; font-weight:400; color:var(--txt-dim); text-transform:none; letter-spacing:0}
        #${ID} .bd{max-height:50vh; overflow:auto; background:var(--bg1)}
        #${ID} .bd::-webkit-scrollbar{width:8px}
        #${ID} .bd::-webkit-scrollbar-thumb{background:#3a3a3a; border-radius:4px}
        #${ID} .bd::-webkit-scrollbar-track{background:var(--bg1)}
        #${ID} .rows.closed{display:none}
        #${ID} .row{display:flex; align-items:center; min-height:28px; border-bottom:1px solid var(--line);
            background:var(--bg2)}
        #${ID} .rows .row:nth-child(even){background:#1d1d1d}
        #${ID} .row:hover{background:#2a2a2a !important}
        #${ID} .row.cur{box-shadow:inset 2px 0 0 var(--sel)}
        #${ID} .row .k{flex:1; padding:0 8px 0 22px; color:var(--txt); white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
        #${ID} .row .k i{color:var(--txt-dim); font-style:normal; margin-right:6px; font-family:Consolas,monospace; font-size:11px}
        #${ID} .row .v{width:130px; padding:4px 6px; border-left:1px solid var(--line); align-self:stretch; display:flex; align-items:center}
        #${ID} .num{width:100%; height:20px; background:var(--bg0); border:1px solid #383838; border-radius:2px;
            color:var(--warn); font:600 12px Consolas,"Roboto Mono",monospace; padding:0 6px; display:flex;
            align-items:center; justify-content:space-between; gap:4px; cursor:pointer; overflow:hidden}
        #${ID} .num span.t{overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
        #${ID} .num:hover{border-color:#5a5a5a; color:#ffc94d}
        #${ID} .num .dot{flex:none; width:6px; height:6px; border-radius:50%; background:#3a3a3a}
        #${ID} .row.ok .num{color:var(--ok); border-color:#2d5a2f}
        #${ID} .row.ok .num .dot{background:var(--ok); box-shadow:0 0 4px var(--ok)}
        #${ID} .empty{padding:18px; color:var(--txt-dim); text-align:center; font-style:italic}
        #${ID} .sel,#${ID} .inp{width:100%; height:20px; background:var(--bg0); border:1px solid #383838; border-radius:2px;
            color:var(--txt); font:inherit; padding:0 4px; outline:none}
        #${ID} .sel{cursor:pointer}
        #${ID} .inp{color:var(--warn); font-family:Consolas,monospace}
        #${ID} .sel:focus,#${ID} .inp:focus{border-color:var(--accent)}
        #${ID} .sel option{background:var(--bg2)}
        #${ID} .chk{width:16px; height:16px; border:1px solid #444; border-radius:2px; background:var(--bg0);
            cursor:pointer; display:flex; align-items:center; justify-content:center}
        #${ID} .chk:hover{border-color:#6a6a6a}
        #${ID} .chk.on{background:var(--accent); border-color:var(--accent)}
        #${ID} .chk.on::after{content:''; width:4px; height:8px; border:solid #fff; border-width:0 2px 2px 0;
            transform:rotate(45deg) translate(-1px,-1px)}
        #${ID} .ft{display:flex; gap:4px; padding:6px; background:var(--bg2); border-top:1px solid var(--line)}
        #${ID} button{flex:1; height:26px; border:1px solid #000; border-radius:3px; cursor:pointer;
            font:500 11px "Roboto","Segoe UI",sans-serif; color:var(--txt); background:var(--bg4);
            display:flex; align-items:center; justify-content:center; gap:5px; white-space:nowrap}
        #${ID} button:hover{background:#3d3d3d; color:var(--hi)}
        #${ID} button:active{background:#1f1f1f}
        #${ID} button:disabled{opacity:.5; cursor:default}
        #${ID} button.pri{background:var(--accent); color:#fff}
        #${ID} button.pri:hover{background:var(--accent-hi)}
        #${ID} button.on{box-shadow:inset 0 -2px 0 var(--sel); color:var(--hi)}
        #${ID} button svg{width:11px; height:11px; fill:currentColor}
        #${ID} .sb{height:20px; display:flex; align-items:center; gap:8px; padding:0 8px; background:var(--bg0);
            color:var(--txt-dim); font-size:10.5px; border-top:1px solid var(--line)}
        #${ID} .sb .led{width:7px; height:7px; border-radius:50%; background:var(--ok); box-shadow:0 0 5px var(--ok)}
        #${ID} .sb .led.busy{background:var(--warn); box-shadow:0 0 5px var(--warn)}
        #${ID} .sb .r{margin-left:auto}
        #${ID}.min .page,#${ID}.min .sb{display:none !important}
        .es-answer{display:inline-block; margin-left:6px; padding:1px 6px; border-radius:2px;
            background:#151515; color:#e5a50a; border:1px solid #000;
            font:600 12px Consolas,monospace; vertical-align:middle; box-shadow:0 1px 3px rgba(0,0,0,.4)}
        .es-correct{outline:3px solid #e5a50a !important; outline-offset:2px; box-shadow:0 0 12px rgba(229,165,10,.6) !important}
    `;

    const ICON_DETAILS = '<svg viewBox="0 0 16 16"><path d="M2 2h12v2H2zm0 5h12v2H2zm0 5h8v2H2z"/></svg>';
    const ICON_GEAR = '<svg viewBox="0 0 16 16"><path d="M9.4 1l.4 1.9c.4.2.8.4 1.2.7l1.8-.6 1.4 2.4-1.4 1.3a5 5 0 010 1.4l1.4 1.3-1.4 2.4-1.8-.6c-.4.3-.8.5-1.2.7L9.4 15H6.6l-.4-1.9c-.4-.2-.8-.4-1.2-.7l-1.8.6-1.4-2.4 1.4-1.3a5 5 0 010-1.4L1.8 6.6l1.4-2.4 1.8.6c.4-.3.8-.5 1.2-.7L6.6 1zM8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/></svg>';
    const ICON_FILL = '<svg viewBox="0 0 16 16"><path d="M6 11.2 2.8 8 1.4 9.4 6 14l9-9-1.4-1.4z"/></svg>';
    const ICON_EYE = '<svg viewBox="0 0 16 16"><path d="M8 3C4 3 1 8 1 8s3 5 7 5 7-5 7-5-3-5-7-5zm0 8a3 3 0 110-6 3 3 0 010 6z"/></svg>';
    const ICON_REF = '<svg viewBox="0 0 16 16"><path d="M13.6 2.4A7.9 7.9 0 008 0a8 8 0 108 8h-2a6 6 0 11-1.8-4.2L9 7h7V0z"/></svg>';
    const ICON_RESET = '<svg viewBox="0 0 16 16"><path d="M2.4 2.4A7.9 7.9 0 018 0a8 8 0 11-8 8h2a6 6 0 101.8-4.2L7 7H0V0z"/></svg>';

    const panel = document.createElement('div');
    panel.id = ID;
    document.body.appendChild(panel);

    let tab = 'details';
    let labelsOn = cfg.inlineDefault;
    let busy = false;
    let collapsed = { answers: false, general: false, behaviour: false };
    let items = [];
    let statusMsg = null;

    const $ = (sel) => panel.querySelector(sel);

    const setStatus = (msg) => {
        statusMsg = msg;
        const el = $('.st');
        if (el) el.textContent = typeof msg === 'function' ? msg() : msg;
    };
    const setBusy = (b) => {
        busy = b;
        $('.sb .led')?.classList.toggle('busy', b);
        const f = $('.fill');
        if (f) f.disabled = b;
    };

    const markFilled = () => {
        let done = 0;
        panel.querySelectorAll('.page.details .row').forEach((row) => {
            const it = items[+row.dataset.i];
            if (!it) return;
            const ok = it.isDone();
            row.classList.toggle('ok', ok);
            row.classList.toggle('cur', stepped() && it.isCurrent());
            if (ok) done++;
        });
        const c = $('.sb .r');
        if (c) c.textContent = items.length ? T().filledCount(done, items.length) : '';
    };

    const renderLabels = () => {
        document.querySelectorAll('.es-answer').forEach((el) => el.remove());
        document.querySelectorAll('.es-correct').forEach((el) => el.classList.remove('es-correct'));
        if (!labelsOn) return;
        items.forEach((it) => {
            if (it.highlight) {
                it.anchor?.classList.add('es-correct');
            } else {
                const tag = document.createElement('span');
                tag.className = 'es-answer';
                tag.textContent = it.answer;
                it.anchor.after(tag);
            }
        });
    };

    const applySearch = () => {
        const q = ($('.srch')?.value || '').trim().toLowerCase();
        panel.querySelectorAll('.page.details .row').forEach((row) => {
            const it = items[+row.dataset.i];
            const label = (it.problem || T().question(it.n + 1)).toLowerCase();
            row.style.display = !q || label.includes(q) || it.answer.toLowerCase().includes(q) ? '' : 'none';
        });
    };

    const clickNext = () => {
        const next = document.getElementById('nextbutton');
        if (next && !next.disabled && !next.classList.contains('notClickable')) { next.click(); return true; }
        return false;
    };

    const advance = async (it) => {
        if (!cfg.autoAdvance || it.n >= items.length - 1) return;
        await waitFor(() => it.isDone(), 3000);
        await sleep(cfg.delay);
        await waitFor(clickNext, 3000);
        await sleep(Math.max(150, cfg.delay / 2));
    };

    const runSteps = async () => {
        setBusy(true);
        try {
            for (let i = 0; i < items.length; i++) {
                const it = items[i];
                if (it.isDone()) continue;
                if (!(await waitFor(() => it.isCurrent(), 4000))) break;
                setStatus(() => T().answering(i + 1, items.length));
                await it.fill();
                markFilled();
                if (!cfg.autoAdvance || i === items.length - 1) break;
                await advance(it);
            }
        } finally {
            setBusy(false);
            markFilled();
            const all = items.every((it) => it.isDone());
            setStatus(() => (all ? T().doneSteps : T().ready));
        }
    };

    const fillOne = async (it) => {
        if (stepped()) {
            if (!it.isCurrent()) { setStatus(() => T().notCurrent); return; }
            setBusy(true);
            try {
                await it.fill();
                markFilled();
                setStatus(() => T().set(it.n, it.answer));
                await advance(it);
            } finally {
                setBusy(false);
                setTimeout(markFilled, 300);
            }
            return;
        }
        it.fill();
        markFilled();
        setStatus(() => T().set(it.n, it.answer));
    };

    const fillAll = () => {
        if (busy) return;
        if (stepped()) { runSteps(); return; }
        items.forEach((it) => it.fill());
        markFilled();
        const n = items.length;
        setStatus(() => T().filled(n));
    };

    const catHtml = (key, title, extra = '') =>
        `<div class="cat${collapsed[key] ? ' closed' : ''}" data-cat="${key}"><span class="arr">&#9660;</span>${esc(title)}${extra}</div>`;

    const detailsBody = () => {
        const t = T();
        if (!items.length) return `<div class="empty">${esc(t.noAnswers)}</div>`;
        return catHtml('answers', t.answers, `<span class="cnt">${esc(t.items(items.length))}</span>`) +
            `<div class="rows${collapsed.answers ? ' closed' : ''}" data-rows="answers">` +
            items.map((it) => `
                <div class="row" data-i="${it.n}">
                    <div class="k" title="${esc(it.problem || '')}"><i>[${it.n}]</i>${esc(it.problem || t.question(it.n + 1))}</div>
                    <div class="v"><div class="num" title="${esc(t.clickToFill)}"><span class="t">${esc(it.answer)}</span><span class="dot"></span></div></div>
                </div>`).join('') +
            '</div>';
    };

    const settingRow = (label, tip, control) => `
        <div class="row" title="${esc(tip)}">
            <div class="k">${esc(label)}</div>
            <div class="v">${control}</div>
        </div>`;

    const chk = (k) => `<div class="chk${cfg[k] ? ' on' : ''}" data-key="${k}"></div>`;

    const settingsBody = () => {
        const t = T();
        return catHtml('general', t.general) +
            `<div class="rows${collapsed.general ? ' closed' : ''}" data-rows="general">` +
            settingRow(t.language, t.languageTip,
                `<select class="sel lang">
                    <option value="en"${cfg.lang === 'en' ? ' selected' : ''}>English</option>
                    <option value="sv"${cfg.lang === 'sv' ? ' selected' : ''}>Svenska</option>
                </select>`) +
            '</div>' +
            catHtml('behaviour', t.behaviour) +
            `<div class="rows${collapsed.behaviour ? ' closed' : ''}" data-rows="behaviour">` +
            settingRow(t.autoFill, t.autoFillTip, chk('autoFill')) +
            settingRow(t.inlineDefault, t.inlineDefaultTip, chk('inlineDefault')) +
            settingRow(t.autoRefresh, t.autoRefreshTip, chk('autoRefresh')) +
            settingRow(t.autoAdvance, t.autoAdvanceTip, chk('autoAdvance')) +
            settingRow(t.autoCheck, t.autoCheckTip, chk('autoCheck')) +
            settingRow(t.typeChars, t.typeCharsTip, chk('typeChars')) +
            settingRow(t.delay, t.delayTip, `<input class="inp delay" type="number" min="0" step="50" value="${+cfg.delay}">`) +
            '</div>';
    };

    const build = () => {
        const t = T();
        const q = $('.srch')?.value || '';
        const modeName = mode ? mode.name() : t.modeNone;
        panel.innerHTML = `
            <style>${css}</style>
            <div class="tb">
                <div class="tab${tab === 'details' ? ' act' : ''}" data-tab="details">${ICON_DETAILS}${esc(t.details)}</div>
                <div class="tab${tab === 'settings' ? ' act' : ''}" data-tab="settings">${ICON_GEAR}${esc(t.settings)}</div>
                <div class="sp"></div>
                <div class="wb mn" title="${esc(t.minimize)}">&#8211;</div>
                <div class="wb x" title="${esc(t.close)}">&#10005;</div>
            </div>
            <div class="page details${tab === 'details' ? ' act' : ''}">
                <div class="tools">
                    <input class="srch" placeholder="${esc(t.search)}" spellcheck="false">
                    <div class="mode${mode ? '' : ' none'}" title="${esc(t.mode)}">${esc(modeName)}</div>
                </div>
                <div class="bd">${detailsBody()}</div>
                <div class="ft">
                    <button class="pri fill"${busy ? ' disabled' : ''}>${ICON_FILL}${esc(t.fillAll)}</button>
                    <button class="lbl${labelsOn ? ' on' : ''}">${ICON_EYE}${esc(t.showInline)}</button>
                    <button class="ref">${ICON_REF}${esc(t.refresh)}</button>
                </div>
            </div>
            <div class="page settings${tab === 'settings' ? ' act' : ''}">
                <div class="bd">${settingsBody()}</div>
                <div class="ft"><button class="reset">${ICON_RESET}${esc(t.reset)}</button></div>
            </div>
            <div class="sb"><span class="led${busy ? ' busy' : ''}"></span><span class="st"></span><span class="r"></span></div>`;

        $('.srch').value = q;
        wire();
        markFilled();
        applySearch();
        setStatus(statusMsg || (() => T().ready));
    };

    const refreshData = () => {
        items = collect();
        build();
        renderLabels();
        if (!items.length) setStatus(() => T().nothing);
    };

    const wire = () => {
        panel.querySelectorAll('.tab').forEach((el) => {
            el.onclick = () => { tab = el.dataset.tab; build(); };
        });
        $('.mn').onclick = () => panel.classList.toggle('min');
        $('.x').onclick = () => {
            panel.remove();
            document.querySelectorAll('.es-answer').forEach((el) => el.remove());
            document.querySelectorAll('.es-correct').forEach((el) => el.classList.remove('es-correct'));
            observer.disconnect();
            clearInterval(window.__esAnswerPoll);
        };

        panel.querySelectorAll('.cat').forEach((el) => {
            el.onclick = () => {
                const k = el.dataset.cat;
                collapsed[k] = !collapsed[k];
                el.classList.toggle('closed', collapsed[k]);
                panel.querySelector(`[data-rows="${k}"]`)?.classList.toggle('closed', collapsed[k]);
            };
        });

        const srch = $('.srch');
        srch.addEventListener('input', applySearch);
        srch.addEventListener('keydown', (e) => e.stopPropagation());

        panel.querySelectorAll('.num').forEach((el) => {
            el.onclick = () => { if (!busy) fillOne(items[+el.closest('.row').dataset.i]); };
        });
        items.forEach((it) => {
            const inp = it.hookInput;
            if (inp && !inp.dataset.esHooked) {
                inp.dataset.esHooked = '1';
                inp.addEventListener('input', markFilled);
            }
        });

        $('.fill').onclick = fillAll;
        $('.lbl').onclick = (e) => {
            labelsOn = !labelsOn;
            e.currentTarget.classList.toggle('on', labelsOn);
            renderLabels();
            setStatus(() => (labelsOn ? T().inlineOn : T().inlineOff));
        };
        $('.ref').onclick = () => { refreshData(); setStatus(() => T().refreshed); };

        $('.lang').onchange = (e) => {
            cfg.lang = e.target.value;
            save();
            setStatus(() => T().saved);
            build();
        };
        panel.querySelectorAll('.chk').forEach((el) => {
            el.onclick = () => {
                const k = el.dataset.key;
                cfg[k] = !cfg[k];
                el.classList.toggle('on', cfg[k]);
                save();
                if (k === 'autoRefresh') toggleObserver();
                setStatus(() => T().saved);
            };
        });
        const delay = $('.delay');
        delay.addEventListener('keydown', (e) => e.stopPropagation());
        delay.onchange = () => {
            cfg.delay = Math.max(0, Math.min(10000, parseInt(delay.value, 10) || 0));
            delay.value = cfg.delay;
            save();
            setStatus(() => T().saved);
        };
        $('.reset').onclick = () => {
            cfg = { ...DEFAULTS };
            save();
            toggleObserver();
            setStatus(() => T().resetDone);
            build();
        };

        $('.tb').addEventListener('mousedown', (e) => {
            if (e.target.closest('.wb, .tab')) return;
            e.preventDefault();
            const r = panel.getBoundingClientRect();
            const dx = e.clientX - r.left, dy = e.clientY - r.top;
            const move = (ev) => {
                panel.style.left = Math.min(innerWidth - 60, Math.max(0, ev.clientX - dx)) + 'px';
                panel.style.top = Math.min(innerHeight - 28, Math.max(0, ev.clientY - dy)) + 'px';
                panel.style.right = 'auto';
            };
            const up = () => { removeEventListener('mousemove', move); removeEventListener('mouseup', up); };
            addEventListener('mousemove', move);
            addEventListener('mouseup', up);
        });
    };

    const board = document.querySelector('form#response') || document.body;
    let timer;
    let lastSig = '';
    const signature = () => (mode?.key || '') + ':' + items.map((it) => it.problem + '=' + it.answer).join('|');
    const observer = new MutationObserver((muts) => {
        if (busy) return;
        const ours = muts.every((m) =>
            panel.contains(m.target) || m.target === panel ||
            [...m.addedNodes, ...m.removedNodes].every((n) => n === panel || n.nodeType !== 1 || n.classList?.contains('es-answer')));
        if (ours) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
            const before = lastSig;
            items = collect();
            lastSig = signature();
            if (lastSig === before) { markFilled(); return; }
            build();
            renderLabels();
            if (cfg.autoFill) fillAll();
        }, 250);
    });
    const toggleObserver = () => {
        observer.disconnect();
        if (cfg.autoRefresh) observer.observe(board, { childList: true, subtree: true });
    };

    window.__esAnswerPoll = setInterval(() => {
        if (document.getElementById(ID)) markFilled();
    }, 500);

    refreshData();
    lastSig = signature();
    if (cfg.autoFill && items.length) fillAll();
    toggleObserver();
})();