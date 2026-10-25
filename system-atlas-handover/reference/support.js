// Minimal template runtime so the mockup HTML runs in any browser.
// NOT production code. It interprets {{holes}}, <sc-for>, <sc-if>, <helmet> and on* handlers
// the way the design canvas does, so the reference behaves like the approved mockup.
(function () {
  // Fonts come from the Google Fonts <link> inside each page.
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(p) { this.state = Object.assign({}, this.state, typeof p === 'function' ? p(this.state) : p); window.__dcRender(); }
    forceUpdate() { window.__dcRender(); }
  }
  window.DCLogic = DCLogic;
  window.__dcErrors = [];

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true; if (path === 'false') return false;
    if (/^-?\d/.test(path)) return Number(path);
    if (/^['"]/.test(path)) return path.slice(1, -1);
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
  }
  function interp(str, scope) {
    const whole = str.match(/^\s*\{\{([^}]+)\}\}\s*$/);
    if (whole) return { whole: true, v: lookup(whole[1], scope) };
    return { whole: false, v: str.replace(/\{\{([^}]+)\}\}/g, (_, p) => { const v = lookup(p, scope); if (v === undefined) window.__dcErrors.push('undefined hole: ' + p); return v == null ? '' : String(v); }) };
  }
  function build(node, scope, parent) {
    if (node.nodeType === 3) { const r = interp(node.textContent, scope); if (r.whole && r.v === undefined) window.__dcErrors.push('undefined text hole: ' + node.textContent.trim()); parent.appendChild(document.createTextNode(r.v == null ? '' : String(r.v))); return; }
    if (node.nodeType !== 1) return;
    const tag = node.localName;
    if (tag === 'sc-for') {
      const list = interp(node.getAttribute('list'), scope).v; const as = node.getAttribute('as') || 'item';
      if (!Array.isArray(list)) window.__dcErrors.push('sc-for list not array: ' + node.getAttribute('list'));
      (list || []).forEach((it, i) => { const s = Object.create(scope); s[as] = it; s.$index = i; node.childNodes.forEach(c => build(c, s, parent)); });
      return;
    }
    if (tag === 'sc-if') { const v = interp(node.getAttribute('value'), scope).v; if (v) node.childNodes.forEach(c => build(c, scope, parent)); return; }
    const el = document.createElementNS(node.namespaceURI, node.localName);
    for (const a of Array.from(node.attributes)) {
      if (a.name.startsWith('hint-')) continue;
      const r = interp(a.value, scope);
      if (a.name.startsWith('on') && r.whole) { if (typeof r.v === 'function') { const ev = a.name.slice(2).toLowerCase(); el.addEventListener(ev === 'change' ? 'input' : ev, r.v); } else window.__dcErrors.push('handler not fn: ' + a.value); continue; }
      if (r.whole && r.v === undefined) window.__dcErrors.push('undefined attr hole: ' + a.name + '=' + a.value);
      if (r.v === false || r.v == null) continue;
      try { el.setAttribute(a.name, String(r.v)); } catch (e) { window.__dcErrors.push('attr ' + a.name + ': ' + e.message); }
      if (a.name === 'value' && 'value' in el) el.value = String(r.v);
    }
    node.childNodes.forEach(c => build(c, scope, el));
    parent.appendChild(el);
  }
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const root = document.querySelector('x-dc');
      const scriptEl = document.querySelector('script[data-dc-script]');
      let props = {};
      try { const dp = JSON.parse(scriptEl.getAttribute('data-props') || '{}'); Object.keys(dp).forEach(k => { if (k[0] !== '$' && window.__propOverrides && k in window.__propOverrides) props[k] = window.__propOverrides[k]; }); } catch (e) { window.__dcErrors.push('data-props JSON: ' + e.message); }
      const Component = new Function('DCLogic', scriptEl.textContent + '\nreturn Component;')(DCLogic);
      const comp = new Component(props);
      if (!comp.state) comp.state = {};
      window.__comp = comp;
      const nodes = Array.from(root.childNodes);
      nodes.forEach(n => { if (n.nodeType === 1 && n.localName === 'helmet') Array.from(n.childNodes).forEach(c => document.head.appendChild(c)); });
      const tpl = nodes.filter(n => !(n.nodeType === 1 && n.localName === 'helmet'));
      nodes.forEach(n => root.removeChild(n));
      window.__dcRender = () => { const vals = comp.renderVals(); while (root.firstChild) root.removeChild(root.firstChild); tpl.forEach(n => build(n, vals, root)); };
      window.__dcRender();
      if (comp.componentDidMount) comp.componentDidMount();
      window.__dcReady = true;
    } catch (e) { window.__dcErrors.push('FATAL ' + e.stack); window.__dcReady = true; }
  });
})();
