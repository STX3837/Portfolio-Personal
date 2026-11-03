// Dependency-free local Chromium QA. Run against `npm run preview`.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const executable = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
assert.ok(executable, 'Set CHROME_PATH to an installed Chromium browser.');
const output = resolve('.verification');
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
  const paths = ['/', '/en/', ...['distans', 'aura', 'cyber-simulation'].flatMap(slug => [`/projects/${slug}/`, `/en/projects/${slug}/`])];
  for (const width of [320, 375, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const theme of ['light', 'dark']) {
      await navigate('/'); await evaluate(`localStorage.setItem('theme', '${theme}')`);
      for (const path of paths) {
        await navigate(path);
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
        if (path === '/' || ((width === 320 || width === 1440) && path === '/en/')) {
          const metrics = await send('Page.getLayoutMetrics');
          const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
            clip: { x: 0, y: 0, width, height: metrics.cssContentSize.height, scale: 1 } });
          await writeFile(resolve(output, `${path === '/' ? 'es' : 'en'}-${width}-${theme}.png`), Buffer.from(screenshot.data, 'base64'));
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
  console.log(`PASS: ${results.length} page/viewport/theme cases, theme persistence/system/blocked storage, mobile menu, Escape, ES/EN routes and hash, reduced motion. Screenshots: .verification/`);
  await send('Browser.close').catch(() => {});
} finally { socket?.close(); browser.kill(); }
