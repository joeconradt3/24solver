import { useCallback, useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import cardSvg from './card.svg'
import cardBackSvg from './card-back.svg'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: '"Momo Signature", cursive',
  },
});

type Op = "+" | "-" | "*" | "/"

interface Item {
  value: number
  expr: string
}

const ops: Op[] = ["+", "-", "*", "/"]

function apply(a: number, op: Op, b: number): number | null {
  if (op === "+") return a + b
  if (op === "-") return a - b
  if (op === "*") return a * b
  if (op === "/") return b === 0 ? null : a / b

  return null
}

function solve(items: Item[], target: number): string | null {
  if (items.length === 1) {
    if (Math.abs(items[0].value - target) < 1e-9) {
      return items[0].expr
    }
    return null
  }

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (i === j) continue

      const rest = items.filter((_, k) => k !== i && k !== j)

      for (const op of ops) {
        const val = apply(items[i].value, op, items[j].value)
        if (val === null) continue

        const expr = `(${items[i].expr}${op}${items[j].expr})`

        const result = solve(
          [{ value: val, expr }, ...rest],
          target
        )

        if (result) return result
      }
    }
  }

  return null
}

function App() {
  const [number1, setNumber1] = useState<number>()
  const [number2, setNumber2] = useState<number>()
  const [number3, setNumber3] = useState<number>()
  const [number4, setNumber4] = useState<number>()
  const [solution, setSolution] = useState<string | null | false>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const isValidNumbers = useMemo(() => {
    return (number1 ?? 0) > 0 && (number2 ?? 0) > 0 && (number3 ?? 0) > 0 && (number4 ?? 0) > 0
  }, [number1, number2, number3, number4])

  useEffect(() => {
    setIsFlipped(false)
  }, [number1, number2, number3, number4])

  const handleClick = useCallback(() => {
    if (!isValidNumbers) return

    const numbers = [number1!, number2!, number3!, number4!]
    const target = 24

    const items: Item[] = numbers.map(n => ({
      value: n,
      expr: String(n)
    }))

    const solution = solve(items, target)
    setSolution(solution ? solution : false)
    setIsFlipped(true)
  }, [number1, number2, number3, number4, isValidNumbers])

  const handleBackClick = useCallback(() => {
    setIsFlipped(false)
  }, [setIsFlipped])

  const handleReset = useCallback(() => {
    setNumber1(undefined)
    setNumber2(undefined)
    setNumber3(undefined)
    setNumber4(undefined)
  }, [setNumber1, setNumber2, setNumber3, setNumber4])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>24 Solver</h1>
      <div className="card-wrapper">
        <div className="card">
          <div className={`card-flip ${isFlipped ? 'is-flipped' : ''}`}>
            <div className="card-flip-inner">
              <div className="card-face card-front">
                <img src={cardSvg} alt="Card front" />
                <input type="text" className="input top" value={number1} onChange={(e) => setNumber1(e.target.value ? parseInt(e.target.value) : undefined)} />
                <input type="text" className="input left" value={number2} onChange={(e) => setNumber2(e.target.value ? parseInt(e.target.value) : undefined)} />
                <input type="text" className="input right" value={number3} onChange={(e) => setNumber3(e.target.value ? parseInt(e.target.value) : undefined)} />
                <input type="text" className="input bottom" value={number4} onChange={(e) => setNumber4(e.target.value ? parseInt(e.target.value) : undefined)} />
                <Button variant="contained" size="large" color="error" className="card-button solve-button" onClick={() => handleClick()} disabled={!isValidNumbers}>Solve!</Button>
                <Button variant="text" size="large" className="card-button reset-button" onClick={() => handleReset()}>Reset</Button>
              </div>
              <div className="card-face card-back" aria-hidden="true">
                <img src={cardBackSvg} alt="Card back" />
                <div className="solution">
                  {solution === false && (
                    <>
                      <p>Invalid numbers</p>
                      <p>No solution found 😔</p>
                    </>
                  )}
                  {!!solution && (
                    solution.slice(1, -1) + " = 24"
                  )}
                </div>
                <input type="text" className="input input-static top" value={number1} disabled={true} />
                <input type="text" className="input input-static left" value={number2} disabled={true} />
                <input type="text" className="input input-static right" value={number3} disabled={true} />
                <input type="text" className="input input-static bottom" value={number4} disabled={true} />
                <Button variant="contained" size="large" color="warning" className="card-button back-button" onClick={() => handleBackClick()} disabled={!isValidNumbers}>Back</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </ThemeProvider>
  )
}

export default App
