import { useEffect, useRef, useState } from 'react';
import { addFact, hasFact, makeQ, pickTable } from './logic.js';

function useStored(key, init) {
  const [v, setV] = useState(() => JSON.parse(localStorage.getItem(key)) ?? init);
  useEffect(() => localStorage.setItem(key, JSON.stringify(v)), [key, v]);
  return [v, setV];
}

const digits = (e) => e.target.value.replace(/\D/g, '');

function Tables() {
  const [running, setRunning] = useState(false);
  const [q, setQ] = useState(null);
  const [input, setInput] = useState('');
  const [missed, setMissed] = useStored('missed', []);
  const [practice, setPractice] = useStored('practice', []);
  const [limit, setLimit] = useStored('limit', 1);
  const inputRef = useRef(null);

  const next = () => { setQ(pickTable(practice, q)); setInput(''); };
  const miss = (a, b) => { if (!hasFact(practice, a, b)) setMissed((m) => addFact(m, a, b)); };
  const toPractice = (f) => { setPractice((p) => addFact(p, f.a, f.b)); setMissed((m) => m.filter((x) => x !== f)); };
  const start = () => { setRunning(true); next(); };
  const stop = () => { setRunning(false); setQ(null); };

  useEffect(() => {
    if (!running) return;
    inputRef.current?.focus();
    const t = setTimeout(() => { miss(q.a, q.b); next(); }, limit * 1000);
    return () => clearTimeout(t);
  }, [running, q]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && running) stop();
      if (e.key === 'Enter' && !running) start();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running]);

  const onChange = (e) => {
    const v = digits(e);
    if (Number(v) === q.a * q.b) next();
    else setInput(v);
  };

  return (
    <div className="stage">
      <main>
        {running ? (
          <>
            <div className="question">{q.a} × {q.b}</div>
            <input ref={inputRef} className="answer" inputMode="numeric" value={input} onChange={onChange} autoComplete="off" aria-label="Answer" />
            <div className="timer"><div key={q.id} className="bar" style={{ animationDuration: `${limit}s` }} /></div>
            <button className="ghost" onClick={stop}>Stop <kbd>Esc</kbd></button>
          </>
        ) : (
          <>
            <button className="primary" onClick={start}>Start <kbd>Enter</kbd></button>
            <label className="limit">
              <span>Time per question</span>
              <input type="range" min="1" max="5" step="0.1" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
              <span className="value">{limit.toFixed(1)}s</span>
            </label>
          </>
        )}
      </main>
      <aside>
        <header>
          <span>Practice <span className="muted">{practice.length}</span></span>
        </header>
        {practice.length === 0 && <p className="hint">Add facts from Missed with +. Each one comes up about 1 question in 12.</p>}
        <ul className="missed">
          {practice.map((f) => (
            <li key={`${f.a}x${f.b}`}>
              <span>{f.a} × {f.b}</span><b>{f.a * f.b}</b>
              <button className="icon" onMouseDown={(e) => e.preventDefault()} onClick={() => setPractice((p) => p.filter((x) => x !== f))} aria-label={`Remove ${f.a} × ${f.b} from practice`} title="Remove">×</button>
            </li>
          ))}
        </ul>
        <header>
          <span>Missed <span className="muted">{missed.length}</span></span>
          {missed.length > 0 && <button className="ghost small" onClick={() => setMissed([])}>Clear</button>}
        </header>
        <ul className="missed">
          {missed.map((m) => (
            <li key={`${m.a}x${m.b}`}>
              <span>{m.a} × {m.b}</span><b>{m.a * m.b}</b>
              <button className="icon" onMouseDown={(e) => e.preventDefault()} onClick={() => toPractice(m)} aria-label={`Add ${m.a} × ${m.b} to practice`} title="Add to practice">+</button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

const EMPTY_STATS = { n: 0, correct: 0, time: 0, streak: 0, best: 0 };

function TwoDigit() {
  const [q, setQ] = useState(() => makeQ(1, 99));
  const [input, setInput] = useState('');
  const [t0, setT0] = useState(() => performance.now());
  const [last, setLast] = useState(null);
  const [s, setStats] = useStored('stats2', EMPTY_STATS);

  const submit = (e) => {
    e.preventDefault();
    if (!input) return;
    const ok = Number(input) === q.a * q.b;
    const dt = (performance.now() - t0) / 1000;
    setStats((s) => {
      const streak = ok ? s.streak + 1 : 0;
      return { n: s.n + 1, correct: s.correct + ok, time: s.time + dt, streak, best: Math.max(s.best, streak) };
    });
    setLast({ ...q, ok, dt });
    setQ(makeQ(1, 99));
    setInput('');
    setT0(performance.now());
  };

  return (
    <div className="stage">
      <main>
        <div className="question">{q.a} × {q.b}</div>
        <form onSubmit={submit}>
          <input autoFocus className="answer" inputMode="numeric" value={input} onChange={(e) => setInput(digits(e))} autoComplete="off" aria-label="Answer" />
        </form>
        <div className={`last ${last?.ok ? 'ok' : 'bad'}`}>
          {last && <>{last.a} × {last.b} = {last.a * last.b} · {last.dt.toFixed(1)}s</>}
        </div>
      </main>
      <aside>
        <header>
          <span>Stats</span>
          {s.n > 0 && <button className="ghost small" onClick={() => setStats(EMPTY_STATS)}>Reset</button>}
        </header>
        <dl className="stats">
          <dt>Answered</dt><dd>{s.n}</dd>
          <dt>Accuracy</dt><dd>{s.n ? Math.round((100 * s.correct) / s.n) : 0}%</dd>
          <dt>Avg time</dt><dd>{s.n ? (s.time / s.n).toFixed(1) : '0.0'}s</dd>
          <dt>Streak</dt><dd>{s.streak}</dd>
          <dt>Best streak</dt><dd>{s.best}</dd>
        </dl>
      </aside>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState('tables');
  return (
    <div className="app">
      <nav>
        <button className={mode === 'tables' ? 'active' : ''} onClick={() => setMode('tables')}>Tables 1–12</button>
        <button className={mode === 'two' ? 'active' : ''} onClick={() => setMode('two')}>1–99</button>
      </nav>
      {mode === 'tables' ? <Tables /> : <TwoDigit />}
    </div>
  );
}
