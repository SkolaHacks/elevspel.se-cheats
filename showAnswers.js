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
    if (window.__esHotkey) removeEventListener('keydown', window.__esHotkey, true);
    document.querySelectorAll('.es-cell').forEach((el) => el.classList.remove('es-cell'));

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
            mode: 'Mode', modeCloze: 'Fill in', modeMC: 'Multiple choice', modeFree: 'Free input', modeMemory: 'Memory', modeNone: 'None',
            pair: (a, b) => `Cards ${a} + ${b}`,
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
            mode: 'Läge', modeCloze: 'Fyll i', modeMC: 'Flerval', modeFree: 'Skriv själv', modeMemory: 'Memory', modeNone: 'Inget',
            pair: (a, b) => `Kort ${a} + ${b}`,
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
        hotkey: 'F2',
        startMinimized: false,
        rememberPos: true,
        pos: null,
        width: 320,
        opacity: 100,
        accent: 'blue',
        badgeColor: 'orange',
        fontSize: 12,
        compact: false,
        jitter: 0,
        clozeTypeChars: false,
        clozeSkipFilled: false,
        mcPause: 0,
        mcHideWrong: false,
        typeSpeed: 110,
        freeUseAlt: false,
        memFlipGap: 250,
        memPairDelay: 1000,
        memOrder: 'board',
        gridColor: 'yellow',
        gridStepDelay: 40,
        gridOrder: 'list',
        gridShowPath: true,
    };

    const load = () => {
        try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORE) || '{}') }; }
        catch { return { ...DEFAULTS }; }
    };
    const save = () => {
        try { localStorage.setItem(STORE, JSON.stringify(cfg)); } catch {}
    };

    let cfg = load();
    const EXTRA = {
        en: {
            modeGrid: 'Letter board', notOnBoard: 'Not on board',
            copyright: 'Copyright (C) TeamZedra. All Rights Reserved.',
            cats: {
                general: 'General', appearance: 'Appearance', behaviour: 'Behaviour', cloze: 'Fill in',
                mc: 'Multiple choice', free: 'Free input', memory: 'Memory', grid: 'Letter board',
            },
            set: {
                lang: ['Language', 'Language of the panel'],
                hotkey: ['Toggle hotkey', 'Key that shows or hides the panel'],
                startMinimized: ['Start minimized', 'Open the panel collapsed'],
                rememberPos: ['Remember position', 'Reopen where you last dragged it'],
                width: ['Panel width (px)', 'Width of the panel'],
                opacity: ['Opacity (%)', 'Panel transparency'],
                accent: ['Accent colour', 'Colour of the main button and focus rings'],
                badgeColor: ['Badge colour', 'Colour of inline answer badges and outlines'],
                fontSize: ['Font size (px)', 'Text size in the panel'],
                compact: ['Compact rows', 'Tighter property rows'],
                autoFill: ['Auto-fill on load', 'Start answering as soon as the panel opens'],
                inlineDefault: ['Inline labels on load', 'Show answers on the board from the start'],
                autoRefresh: ['Auto-refresh', 'Re-read answers when the board changes'],
                delay: ['Step delay (ms)', 'Wait between answers'],
                jitter: ['Random extra delay (ms)', 'Adds up to this much random time to each step'],
                autoAdvance: ['Auto-advance', 'Press Next after each answer'],
                clozeTypeChars: ['Type letter by letter', 'Type each answer one key at a time'],
                clozeSkipFilled: ['Skip filled boxes', 'Leave boxes that already contain text'],
                mcPause: ['Pause before click (ms)', 'Wait before choosing an answer'],
                mcHideWrong: ['Dim wrong choices', 'With inline labels on, fade the wrong buttons'],
                autoCheck: ['Auto-check', 'Press Check after typing'],
                typeChars: ['Type letter by letter', 'Type one key at a time'],
                typeSpeed: ['Typing speed (ms/key)', 'Average time per key when typing'],
                freeUseAlt: ['Prefer alternative', 'Type the alternative spelling when one exists'],
                memFlipGap: ['Gap between cards (ms)', 'Time between flipping the two cards'],
                memPairDelay: ['Pause after pair (ms)', 'Time before flipping the next pair'],
                memOrder: ['Pair order', 'Order the pairs are flipped in'],
                gridColor: ['Highlight colour', 'Colour used to mark words on the board'],
                gridStepDelay: ['Drag speed (ms/letter)', 'Time per letter when selecting a word'],
                gridOrder: ['Word order', 'Order the words are selected in'],
                gridShowPath: ['Show word path', 'With inline labels on, mark every word on the board'],
            },
            opt: {
                off: 'Off', board: 'Board order', random: 'Random', list: 'List order',
                longest: 'Longest first', shortest: 'Shortest first',
                blue: 'Blue', orange: 'Orange', green: 'Green', purple: 'Purple', red: 'Red',
                cyan: 'Cyan', pink: 'Pink', yellow: 'Yellow',
            },
        },
        sv: {
            modeGrid: 'Bokstavsbräde', notOnBoard: 'Finns inte på brädet',
            copyright: 'Copyright (C) TeamZedra. All Rights Reserved.',
            cats: {
                general: 'Allmänt', appearance: 'Utseende', behaviour: 'Beteende', cloze: 'Fyll i',
                mc: 'Flerval', free: 'Skriv själv', memory: 'Memory', grid: 'Bokstavsbräde',
            },
            set: {
                lang: ['Språk', 'Panelens språk'],
                hotkey: ['Snabbtangent', 'Tangent som visar eller döljer panelen'],
                startMinimized: ['Starta minimerad', 'Öppna panelen hopfälld'],
                rememberPos: ['Kom ihåg position', 'Öppna där du senast släppte den'],
                width: ['Panelbredd (px)', 'Panelens bredd'],
                opacity: ['Opacitet (%)', 'Panelens genomskinlighet'],
                accent: ['Accentfärg', 'Färg på huvudknappen och fokusramar'],
                badgeColor: ['Märkesfärg', 'Färg på svarsmärken och ramar'],
                fontSize: ['Textstorlek (px)', 'Textstorlek i panelen'],
                compact: ['Kompakta rader', 'Tätare rader'],
                autoFill: ['Fyll i automatiskt', 'Börja svara direkt när panelen öppnas'],
                inlineDefault: ['Etiketter vid start', 'Visa svaren på spelplanen från början'],
                autoRefresh: ['Uppdatera automatiskt', 'Läs om svaren när spelplanen ändras'],
                delay: ['Fördröjning (ms)', 'Väntetid mellan svaren'],
                jitter: ['Slumpmässig extra tid (ms)', 'Lägger till upp till så mycket slumpad tid per steg'],
                autoAdvance: ['Gå vidare automatiskt', 'Tryck Nästa efter varje svar'],
                clozeTypeChars: ['Skriv bokstav för bokstav', 'Skriv varje svar en tangent i taget'],
                clozeSkipFilled: ['Hoppa över ifyllda', 'Lämna rutor som redan har text'],
                mcPause: ['Paus före klick (ms)', 'Vänta innan ett svar väljs'],
                mcHideWrong: ['Tona ned fel svar', 'Med etiketter på tonas fel knappar ned'],
                autoCheck: ['Rätta automatiskt', 'Tryck Rätta efter skrivandet'],
                typeChars: ['Skriv bokstav för bokstav', 'En tangent i taget'],
                typeSpeed: ['Skrivhastighet (ms/tangent)', 'Genomsnittlig tid per tangent'],
                freeUseAlt: ['Föredra alternativ', 'Skriv den alternativa stavningen när den finns'],
                memFlipGap: ['Tid mellan korten (ms)', 'Tid mellan att de två korten vänds'],
                memPairDelay: ['Paus efter par (ms)', 'Tid innan nästa par vänds'],
                memOrder: ['Parordning', 'Ordning som paren vänds i'],
                gridColor: ['Markeringsfärg', 'Färg som markerar orden på brädet'],
                gridStepDelay: ['Draghastighet (ms/bokstav)', 'Tid per bokstav när ett ord markeras'],
                gridOrder: ['Ordföljd', 'Ordning som orden markeras i'],
                gridShowPath: ['Visa ordens väg', 'Med etiketter på markeras varje ord på brädet'],
            },
            opt: {
                off: 'Av', board: 'Brädets ordning', random: 'Slumpad', list: 'Listans ordning',
                longest: 'Längst först', shortest: 'Kortast först',
                blue: 'Blå', orange: 'Orange', green: 'Grön', purple: 'Lila', red: 'Röd',
                cyan: 'Cyan', pink: 'Rosa', yellow: 'Gul',
            },
        },
    };
    const T = () => ({ ...(STRINGS[cfg.lang] || STRINGS.en), ...(EXTRA[cfg.lang] || EXTRA.en) });

    const SCHEMA = [
        ['general', [
            ['lang', 'select', ['en', 'sv']],
            ['hotkey', 'select', ['F2', 'F4', 'F8', 'F9', 'off']],
            ['startMinimized', 'bool'],
            ['rememberPos', 'bool'],
            ['width', 'num', 260, 640, 10],
            ['opacity', 'num', 30, 100, 5],
        ]],
        ['appearance', [
            ['accent', 'select', ['blue', 'orange', 'green', 'purple', 'red']],
            ['badgeColor', 'select', ['orange', 'cyan', 'green', 'pink']],
            ['fontSize', 'num', 10, 16, 1],
            ['compact', 'bool'],
        ]],
        ['behaviour', [
            ['autoFill', 'bool'],
            ['inlineDefault', 'bool'],
            ['autoRefresh', 'bool'],
            ['autoAdvance', 'bool'],
            ['delay', 'num', 0, 10000, 50],
            ['jitter', 'num', 0, 5000, 50],
        ]],
        ['cloze', [
            ['clozeTypeChars', 'bool'],
            ['clozeSkipFilled', 'bool'],
        ]],
        ['mc', [
            ['mcPause', 'num', 0, 5000, 50],
            ['mcHideWrong', 'bool'],
        ]],
        ['free', [
            ['autoCheck', 'bool'],
            ['typeChars', 'bool'],
            ['typeSpeed', 'num', 10, 1000, 10],
            ['freeUseAlt', 'bool'],
        ]],
        ['memory', [
            ['memFlipGap', 'num', 0, 3000, 50],
            ['memPairDelay', 'num', 0, 10000, 100],
            ['memOrder', 'select', ['board', 'random']],
        ]],
        ['grid', [
            ['gridColor', 'select', ['yellow', 'cyan', 'green', 'pink']],
            ['gridStepDelay', 'num', 0, 500, 10],
            ['gridOrder', 'select', ['list', 'longest', 'shortest', 'random']],
            ['gridShowPath', 'bool'],
        ]],
    ];

    const ACCENTS = {
        blue: ['#0070e0', '#1a8cff'], orange: ['#d9730d', '#f08c2a'], green: ['#2e8b3e', '#3fae52'],
        purple: ['#7b4fd6', '#9466f0'], red: ['#c4312b', '#e0463f'],
    };
    const BADGES = { orange: '#e5a50a', cyan: '#26bbff', green: '#4caf50', pink: '#ff5fa2' };
    const GRID = { yellow: 'rgba(255,214,0,.55)', cyan: 'rgba(38,187,255,.5)', green: 'rgba(76,175,80,.5)', pink: 'rgba(255,95,162,.5)' };
    const stepDelay = () => cfg.delay + Math.random() * cfg.jitter;
    const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
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

    const typeInto = async (input, text, chars = cfg.typeChars) => {
        input.focus();
        if (!chars) {
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
            await sleep(cfg.typeSpeed * (0.6 + Math.random() * 0.8));
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
                    await typeInto(input, cfg.freeUseAlt && alts[0] ? alts[0] : answer);
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

    const detectMemory = () => {
        const cards = [...document.querySelectorAll('#game_board .card[data-toggle]')];
        if (!cards.length) return null;
        const groups = new Map();
        cards.forEach((c) => {
            const k = c.dataset.toggle;
            if (!groups.has(k)) groups.set(k, []);
            groups.get(k).push(c);
        });
        const num = (c) => c.querySelector('.cardNumber')?.textContent.trim() || '?';
        const gone = (c) =>
            !c.querySelector('input[name="cardsLeft[]"]') ||
            /matched|found|solved|done|removed/.test(c.className) ||
            getComputedStyle(c).visibility === 'hidden' ||
            getComputedStyle(c).opacity === '0' ||
            !visible(c);
        return [...groups.values()]
            .filter((g) => g.length >= 2)
            .sort((a, b) => +num(a[0]) - +num(b[0]))
            .map(([a, b], i) => ({
                n: i,
                problem: T().pair(num(a), num(b)),
                answer: a.querySelector('.card_text')?.textContent.trim() || a.querySelector('input')?.value || '?',
                cards: [a, b],
                pairNo: i + 1,
                stepped: true,
                noNext: true,
                isCurrent: () => true,
                isDone: () => gone(a) && gone(b),
                fill: async () => {
                    if (gone(a) && gone(b)) return false;
                    a.click();
                    await sleep(cfg.memFlipGap);
                    b.click();
                    await sleep(cfg.memPairDelay + Math.random() * cfg.jitter);
                    return true;
                },
            }));
    };

    const detectGrid = () => {
        const board = document.getElementById('puzzle-board');
        const lis = [...document.querySelectorAll('#wordlist li')];
        if (!board || !lis.length) return null;
        const cells = [...board.querySelectorAll('.cell')];
        const size = Math.round(Math.sqrt(cells.length));
        const letter = (el) => el.textContent.trim().toUpperCase();
        const at = (r, c) => (r >= 0 && c >= 0 && r < size && c < size ? cells[r * size + c] : null);
        const DIRS = [[0, 1, '→'], [1, 0, '↓'], [1, 1, '↘'], [-1, 1, '↗'], [0, -1, '←'], [-1, 0, '↑'], [-1, -1, '↖'], [1, -1, '↙']];
        const find = (word) => {
            const w = [...word];
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    for (const [dr, dc, arrow] of DIRS) {
                        const path = [];
                        for (let k = 0; k < w.length; k++) {
                            const el = at(r + dr * k, c + dc * k);
                            if (!el || letter(el) !== w[k]) break;
                            path.push(el);
                        }
                        if (path.length === w.length) return { path, r, c, arrow };
                    }
                }
            }
            return null;
        };
        const pt = (el) => {
            const b = el.getBoundingClientRect();
            return { clientX: b.left + b.width / 2, clientY: b.top + b.height / 2, bubbles: true, cancelable: true, view: window, buttons: 1 };
        };
        const ev = (el, type, Ctor = MouseEvent) => el.dispatchEvent(new Ctor(type, pt(el)));
        return lis.map((li, i) => {
            const word = li.textContent.trim().toUpperCase();
            const hit = find(word);
            const path = hit?.path || null;
            const isDone = () =>
                li.className.trim() !== '' ||
                getComputedStyle(li).textDecorationLine.includes('line-through') ||
                +getComputedStyle(li).opacity < 1 ||
                (!!path && path.every((el) => /found|marked|done|solved|correct/.test(el.className)));
            return {
                n: i,
                problem: word,
                answer: hit ? `R${hit.r + 1} K${hit.c + 1} ${hit.arrow}` : T().notOnBoard,
                path,
                stepped: true,
                noNext: true,
                isCurrent: () => true,
                isDone,
                fill: async () => {
                    if (!path || isDone()) return false;
                    const first = path[0], last = path[path.length - 1];
                    ev(first, 'pointerdown', PointerEvent);
                    ev(first, 'mousedown');
                    for (const el of path) {
                        ev(el, 'pointerover', PointerEvent);
                        ev(el, 'pointermove', PointerEvent);
                        ev(el, 'mouseover');
                        ev(el, 'mouseenter');
                        ev(el, 'mousemove');
                        await sleep(cfg.gridStepDelay);
                    }
                    ev(last, 'pointerup', PointerEvent);
                    ev(last, 'mouseup');
                    document.dispatchEvent(new MouseEvent('mouseup', pt(last)));
                    await sleep(300);
                    if (isDone()) return true;
                    first.click();
                    await sleep(cfg.gridStepDelay * 2 + 50);
                    last.click();
                    await sleep(300);
                    if (isDone()) return true;
                    for (const el of path) { el.click(); await sleep(cfg.gridStepDelay + 30); }
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
                fill: async () => {
                    if (!input) return;
                    if (cfg.clozeSkipFilled && input.value !== '') return;
                    if (cfg.clozeTypeChars) { await typeInto(input, answer, true); return; }
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
                row,
                highlight: true,
                stepped: true,
                isCurrent: () => visible(row),
                isDone: () => !!chosen?.value,
                fill: async () => {
                    if (!right || !visible(row) || chosen?.value) return false;
                    if (cfg.mcPause) await sleep(cfg.mcPause);
                    (right.closest('.clickable') || right).click();
                    return true;
                },
            };
        });
    };

    const DETECTORS = [
        { key: 'grid', name: () => T().modeGrid, run: detectGrid },
        { key: 'memory', name: () => T().modeMemory, run: detectMemory },
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
    const stepped = () => ['mc', 'free', 'memory', 'grid'].includes(mode?.key);
    const orderList = () => {
        if (mode?.key === 'memory' && cfg.memOrder === 'random') return shuffle(items);
        if (mode?.key === 'grid') {
            if (cfg.gridOrder === 'random') return shuffle(items);
            if (cfg.gridOrder === 'longest') return [...items].sort((a, b) => b.problem.length - a.problem.length);
            if (cfg.gridOrder === 'shortest') return [...items].sort((a, b) => a.problem.length - b.problem.length);
        }
        return items;
    };

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
            background:#151515; color:var(--es-badge, #e5a50a); border:1px solid #000;
            font:600 12px Consolas,monospace; vertical-align:middle; box-shadow:0 1px 3px rgba(0,0,0,.4)}
        #${ID} .cr{height:18px; display:flex; align-items:center; justify-content:center; background:#0a0a0a;
            color:#555; font-size:9.5px; letter-spacing:.3px; border-top:1px solid var(--line)}
        #${ID}.min .cr{display:none}
        #${ID}.compact .row{min-height:22px}
        #${ID}.compact .row .v{padding:1px 6px}
        #${ID}.compact .num,#${ID}.compact .sel,#${ID}.compact .inp{height:18px}
        #${ID}.compact .cat{height:22px}
        .es-cell{background:var(--es-grid, rgba(255,214,0,.55)) !important; box-shadow:inset 0 0 0 2px rgba(0,0,0,.35)}
        .es-dim{opacity:.3 !important}
        .es-pair{position:absolute; top:4px; left:4px; margin:0; z-index:5; pointer-events:none}
        .card{position:relative}
        .es-correct{outline:3px solid var(--es-badge, #e5a50a) !important; outline-offset:2px; box-shadow:0 0 12px rgba(229,165,10,.6) !important}
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
            row.classList.toggle('cur', stepped() && !it.noNext && it.isCurrent());
            if (ok) done++;
        });
        const c = $('.sb .r');
        if (c) c.textContent = items.length ? T().filledCount(done, items.length) : '';
    };

    const renderLabels = () => {
        document.querySelectorAll('.es-answer').forEach((el) => el.remove());
        document.querySelectorAll('.es-correct').forEach((el) => el.classList.remove('es-correct'));
        document.querySelectorAll('.es-cell').forEach((el) => el.classList.remove('es-cell'));
        document.querySelectorAll('.es-dim').forEach((el) => el.classList.remove('es-dim'));
        if (!labelsOn) return;
        items.forEach((it) => {
            if (it.path !== undefined) {
                if (cfg.gridShowPath) it.path?.forEach((el) => el.classList.add('es-cell'));
            } else if (it.cards) {
                it.cards.forEach((c) => {
                    const tag = document.createElement('span');
                    tag.className = 'es-answer es-pair';
                    tag.textContent = it.pairNo;
                    c.appendChild(tag);
                });
            } else if (it.highlight) {
                it.anchor?.classList.add('es-correct');
                if (cfg.mcHideWrong) {
                    it.row?.querySelectorAll('.multipleChoices .btn').forEach((b) => {
                        if (b !== it.anchor) b.classList.add('es-dim');
                    });
                }
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
        await sleep(stepDelay());
        await waitFor(clickNext, 3000);
        await sleep(Math.max(150, cfg.delay / 2));
    };

    const runSteps = async () => {
        setBusy(true);
        try {
            const list = orderList();
            for (let i = 0; i < list.length; i++) {
                const it = list[i];
                if (it.isDone()) continue;
                if (!(await waitFor(() => it.isCurrent(), 4000))) break;
                setStatus(() => T().answering(i + 1, items.length));
                await it.fill();
                markFilled();
                if (it.noNext) continue;
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
        if (cfg.clozeTypeChars) {
            (async () => {
                setBusy(true);
                try {
                    for (const it of items) { await it.fill(); markFilled(); }
                } finally {
                    setBusy(false);
                    const n = items.length;
                    setStatus(() => T().filled(n));
                }
            })();
            return;
        }
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

    const optLabel = (k, v) => (k === 'lang' ? { en: 'English', sv: 'Svenska' }[v] : T().opt[v] || v);

    const control = ([k, type, a, b, step]) => {
        if (type === 'bool') return chk(k);
        if (type === 'select') {
            return `<select class="sel" data-key="${k}">` +
                a.map((v) => `<option value="${v}"${cfg[k] === v ? ' selected' : ''}>${esc(optLabel(k, v))}</option>`).join('') +
                '</select>';
        }
        return `<input class="inp" type="number" data-key="${k}" min="${a}" max="${b}" step="${step}" value="${+cfg[k]}">`;
    };

    const settingsBody = () => {
        const t = T();
        return SCHEMA.map(([cat, rows]) =>
            catHtml(cat, t.cats[cat], mode?.key === cat ? `<span class="cnt">●</span>` : '') +
            `<div class="rows${collapsed[cat] ? ' closed' : ''}" data-rows="${cat}">` +
            rows.map((r) => settingRow(t.set[r[0]][0], t.set[r[0]][1], control(r))).join('') +
            '</div>'
        ).join('');
    };

    const applyLook = () => {
        const [a, ah] = ACCENTS[cfg.accent] || ACCENTS.blue;
        panel.style.setProperty('--accent', a);
        panel.style.setProperty('--accent-hi', ah);
        panel.style.width = cfg.width + 'px';
        panel.style.opacity = cfg.opacity / 100;
        panel.style.fontSize = cfg.fontSize + 'px';
        panel.classList.toggle('compact', !!cfg.compact);
        document.documentElement.style.setProperty('--es-badge', BADGES[cfg.badgeColor] || BADGES.orange);
        document.documentElement.style.setProperty('--es-grid', GRID[cfg.gridColor] || GRID.yellow);
    };

    const afterChange = (k) => {
        save();
        if (k === 'autoRefresh') toggleObserver();
        if (k === 'lang' || k === 'memOrder' || k === 'gridOrder') { build(); }
        if (['mcHideWrong', 'gridShowPath', 'gridColor', 'badgeColor'].includes(k)) renderLabels();
        applyLook();
        setStatus(() => T().saved);
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
            <div class="sb"><span class="led${busy ? ' busy' : ''}"></span><span class="st"></span><span class="r"></span></div>
            <div class="cr">${esc(t.copyright)}</div>`;

        $('.srch').value = q;
        wire();
        applyLook();
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
            removeEventListener('keydown', onHotkey, true);
            document.querySelectorAll('.es-cell, .es-dim').forEach((el) => el.classList.remove('es-cell', 'es-dim'));
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

        panel.querySelectorAll('.page.settings .chk').forEach((el) => {
            el.onclick = () => {
                const k = el.dataset.key;
                cfg[k] = !cfg[k];
                el.classList.toggle('on', cfg[k]);
                afterChange(k);
            };
        });
        panel.querySelectorAll('.page.settings select.sel').forEach((el) => {
            el.onchange = () => {
                cfg[el.dataset.key] = el.value;
                afterChange(el.dataset.key);
            };
        });
        panel.querySelectorAll('.page.settings input.inp').forEach((el) => {
            el.addEventListener('keydown', (e) => e.stopPropagation());
            el.onchange = () => {
                const lo = +el.min, hi = +el.max;
                const v = Math.max(lo, Math.min(hi, parseInt(el.value, 10) || 0));
                el.value = v;
                cfg[el.dataset.key] = v;
                afterChange(el.dataset.key);
            };
        });
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
            const up = () => {
                removeEventListener('mousemove', move);
                removeEventListener('mouseup', up);
                if (cfg.rememberPos) {
                    cfg.pos = { left: panel.style.left, top: panel.style.top };
                    save();
                }
            };
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

    const onHotkey = (e) => {
        if (cfg.hotkey === 'off' || e.key !== cfg.hotkey) return;
        e.preventDefault();
        panel.style.display = panel.style.display === 'none' ? '' : 'none';
    };
    window.__esHotkey = onHotkey;
    addEventListener('keydown', onHotkey, true);

    if (cfg.rememberPos && cfg.pos?.left) {
        panel.style.left = cfg.pos.left;
        panel.style.top = cfg.pos.top;
        panel.style.right = 'auto';
    }
    if (cfg.startMinimized) panel.classList.add('min');

    refreshData();
    lastSig = signature();
    if (cfg.autoFill && items.length) fillAll();
    toggleObserver();
})();