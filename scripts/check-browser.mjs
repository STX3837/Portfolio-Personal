// Dependency-free local Chromium QA. Run against `npm run preview`.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const previewResponse = await fetch(base);
assert.ok(previewResponse.ok, `Preview is not ready: ${base} returned HTTP ${previewResponse.status}. Finish the build before starting preview.`);
const cvPath = '/cv/Alberto_Paleteiro_CV_ES.pdf';
const pdfResponse = await fetch(base + cvPath, { redirect: 'error' });
assert.equal(pdfResponse.status, 200, 'CV available without authentication');
assert.ok(pdfResponse.headers.get('content-type')?.includes('application/pdf'));
assert.deepEqual(Buffer.from(await pdfResponse.arrayBuffer()), await readFile(resolve('public', '.' + cvPath)), 'Preview serves the original PDF');
const executable = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
assert.ok(executable, 'Set CHROME_PATH to an installed Chromium browser.');
const output = resolve(process.env.QA_OUTPUT_DIR || '.verification');
const profile = resolve(output, `chrome-${process.pid}`);
await mkdir(profile, { recursive: true });
const browser = spawn(executable, ['--headless=new', '--remote-debugging-port=0',
  `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
const delay = ms => new Promise(done => setTimeout(done, ms));
async function until(fn) {
  for (let i = 0; i < 150; i++) { const value = await fn(); if (value) return value; await delay(100); }
  throw new Error('Browser readiness timed out.');
}
try {
  const port = await until(async () => (await readFile(resolve(profile, 'DevToolsActivePort'), 'utf8').catch(() => '')).split('\n')[0]);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((done, fail) => { socket.addEventListener('open', done, { once: true }); socket.addEventListener('error', fail, { once: true }); });
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const request = pending.get(message.id); if (!request) return;
    clearTimeout(request.timeout); pending.delete(message.id);
    if (message.error) request.fail(new Error(JSON.stringify(message.error))); else request.done(message.result);
  });
  const send = (method, params = {}) => new Promise((done, fail) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); fail(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(id, { done, fail, timeout }); socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await send('Page.enable'); await send('Runtime.enable');
  async function navigate(route) {
    await send('Page.navigate', { url: base + route });
    await until(() => evaluate(`location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete'`));
    await evaluate('document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))');
  }
  const results = [];
  const paths = ['/', '/en/', ...['distans', 'puerto-dataspace-edc', 'aura'].flatMap(slug => [`/projects/${slug}/`, `/en/projects/${slug}/`])];
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const theme of ['light', 'dark']) {
      await navigate('/'); await evaluate(`localStorage.setItem('theme', '${theme}')`);
      for (const path of paths) {
        await navigate(path);
        await evaluate("Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); }))");
        assert.equal(await evaluate("document.querySelectorAll('.project-art').length"), path.includes('/projects/') ? 1 : 3, 'Conceptual fallback without configured screenshots');
        if (path === '/' || path === '/en/') {
          const contact = await evaluate(`Array.from(document.querySelectorAll('#contact a'), a => ({ href: a.getAttribute('href'), text: a.textContent, label: a.getAttribute('aria-label'), target: a.target, rel: a.rel }))`);
          for (const href of ['https://github.com/STX3837', 'https://www.linkedin.com/in/alberto-josé-paleteiro-lópez-78a90b413']) {
            const link = contact.find(a => a.href === href);
            assert.ok(link?.text.trim(), 'Named contact link');
            assert.equal(link.target, '_blank');
            assert.ok(link.rel.includes('noopener') && link.rel.includes('noreferrer'));
          }
          const mail = contact.find(a => a.href === 'mailto:alberto.paleteiro.dev@gmail.com');
          assert.ok(mail?.text.includes('alberto.paleteiro.dev@gmail.com'));
          assert.equal(mail.label, (path === '/' ? 'Enviar email' : 'Send email') + ': alberto.paleteiro.dev@gmail.com');
          const cv = await evaluate("Array.from(document.querySelectorAll('a[download]'), a => ({ href:a.getAttribute('href'), label:a.textContent.trim(), language:a.hreflang, type:a.type, decorative:a.querySelector('span')?.getAttribute('aria-hidden') }))");
          assert.deepEqual(cv, [{ href:cvPath, label:(path === '/' ? 'Descargar CV' : 'Download CV (Spanish)')+' ↓', language:'es', type:'application/pdf', decorative:'true' }]);
        }
        if (path.endsWith('/projects/distans/')) {
          const context = await evaluate("Array.from(document.querySelectorAll('.project-context li'), item => item.textContent)");
          assert.equal(context.length, 3);
          assert.equal(context[2], path.startsWith('/en/') ? 'Grade: 8.6/10' : 'Calificación: 8,6/10');
          assert.equal(context[1], path.startsWith('/en/') ? 'Developed by a two-person team' : 'Desarrollado por dos personas');
          assert.equal(await evaluate("Array.from(document.querySelectorAll('.implementation-card')).some(card => card.textContent.includes('8,6/10') || card.textContent.includes('8.6/10'))"), false, 'No per-implementation grade');
          const screenshots = await evaluate(`Array.from(document.querySelectorAll('.screenshot-with-caption img'), image => ({
            src: image.getAttribute('src'), alt: image.alt, width: image.naturalWidth, height: image.naturalHeight,
            declaredWidth: Number(image.getAttribute('width')), declaredHeight: Number(image.getAttribute('height')),
            ratio: image.clientWidth / image.clientHeight,
          }))`);
          assert.equal(screenshots.length, 5, 'Five screenshots, each displayed once');
          assert.equal(new Set(screenshots.map(image => image.src)).size, screenshots.length, 'No duplicate screenshots');
          assert.deepEqual([...new Set(screenshots.map(image => image.src))].sort(), ['/images/projects/distans-fastapi-catalogue.png', '/images/projects/distans-fastapi-products.png', '/images/projects/django-carrito.png', '/images/projects/django-catalogo.png', '/images/projects/fastapi-mapa-mobile.png']);
          for (const image of screenshots) {
            assert.ok(image.alt.length > 40, 'Descriptive image alt');
            assert.equal(image.width, image.declaredWidth); assert.equal(image.height, image.declaredHeight);
            assert.ok(Math.abs(image.ratio - image.width / image.height) < .03, 'Screenshot proportions');
          }
          const groups = await evaluate("Array.from(document.querySelectorAll('.implementation-gallery'), group => ({ implementation: group.dataset.implementation, files: Array.from(group.querySelectorAll('img'), image => image.getAttribute('src').split('/').pop()) }))");
          assert.deepEqual(groups, [
            { implementation: 'django', files: ['django-catalogo.png', 'django-carrito.png'] },
            { implementation: 'fastapi', files: ['distans-fastapi-catalogue.png', 'distans-fastapi-products.png', 'fastapi-mapa-mobile.png'] },
          ], 'Screenshots associated with the correct implementation');
          assert.ok(await evaluate("document.querySelector('.screenshot-portrait img').clientWidth <= 280"), 'Mobile map width is bounded');
          assert.equal(await evaluate("document.querySelector('.concurrency-case').closest('details') === null"), true);
          assert.equal(await evaluate("document.querySelector('.technical-references').open"), false);
          assert.ok(await evaluate("document.querySelectorAll('.hero-tags li').length <= 6"));
          assert.equal(await evaluate("document.querySelectorAll('.reservation-outcomes span').length"), 2);
          assert.equal(await evaluate("document.querySelectorAll('.reservation-pair:first-child span').length"), 2);
          if (width >= 768) assert.equal(await evaluate("document.querySelector('.comparison-scroll').scrollWidth <= document.querySelector('.comparison-scroll').clientWidth"), true, 'Desktop comparison must fit');
        }
        if (path.endsWith('/projects/puerto-dataspace-edc/')) {
          const images = await evaluate("Array.from(document.querySelectorAll('.interface-gallery img'), image => ({src:image.getAttribute('src'), alt:image.alt, width:image.naturalWidth, height:image.naturalHeight, declaredWidth:Number(image.getAttribute('width')), declaredHeight:Number(image.getAttribute('height')), ratio:image.clientWidth/image.clientHeight}))");
          assert.equal(images.length, 6); assert.equal(new Set(images.map(image => image.src)).size, 6);
          for (const image of images) {
            assert.ok(image.src.startsWith('/images/projects/puerto-dataspace-edc/'));
            assert.ok(image.alt.length > 40); assert.equal(image.width,image.declaredWidth); assert.equal(image.height,image.declaredHeight);
            assert.ok(Math.abs(image.ratio-image.width/image.height)<.03, 'EDC screenshot proportions');
          }
          assert.deepEqual(await evaluate("Array.from(document.querySelectorAll('.implementation-gallery'), group => ({id:group.dataset.implementation,count:group.querySelectorAll('img').length}))"), [{id:'dashboard',count:2},{id:'manual-flow',count:2},{id:'provisioning',count:2}]);
        }
        if (path.endsWith('/projects/aura/')) {
          assert.equal(await evaluate("document.querySelector('.project-context').textContent"), path.startsWith('/en/') ? 'Collaborative project · 17-person team' : 'Proyecto colaborativo · Equipo de 17 personas');
          assert.equal(await evaluate("document.querySelector('.detail-heading .actions a').getAttribute('href')"), 'https://github.com/G4-AURA/AURA');
          assert.equal(await evaluate("document.querySelectorAll('.project-key-points article').length"), 3);
          assert.equal(await evaluate("document.querySelectorAll('img, .interface-gallery').length"), 0);
        }
        // Technical content must also fit when readers open the native disclosures.
        if (path.includes('/projects/')) await evaluate("document.querySelectorAll('.technical-section').forEach(section => section.open = true)");
        const result = await evaluate(`(() => {
          const root = document.documentElement;
          const visible = selector => getComputedStyle(document.querySelector(selector)).display !== 'none';
          const rgb = value => value.match(/[\\d.]+/g)?.slice(0, 3).map(Number);
          const luminance = color => rgb(color).map(v => v/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4).reduce((sum, v, i) => sum + v*[.2126,.7152,.0722][i], 0);
          const contrastFailures = [];
          let minContrast = Infinity;
          for (const element of document.querySelectorAll('body *')) {
            if (element.closest('[aria-hidden="true"]') || ['SCRIPT','STYLE'].includes(element.tagName) ||
                !element.getClientRects().length || !element.checkVisibility({ checkVisibilityCSS:true }) ||
                ![...element.childNodes].some(node => node.nodeType === 3 && node.textContent.trim())) continue;
            const style = getComputedStyle(element);
            let ancestor = element;
            while (ancestor.parentElement && getComputedStyle(ancestor).backgroundColor === 'rgba(0, 0, 0, 0)') ancestor = ancestor.parentElement;
            const background = getComputedStyle(ancestor).backgroundColor;
            const a = luminance(style.color), b = luminance(background);
            const ratio = (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
            minContrast = Math.min(minContrast, ratio);
            const size = parseFloat(style.fontSize);
            const required = size >= 24 || (size >= 18.66 && parseInt(style.fontWeight) >= 700) ? 3 : 4.5;
            if (ratio < required) contrastFailures.push({ text: element.textContent.trim().slice(0,70), ratio, required });
          }
          return { width: innerWidth, scrollWidth: root.scrollWidth, theme: root.dataset.theme,
            lang: root.lang, mobile: visible('.mobile-menu'), desktop: visible('.desktop-nav'),
            h1: document.querySelector('h1').textContent, minContrast, contrastFailures };
        })()`);
        results.push({ path, theme, ...result });
        assert.ok(result.scrollWidth <= width, `Horizontal overflow: ${path}, ${width}, ${theme}: ${result.scrollWidth}`);
        assert.equal(result.theme, theme); assert.equal(result.lang, path.startsWith('/en/') ? 'en' : 'es');
        assert.deepEqual(result.contrastFailures, [], `Text contrast: ${path}, ${width}, ${theme}`);
        assert.equal(result.mobile, width <= 620); assert.equal(result.desktop, width > 620);
        if (path === '/' || ((width === 320 || width === 1440) && path === '/en/') || ([375,768,1440].includes(width) && (path.endsWith('/projects/distans/') || path.endsWith('/projects/puerto-dataspace-edc/') || path.endsWith('/projects/aura/')))) {
          // Capture the default reading experience; expanded disclosures were checked above.
          await evaluate("document.querySelectorAll('.technical-section').forEach(section => section.open = false)");
          const metrics = await send('Page.getLayoutMetrics');
          const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
            clip: { x: 0, y: 0, width, height: metrics.cssContentSize.height, scale: 1 } });
          const name = `${path.startsWith('/en/') ? 'en' : 'es'}${path.includes('/projects/') ? '-' + path.split('/projects/')[1].split('/')[0] : ''}-${width}-${theme}.png`;
          await writeFile(resolve(output, name), Buffer.from(screenshot.data, 'base64'));
        }
        if ((path === '/' || path === '/en/') && [375,768,1440].includes(width)) {
          const clip = await evaluate(`(() => { const r=document.querySelector('#contact').getBoundingClientRect(); return { x:0, y:r.top+scrollY, width:innerWidth, height:document.documentElement.scrollHeight-r.top-scrollY, scale:1 }; })()`);
          const contactShot = await send('Page.captureScreenshot', { format:'png', captureBeyondViewport:true, clip });
          await writeFile(resolve(output, `${path === '/' ? 'es' : 'en'}-contact-${width}-${theme}.png`), Buffer.from(contactShot.data,'base64'));
        }
      }
    }
  }
  // Test real user input, persistence, system preference, denied storage and equivalent routes.
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: false });
  const click = async selector => {
    const point = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return { x:r.x+r.width/2, y:r.y+r.height/2 }; })()`);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
  };
  await navigate('/');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert.equal(await evaluate("document.activeElement.classList.contains('skip-link')"), true, 'Keyboard skip link');
  for (const route of ['/', '/en/']) {
    await navigate(route);
    await evaluate("(() => { const a=[...document.querySelectorAll('a')]; a[a.indexOf(document.querySelector('#contact a'))-1].focus(); })()");
    for (const href of ['mailto:alberto.paleteiro.dev@gmail.com',cvPath,'https://github.com/STX3837','https://www.linkedin.com/in/alberto-josé-paleteiro-lópez-78a90b413']) {
      await send('Input.dispatchKeyEvent', { type:'keyDown', key:'Tab', code:'Tab', windowsVirtualKeyCode:9 });
      assert.equal(await evaluate("document.activeElement.getAttribute('href')"), href, 'Contact keyboard order');
      assert.equal(await evaluate("getComputedStyle(document.activeElement).outlineStyle !== 'none'"), true, 'Contact visible focus');
    }
  }
  await navigate('/projects/distans/');
  await evaluate("document.querySelector('.implementation-card:last-child .project-link').focus()");
  for (const file of ['django-catalogo.png', 'django-carrito.png', 'distans-fastapi-catalogue.png', 'distans-fastapi-products.png', 'fastapi-mapa-mobile.png']) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    assert.equal(await evaluate("document.activeElement.closest('.implementation-gallery') !== null"), true, 'Keyboard reaches screenshot original');
    assert.equal(await evaluate(`document.activeElement.getAttribute('href') === '/images/projects/${file}'`), true);
    assert.equal(await evaluate("getComputedStyle(document.activeElement).outlineStyle !== 'none'"), true, 'Visible screenshot link focus');
  }
  await evaluate("[...document.querySelectorAll('.implementation-gallery a')].at(-1).focus()");
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert.equal(await evaluate("document.activeElement.classList.contains('comparison-scroll')"), true, 'Keyboard reaches comparison');
  assert.equal(await evaluate("getComputedStyle(document.activeElement).outlineStyle !== 'none'"), true, 'Visible table focus');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await until(() => evaluate("document.querySelector('.comparison-scroll').scrollLeft > 0"));
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, 'Table scroll stays inside its region');
  await evaluate("document.querySelector('.technical-references summary').focus()");
  const pressEnter = async () => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  };
  await pressEnter();
  await until(() => evaluate("document.querySelector('.technical-references').open"));
  await pressEnter();
  await until(() => evaluate("!document.querySelector('.technical-references').open"));
  await navigate('/projects/aura/');
  await evaluate("document.querySelector('.back-link').focus()");
  await send('Input.dispatchKeyEvent', {type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await send('Input.dispatchKeyEvent', {type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  assert.equal(await evaluate("document.activeElement.getAttribute('href')"),'https://github.com/G4-AURA/AURA','Keyboard reaches AURA team repository');
  assert.equal(await evaluate("getComputedStyle(document.activeElement).outlineStyle !== 'none'"),true,'AURA visible link focus');
  await evaluate("document.querySelector('.technical-references summary').focus()");
  await pressEnter(); await until(()=>evaluate("document.querySelector('.technical-references').open"));
  await navigate('/projects/puerto-dataspace-edc/');
  await evaluate("document.querySelector('.detail-heading .actions a:last-child').focus()");
  for (let index=0;index<6;index++) {
    await send('Input.dispatchKeyEvent', {type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await send('Input.dispatchKeyEvent', {type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    assert.equal(await evaluate(`document.activeElement === document.querySelectorAll('.interface-gallery a')[${index}]`),true,'Keyboard reaches each sanitized EDC original');
    assert.equal(await evaluate("getComputedStyle(document.activeElement).outlineStyle !== 'none'"),true,'EDC visible focus');
  }
  for (const route of ['/images/projects/puerto-dataspace/dashboard/Captura%20de%20pantalla%202026-11-10%20205558.png','/puerto-dataspace/dashboard/resultado.png','/.verification/iteration-7/originals/dashboard/Captura%20de%20pantalla%202026-11-10%20205558.png']) assert.equal((await fetch(base+route)).status,404,'Private originals must not be served');
  await navigate('/'); await click('.mobile-menu summary'); assert.equal(await evaluate("document.querySelector('.mobile-menu').open"), true);
  assert.equal(await evaluate("document.querySelector('.mobile-menu [aria-current]').dataset.section"), 'home');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  assert.equal(await evaluate("document.querySelector('.mobile-menu').open"), false);
  await click('.mobile-menu summary'); await click('.mobile-menu a[href="/#projects"]');
  await until(() => evaluate("location.hash === '#projects' && !document.querySelector('.mobile-menu').open"));
  await evaluate('scrollTo({ top: 0, behavior: "instant" })');
  await click('.theme-toggle'); assert.equal(await evaluate('document.documentElement.dataset.theme'), 'light');
  await navigate('/en/'); assert.equal(await evaluate('document.documentElement.dataset.theme'), 'light');
  await navigate('/projects/distans/'); await click('[data-language]');
  await until(() => evaluate("location.pathname === '/en/projects/distans/' && document.readyState === 'complete'"));
  await navigate('/'); await evaluate("location.hash = 'about'; document.querySelector('[data-language]').click()");
  await until(() => evaluate("location.pathname === '/en/' && location.hash === '#about'"));
  await evaluate('localStorage.removeItem("theme")');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  await navigate('/'); assert.equal(await evaluate('document.documentElement.dataset.theme'), 'dark');
  const blockedStorage = await send('Page.addScriptToEvaluateOnNewDocument', { source: "Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });" });
  await navigate('/'); assert.equal(await evaluate('document.documentElement.dataset.theme'), 'dark');
  await click('.theme-toggle'); assert.equal(await evaluate('document.documentElement.dataset.theme'), 'light');
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: blockedStorage.identifier });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate('getComputedStyle(document.documentElement).scrollBehavior'), 'auto');
  await writeFile(resolve(output, 'browser-results.json'), JSON.stringify({ browser: await send('Browser.getVersion'), cases: results, interactions: 'passed' }, null, 2));
  console.log(`PASS: ${results.length} page/viewport/theme cases, theme persistence/system/blocked storage, mobile menu, Escape, ES/EN routes and hash, reduced motion, keyboard and case study. Screenshots: ${output}`);
  await send('Browser.close').catch(() => {});
} finally { socket?.close(); browser.kill(); }
