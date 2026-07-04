export type Question = { numbers: number[]; blank: number; choices: number[] }
export type Stage = { id: number; step: number; color: string; questions: Question[] }

const starts = [
  [1, 4, 10, 21, 31], [2, 5, 11, 24, 37], [3, 10, 22, 38, 49],
  [1, 7, 14, 23, 35], [2, 9, 17, 26, 35], [3, 11, 20, 34, 45],
  [1, 9, 18, 29, 43], [2, 11, 21, 34, 47], [1, 12, 23, 36, 50],
]

const steps = [2, 5, 10, 3, 4, 6, 7, 8, 9]
const colors = ['#ff7b73', '#ffae45', '#f3c84c', '#6fcf97', '#55c7c2', '#64a8ed', '#8d8fe8', '#c180dc', '#ed7fab']

function makeQuestion(start: number, step: number, index: number): Question {
  const numbers = Array.from({ length: 5 }, (_, i) => start + step * i)
  const blank = (index * 2 + 1) % 5
  const answer = numbers[blank]
  const candidates = [answer, answer - step, answer + step, answer - 1, answer + 1, answer + step * 2]
    .filter((n, i, arr) => n >= 0 && n <= 99 && n !== answer ? arr.indexOf(n) === i : n === answer)
  const choices = [answer, ...candidates.filter(n => n !== answer)].slice(0, 5)
  while (choices.length < 5) {
    const n = Math.min(99, answer + choices.length + 2)
    if (!choices.includes(n)) choices.push(n)
  }
  const rotation = index % choices.length
  return { numbers, blank, choices: [...choices.slice(rotation), ...choices.slice(0, rotation)] }
}

export const stages: Stage[] = steps.map((step, i) => ({
  id: i + 1,
  step,
  color: colors[i],
  questions: starts[i].map((start, q) => makeQuestion(start, step, q)),
}))
