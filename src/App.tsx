import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const [number1, setNumber1] = useState('')
  const [number2, setNumber2] = useState('')
  const [number3, setNumber3] = useState('')
  const [number4, setNumber4] = useState('')
  const [solution, setSolution] = useState<string | null | false>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const parsedNumbers = useMemo(() => {
    return [number1, number2, number3, number4].map((value) => {
      const trimmed = value.trim()
      if (!trimmed) return null
      const parsed = Number(trimmed)
      return Number.isFinite(parsed) ? parsed : null
    })
  }, [number1, number2, number3, number4])

  const isValidNumbers = useMemo(() => {
    return parsedNumbers.every((value) => value !== null && value > 0)
  }, [parsedNumbers])

  useEffect(() => {
    setIsFlipped(false)
  }, [number1, number2, number3, number4])

  const handleClick = useCallback(() => {
    if (!isValidNumbers) return

    const numbers = parsedNumbers as number[]
    const target = 24

    const items: Item[] = numbers.map(n => ({
      value: n,
      expr: String(n)
    }))

    const solution = solve(items, target)
    setSolution(solution ? solution : false)
    setIsFlipped(true)
  }, [isValidNumbers, parsedNumbers])

  const handleBackClick = useCallback(() => {
    setIsFlipped(false)
  }, [setIsFlipped])

  const handleReset = useCallback(() => {
    setNumber1('')
    setNumber2('')
    setNumber3('')
    setNumber4('')
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="card-wrapper">
        <div className="card">
          <div className={`card-flip ${isFlipped ? 'is-flipped' : ''}`}>
            <div className="card-flip-inner">
              <div className="card-face card-front">
                <h1 className="title">24 Solver</h1>
                <img src={cardSvg} alt="Card front" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input top"
                  value={number1}
                  onChange={(e) => setNumber1(e.target.value)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input left"
                  value={number2}
                  onChange={(e) => setNumber2(e.target.value)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input right"
                  value={number3}
                  onChange={(e) => setNumber3(e.target.value)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input bottom"
                  value={number4}
                  onChange={(e) => setNumber4(e.target.value)}
                />
                <Button variant="contained" size="large" color="error" className="card-button solve-button" onClick={() => handleClick()} disabled={!isValidNumbers}>Solve!</Button>
                <Button variant="text" size="large" className="card-button reset-button" onClick={() => handleReset()}>Reset</Button>
              </div>
              <div className="card-face card-back" aria-hidden="true">
                <h1 className="title">24 Solver</h1>
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
