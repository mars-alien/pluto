import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { transform } from 'sucrase';

const DEFAULT_CODE = `// Welcome to the Developer Simulator Editor\n// Start typing here...\nfunction greet(name) {\n  return ` + "`Hello, ${name}!`" + `;\n}\n\nconsole.log(greet('Pluto'));\n`;

const languages = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'json', label: 'JSON' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'css', label: 'CSS' },
  { id: 'html', label: 'HTML' }
//   { id: 'python', label: 'Python' }
];

export default function MonacoEditor({
  initialValue = DEFAULT_CODE,
  initialLanguage = 'javascript',
  theme = 'vs-dark',
  onChange
}) {
  const [code, setCode] = useState(initialValue);
  const [lang, setLang] = useState(initialLanguage);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [output, setOutput] = useState([]);
  const iframeRef = useRef(null);

  const options = useMemo(() => ({
    fontSize: 14,
    fontLigatures: true,
    smoothScrolling: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    minimap: { enabled: true },
    cursorBlinking: 'smooth',
    renderWhitespace: 'selection',
    tabSize: 2,
    wordWrap: 'on'
  }), []);

  const handleChange = useCallback((value) => {
    setCode(value ?? '');
    onChange?.(value ?? '');
  }, [onChange]);

  const clearOutput = useCallback(() => setOutput([]), []);

  useEffect(() => {
    const handler = (e) => {
      if (!e || !e.data || !e.data.type) return;
      setOutput(prev => [...prev, { type: e.data.type, args: e.data.args }]);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const ensureIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return null;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return null;
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset=\"utf-8\"></head><body><script>
      (function(){
        const send = (type, args) => parent.postMessage({ type, args }, '*');
        const wrap = (fn, label) => function(){ try { send(label, Array.from(arguments)); } catch(e){} };
        console.log = wrap(console.log, 'log');
        console.warn = wrap(console.warn, 'warn');
        console.error = wrap(console.error, 'error');
        window.onerror = function(message, source, lineno, colno){
          send('error', [String(message)+' ('+lineno+':'+colno+')']);
        };
      })();
    <\/script></body></html>`);
    doc.close();
    return iframe;
  }, []);

  const runCode = useCallback(() => {
    clearOutput();
    const iframe = ensureIframe();
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    const script = doc.createElement('script');
    script.type = 'module';

    let js = code;
    try {
      if (lang === 'typescript') {
        const out = transform(code, { transforms: ['typescript'] });
        js = out.code;
      } else if (lang === 'json') {
        const obj = JSON.parse(code);
        setOutput(prev => [...prev, { type: 'log', args: [obj] }]);
        return;
      } else if (lang === 'markdown') {
        doc.open();
        doc.write(`<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; white-space: pre-wrap;">${code.replace(/</g,'&lt;')}</pre>`);
        doc.close();
        return;
      } else if (lang === 'html') {
        doc.open();
        doc.write(code);
        doc.close();
        return;
      } else if (lang === 'css') {
        doc.open();
        doc.write(`<!doctype html><html><head><style>${code}</style></head><body><div style="padding:16px;font-family:sans-serif">Your CSS applied to this demo box.</div></body></html>`);
        doc.close();
        return;
      }
    } catch (e) {
      setOutput(prev => [...prev, { type: 'error', args: [String(e.message || e)] }]);
      return;
    }

    script.textContent = `\n(async () => {\ntry {\n${js}\n} catch (e) { console.error(e && e.stack ? e.stack : String(e)); }\n})();`;
    doc.body.appendChild(script);
  }, [code, lang, ensureIframe, clearOutput]);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-sm border rounded px-2 py-1 bg-white"
          >
            {languages.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            className="text-sm border rounded px-2 py-1 bg-white"
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <button
            onClick={runCode}
            className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            title="Run (JavaScript only)"
          >Run</button>
          <button
            onClick={clearOutput}
            className="text-sm px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >Clear</button>
        </div>
       
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={lang}
          language={lang}
          value={code}
          theme={currentTheme}
          onChange={handleChange}
          options={options}
        />
      </div>
      <div className="border-t bg-white">
        <div className="px-3 py-2 text-xs text-gray-600">Output</div>
        <div className="px-3 pb-2 h-32 overflow-auto font-mono text-xs">{
          output.length === 0 ? (
            <div className="text-gray-400">Run your JavaScript code to see console output here.</div>
          ) : output.map((line, idx) => (
            <div key={idx} className={line.type === 'error' ? 'text-red-600' : line.type === 'warn' ? 'text-yellow-700' : 'text-gray-800'}>
              {line.args && line.args.map((a, i) => <span key={i}>{(typeof a === 'string') ? a : JSON.stringify(a)}{i < line.args.length - 1 ? ' ' : ''}</span>)}
            </div>
          ))
        }</div>
        <iframe ref={iframeRef} title="sandbox" style={{ display: 'none' }} />
      </div>
    </div>
  );
}


