export type Question = { numbers: number[]; blank: number; choices: number[] }
export type Stage = { id: number; multiple: number; color: string; questions: Question[] }

const multiples = [2, 5, 10, 3, 4, 6, 7, 8, 9]
const colors = ['#ff7b73', '#ffae45', '#f3c84c', '#6fcf97', '#55c7c2', '#64a8ed', '#8d8fe8', '#c180dc', '#ed7fab']

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function makeChoices(answer: number, multiple: number, numbers: number[]): number[] {
  const nearby = [
    answer - 1, answer + 1,
    answer - multiple, answer + multiple,
    answer - 2, answer + 2,
    answer - multiple * 2, answer + multiple * 2,
  ]
  const candidates = shuffle(nearby).filter((value, index, all) =>
    value >= 1 && value <= 99 && value !== answer && !numbers.includes(value) && all.indexOf(value) === index,
  )

  for (let value = 1; candidates.length < 4 && value <= 99; value += 1) {
    if (value !== answer && !numbers.includes(value) && !candidates.includes(value)) candidates.push(value)
  }

  return shuffle([answer, ...candidates.slice(0, 4)])
}

function makeQuestions(multiple: number): Question[] {
  const largestStart = Math.floor(99 / multiple) - 4
  const starts = shuffle(Array.from({ length: largestStart }, (_, i) => i + 1)).slice(0, 5)

  return starts.map(start => {
    const numbers = Array.from({ length: 5 }, (_, i) => (start + i) * multiple)
    const blank = Math.floor(Math.random() * numbers.length)
    const answer = numbers[blank]
    return { numbers, blank, choices: makeChoices(answer, multiple, numbers) }
  })
}

// ページを開くたびに、新しい5問を各ステージに生成します。
export const stages: Stage[] = multiples.map((multiple, index) => ({
  id: index + 1,
  multiple,
  color: colors[index],
  questions: makeQuestions(multiple),
}))
