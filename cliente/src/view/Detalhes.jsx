//@flow
import React from 'react'

type Props = {|
  limites: {| min: number, max: number |},
  quando: ?string,
  login: string,
  loginValido: boolean
|}

type Componente = (props: Props) => React$Element<"div">

const Detalhes: Componente = (props: Props) => {
  const corMessage = props.login.length === 0 ? 
    'message is-danger' : props.loginValido ? 
      'message is-link' : 'message is-warning'

  return (
    <div className={corMessage}>
      <div className='message-header'>
      Detalhes
      </div>
      <div className='message-body'>
        {
          props.quando !== undefined && 
        <h3 className='is-size-3'>
          Iniciado em: {props.quando}
        </h3>
        }
        <h3 className='is-size-3'>
          Tamanho Mínimo - Máximo: {props.limites.min} - {props.limites.max}
        </h3>
        {
          props.login.length === 0 &&
        <h3 className='is-size-3'>
          Login informado: sem login definido
        </h3>
        }
        {
          props.login.length > 0 &&
        <h3 className='is-size-3'>
          Login informado: {props.login}
        </h3>
        }
        <h3 className='is-size-3'>
          Tamanho: {props.login.length}
        </h3>
      </div>
    </div>
  )
}

export default Detalhes 