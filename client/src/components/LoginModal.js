import React, { useState, useContext } from 'react'

import { UserContext } from '../context/UserContext'
import { server, setTokenHeaders } from '../config/axios'

import Loading from './Loading'

const LoginModal = ({ visibleLoginModal, setVisibleLoginModal, setVisibleRegisterModal }) => {
  const [state, dispatch] = useContext(UserContext)
  const [input, setInput] = useState({ email: '', password: '' })
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onHideLogin = () => setVisibleLoginModal(!visibleLoginModal)
  const onChangeInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }
  const onSubmitLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await server.post('/login', input)
      const token = res.data.user.token
      localStorage.setItem('token', token)
      setTokenHeaders(token)
      dispatch({
				type: 'login_success',
				payload: res?.data.user
			})
      setInput({ email: '', password: '' })
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        setError(error?.response.data.message)
      } else {
        console.log(error.message)
      }
    } finally {
      setTimeout(() => setError(''), 5000)
      setLoading(false)
    }
  }
  const onClickRegister = () => {
    setVisibleLoginModal(!visibleLoginModal)
    setVisibleRegisterModal(true)
  }
  return visibleLoginModal && (
    <div className="lp-modal">
      <div className="overlay" onClick={ onHideLogin } />
      <section className="lp-modal-content-login">
        <h1 className="lp-modal-title">Login</h1>
        { error && <p className="error-message">{ error }</p> }
        <form onSubmit={ onSubmitLogin }>
          <div className="form-group-modal">
            <input type="email" placeholder="Email" name="email" value={ input.email } onChange={ onChangeInput } required="on" />
          </div>
          <div className="form-group-modal">
            <input type="password" placeholder="Password" name="password" value={ input.password } onChange={ onChangeInput } required="on" />
          </div>
          <div className="form-group-modal">
            <button type="submit">{ isLoading? <span style={{ position: 'relative', left: '45%' }}><Loading  type="spin" color="#eaeaea" width={ 25 } height={ 25 } /></span> : 'Login' }</button>
          </div>
        </form>
        <p className="lp-click-here">Don't have an account ? Click <span onClick={ onClickRegister }>Here</span></p>
      </section>
    </div>
  )
}

export default LoginModal
