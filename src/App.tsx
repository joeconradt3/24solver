import { useCallback, useMemo, useState, type ReactEventHandler } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, createTheme, CssBaseline, TextField, ThemeProvider } from '@mui/material'
import cardSvg from './card.svg'

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
  const [solution, setSolution] = useState<string | null | false>()

  const isValidNumbers = useMemo(() => {
    return (number1 ?? 0) > 0 && (number2 ?? 0) > 0 && (number3 ?? 0) > 0 && (number4 ?? 0) > 0
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
    setSolution(solution ?? false)
  }, [number1, number2, number3, number4, isValidNumbers])

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
      <p>
        {solution === false && (
          "Invalid numbers - no solution found 😔"
        )}
        {!!solution && (
          solution + " = 24"
        )}
      </p>
      <div className="card-wrapper">
        <input type="text" className="input top" value={number1} onChange={(e) => setNumber1(e.target.value ? parseInt(e.target.value) : undefined)} />
        <input type="text" className="input left" value={number2} onChange={(e) => setNumber2(e.target.value ? parseInt(e.target.value) : undefined)} />
        <div className="card">
          <img src={cardSvg}/>
        </div>
        <input type="text" className="input right" value={number3} onChange={(e) => setNumber3(e.target.value ? parseInt(e.target.value) : undefined)} />
        <input type="text" className="input bottom" value={number4} onChange={(e) => setNumber4(e.target.value ? parseInt(e.target.value) : undefined)} />
        <Button variant="contained" size="large" color="error" className="solve-button" onClick={() => handleClick()} disabled={!isValidNumbers}>Solve!</Button>
      </div>

    </ThemeProvider>
  )
}

export default App
