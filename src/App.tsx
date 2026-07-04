import { useEffect, useState } from 'react'
import { stages } from './data'

type Screen = 'home' | 'stages' | 'game' | 'clear'
const STORAGE_KEY = 'number-block-game-cleared'

function Confetti({ big = false }: { big?: boolean }) {
  return <div className={`confetti ${big ? 'confetti--big' : ''}`} aria-hidden="true">
    {Array.from({ length: big ? 42 : 16 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}
  </div>
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [stageIndex, setStageIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [wrong, setWrong] = useState<number | null>(null)
  const [message, setMessage] = useState('どれが はいるかな？')
  const [cleared, setCleared] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(cleared)) }, [cleared])

  const stage = stages[stageIndex]
  const question = stage.questions[questionIndex]

  function startStage(index: number) {
    setStageIndex(index); setQuestionIndex(0); setSolved(false); setWrong(null)
    setMessage('どれが はいるかな？'); setScreen('game')
  }

  function answer(value: number) {
    if (solved) return
    const correct = question.numbers[question.blank]
    if (value === correct) {
      setSolved(true); setWrong(null); setMessage(`${stage.multiple}の ばいすう！`)
    } else {
      setWrong(value); setMessage('もういちど')
      window.setTimeout(() => setWrong(null), 450)
    }
  }

  function next() {
    if (questionIndex < 4) {
      setQuestionIndex(q => q + 1); setSolved(false); setWrong(null); setMessage('どれが はいるかな？')
    } else {
      setCleared(prev => prev.includes(stage.id) ? prev : [...prev, stage.id])
      setScreen('clear')
    }
  }

  return <main className="app-shell">
    <div className="cloud cloud-one" /><div className="cloud cloud-two" />
    {screen === 'home' && <section className="screen home-screen">
      <div className="logo-cubes" aria-hidden="true"><span>1</span><span>2</span><span>3</span></div>
      <p className="eyebrow">みつけよう！ すうじの きまり</p>
      <h1>すうじブロック<br /><em>ならべ</em></h1>
      <p className="intro">「？」に はいる すうじを えらんでね</p>
      <button className="primary huge" onClick={() => setScreen('stages')}>あそぶ <b>›</b></button>
      <div className="home-stars" aria-hidden="true">✦　●　✦</div>
    </section>}

    {screen === 'stages' && <section className="screen stage-screen">
      <header><button className="icon-button" onClick={() => setScreen('home')} aria-label="ホームへ">⌂</button><div><p className="eyebrow">どこから あそぶ？</p><h2>ステージを えらぼう</h2></div></header>
      <div className="stage-grid">
        {stages.map((s, i) => <button key={s.id} className={`stage-card ${cleared.includes(s.id) ? 'is-cleared' : ''}`} style={{ '--stage-color': s.color } as React.CSSProperties} onClick={() => startStage(i)}>
          {cleared.includes(s.id) && <span className="check">✓</span>}
          <small>ステージ</small><strong>{s.id}</strong><span>{s.multiple}の ばいすう</span>
        </button>)}
      </div>
      <button className="secondary bottom-button" onClick={() => setScreen('home')}>⌂　ホームへ</button>
    </section>}

    {screen === 'game' && <section className="screen game-screen" style={{ '--stage-color': stage.color } as React.CSSProperties}>
      <header className="game-header"><button className="icon-button" onClick={() => setScreen('stages')} aria-label="ステージをえらぶ">‹</button><div><p>ステージ {stage.id}</p><div className="progress">{stage.questions.map((_, i) => <span key={i} className={i <= questionIndex ? 'on' : ''} />)}</div></div><span className="count">{questionIndex + 1}<small>/5</small></span></header>
      <div className="prompt"><span className="mascot">★</span><p className={message === 'もういちど' ? 'try-again' : solved ? 'success-text' : ''}>{message}</p></div>
      <div className={`number-row ${solved ? 'is-solved' : ''}`}>
        {question.numbers.map((n, i) => <div key={i} className={`number-tile ${i === question.blank ? 'blank' : ''} ${i === question.blank && solved ? 'filled' : ''}`}>
          {i === question.blank ? solved ? n : '?' : n}
        </div>)}
      </div>
      {solved && <Confetti />}
      <p className="choose-label">したから えらんでね</p>
      <div className="choices">
        {question.choices.map(n => <button key={n} disabled={solved} className={wrong === n ? 'wrong' : solved && n === question.numbers[question.blank] ? 'correct' : ''} onClick={() => answer(n)}>{n}</button>)}
      </div>
      <div className="game-actions">
        <button className="secondary" onClick={() => setScreen('stages')}>ステージを えらぶ</button>
        {solved && <button className="primary" onClick={next}>{questionIndex === 4 ? 'できた！' : 'つぎへ'}　›</button>}
      </div>
    </section>}

    {screen === 'clear' && <section className="screen clear-screen" style={{ '--stage-color': stage.color } as React.CSSProperties}>
      <Confetti big />
      <div className="trophy" aria-hidden="true">★</div>
      <p className="eyebrow">やったね！</p><h2>ステージ {stage.id}<br /><em>クリア！</em></h2>
      <div className="clear-rule"><span>{stage.multiple}</span><p>の ばいすうを<br />みつけたよ</p></div>
      <div className="clear-actions">
        <button className="secondary" onClick={() => setScreen('home')}>⌂　ホームへ</button>
        <button className="secondary" onClick={() => startStage(stageIndex)}>↻　もういちど</button>
        <button className="primary" onClick={() => stageIndex < 8 ? startStage(stageIndex + 1) : setScreen('stages')}>{stageIndex < 8 ? 'つぎへ' : 'ステージを えらぶ'}　›</button>
      </div>
    </section>}
  </main>
}

export default App
