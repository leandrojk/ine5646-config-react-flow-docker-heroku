//@flow

import React from 'react'

type Props = {|
  loginValido: boolean,
  loginAtual: string,
  onMudaLogin: string => void,
  onApagaLogin: void => void
|}


export default function Login (props: Props): React$Element<"div"> {

  const corInput: string = props.loginValido ? 
    'input is-info' :
    props.loginAtual.length === 0 ?
      'input is-danger has-background-danger-light' :
      'input is-warning has-background-warning-light'


  function onChange(ev: SyntheticInputEvent<HTMLInputElement>) {
    props.onMudaLogin(ev.currentTarget.value)
  }

  return (
    <div className='message is-info'>
      <div className='message-header'>
        Digite o seu Login
      </div>
      <div className='message-body'>
        <input 
          className={corInput}
          placeholder='digite seu login'
          type='text' 
          value={props.loginAtual} 
          onChange={onChange}/>
        <button 
          className='button is-success' 
          disabled={!props.loginValido}
          onClick={props.onApagaLogin}>
            Apagar
        </button>
      </div>
    </div>
  )
}