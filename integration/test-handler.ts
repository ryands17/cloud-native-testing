import { runCLI } from 'jest'

export const handler = async () => {
  const { results } = await runCLI({ _: [], $0: '' }, [__dirname])

  const result = results.testResults[0].testResults.map(
    (res) => `${res.title} - ${res.status.toUpperCase()}`
  )

  return result
}
