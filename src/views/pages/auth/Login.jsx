import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { FormContainer } from '../../../components/index'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation } from '../../../redux/slices/UsersApiSlice'
import { setCredentials } from '../../../redux/slices/AuthSlice'
import { toast } from 'react-toastify'
import { Loader } from '../../../components/index'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()

  // const { userInfo } = useSelector((state) => state.auth)
  // const { googleSignIn, dbUserSignIn, user, facebookSignIn } = UserAuth();
  const role = localStorage.getItem('role')
  // useEffect(() => {

  // }, [navigate, user])

  const submitHandler = async (e) => {
    e.preventDefault()

    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    }
    {
      try {
        const res = await login({ email, password }).unwrap()
        dispatch(setCredentials({ ...res }))

        if (role === 'USER') {
          setError('Invalid admin credentials.')
          return
        }
        if (role === 'ADMIN') {
          navigate('/dashboard')
          toast.success('Login successfully')
        }
      } catch (err) {
        setError(err?.data?.message || err.error)
      }
    }
  }

  // const handleGoogleSignIn = async () => {
  //   try {
  //     await googleSignIn()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const handleFacebookSignIn = async () => {
  //   try {
  //     await facebookSignIn()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <FormContainer>
      <h1>Sign In</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate validated={validated} onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            isInvalid={validated && !/^\S+@\S+\.\S+$/.test(email)}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            isInvalid={validated && password.length < 4}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Password must be at least 4 characters long.
          </Form.Control.Feedback>
        </Form.Group>

        <Button disabled={isLoading} type="submit" variant="primary" className="mt-3">
          Sign In
        </Button>
      </Form>

      {isLoading && <Loader />}

      {/* <Row className="py-3">
        <Col>
          New Customer? <Link to="/signup">Register</Link>
        </Col>
      </Row> */}

      {/* <Row className="py-3 px-5">
        <GoogleLoginButton onClick={handleGoogleSignIn} />
      </Row>

      <Row className="py-3 px-5">
        <FacebookLoginButton onClick={handleFacebookSignIn} />
      </Row> */}
    </FormContainer>
  )
}

export default LoginScreen
