// @flow

import inquirer from 'inquirer'

export async function confirm<T> (collection: Array<T>, question: T => string): Promise<Array<T>> {
  const questions = collection.map((item: T, index) => ({
    type: 'confirm',
      // Need to use index here, item could contain periods
    name: index + 1,
    message: question(item)
  }))

  const answers = await inquirer.prompt(questions)

  const confirmedItems: Array<T> = Object.keys(answers)
    .filter(index => answers[index])
    .map(index => collection[index - 1])

  return confirmedItems
}
