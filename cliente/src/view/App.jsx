// @flow
import type {Limites} from '../model/servicos.js'

import React, {useReducer, useEffect} from 'react'
import 'bulma/css/bulma.min.css'
import Login from './Login.jsx'
import Detalhes from './Detalhes.jsx'
import obtemLimites from '../model/servicos.js'

type Estado = E1 | E2 | E3

type E1 = {| sit: 'CARREGANDO' |} 

type E2 = {| 
  sit: 'PRONTO', 
  login: string, 
  limites: Limites,
  quando: string
|}

type E3 = {|
  sit: 'ERRO',
  msg: string
|}

type Acao =
    {| type: 'REGISTRE_LOGIN', login: string |}
  | {| type: 'APAGUE_LOGIN' |}
  | {| type: 'REGISTRE_INICIO', quando: string, limites: Limites |}
  | {| type: 'REGISTRE_ERRO', msg: string |}

type AlteraEstado = {| 
  apagaLogin: void => void, 
  registraLogin: string => void,
  loginValido: void => boolean 
|}

type Modelo = [Estado, AlteraEstado]



const estadoInicial: E1 = {
  sit: 'CARREGANDO'
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_LOGIN':
    return estado.sit === 'PRONTO'
      ? {...estado, login: acao.login.trim()}
      : {sit: 'ERRO', msg: 'Erro de programação: 01'}

  case 'APAGUE_LOGIN':
    return estado.sit === 'PRONTO'
      ? {...estado, sit: 'PRONTO', login: ''}
      : {sit: 'ERRO', msg: 'Erro de programação: 02'}

  case 'REGISTRE_INICIO':
    return estado.sit === 'CARREGANDO'
      ? { sit: 'PRONTO', login: '', limites: acao.limites, quando: acao.quando}
      : {sit: 'ERRO', msg: 'Erro de programação: 03'}

  case 'REGISTRE_ERRO':
    return {sit: 'ERRO', msg: acao.msg}

  default:
    throw new Error(`acao.type inválido: ${acao.type}`)
  }
}

function useModelo(): Modelo {

  const [estado, dispatch] = useReducer<Estado,Acao>(reducer, estadoInicial)

  useEffect(() => {
    obtemLimites()
      .then((limites: Limites) => {
        const quando = new Date().toLocaleTimeString()
        dispatch({type: 'REGISTRE_INICIO', quando, limites})
      })
      .catch( (e: Error) => dispatch({type: 'REGISTRE_ERRO', msg: e.message}))
  }, [])

  function apagaLogin() {
    dispatch({type: 'APAGUE_LOGIN'})
  }

  function registraLogin(login: string) {
    dispatch({type: 'REGISTRE_LOGIN', login})
  }

  function loginValido() {
    return estado.sit === 'PRONTO' &&
      estado.login.length >= estado.limites.min && 
      estado.login.length <= estado.limites.max
  }

  return [estado, {apagaLogin, registraLogin, loginValido}]
}



function App(): React$Element<"div"> {
  const [estado, {apagaLogin, registraLogin, loginValido}] = useModelo()
  

  return (
    <div className='container is-fluid'>
      <div className='message is-black'>
        <div className='message-header'>
            UFSC - CTC - INE - INE5646 :: Config React - Bulma - Flow :::: Versão Docker & Heroku
        </div>
        <div className='message-body has-background-grey-light'>
          {
            estado.sit === 'CARREGANDO' &&
            <div className='notification has-background-warning-light'>
              <span className='is-size-2'>Carregando. Aguarde...</span>
            </div>
          }
          {
            estado.sit === 'ERRO' &&
            <div className= 'notification has-background-danger-dark'>
              <span className='is-size-2 has-text-white'>{estado.msg}</span>
            </div>
          }
          {
            estado.sit === 'PRONTO' &&
            <div>
              <Login 
                loginAtual={estado.login}
                loginValido={loginValido()}
                onApagaLogin={apagaLogin}
                onMudaLogin={registraLogin}
              />
              <Detalhes
                limites={estado.limites}
                login={estado.login}
                loginValido={loginValido()}
                quando={estado.quando}
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default App
