/* eslint-disable no-console */
// @flow

// verifica se todas as variáveis de ambiente estão definidas

// será usada essa porta se outra não for definida
const PORTA_DEFAULT = 3000

let todasDefinidas = true

if (process.env.SEGUNDOS_AGUARDANDO === undefined) {
  console.log('Falta definir variável SEGUNDOS_AGUARDANDO')
  console.log('Exemplo para 2 segundos: SEGUNDOS_AGUARDANDO=2')
  todasDefinidas = false
}

if (!todasDefinidas) {
  process.exit(1)
}

const TEMPO: number = parseInt(process.env.SEGUNDOS_AGUARDANDO, 10)


// O Heroku define o valor da variável PORT.
const PORTA: number = parseInt(process.env.PORT || PORTA_DEFAULT, 10)

// A execução será local ou no Heroku
const LOCAL: boolean = process.env.LOCAL === 'sim' ? true : false

export {PORTA, TEMPO, LOCAL}
