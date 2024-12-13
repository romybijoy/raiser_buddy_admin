import React, { useState, useEffect } from 'react'
import { createProvider } from '../../redux/slices/ProviderSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../../components/Form/FormContainer'
import { Button, Form, Image as image } from 'react-bootstrap'

import { toast } from 'react-toastify'

const AddProvider = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'INDIVIDUAL',
    mobile_number: '',
  })
  const [validated, setValidated] = useState(false)
  const [valError, setValError] = useState('')
  const [searchData, setSearchData] = useState({
    keyword: '',
  })

  const { result } = useSelector((state) => state.provider)
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      e.preventDefault()

      try {
        dispatch(createProvider(formData))
        // Clear the form fields after successful registration
        setFormData({
          name: '',
          email: '',
          type: '',
          mobile_number: '',
        })

        if (result?.code === Number(409)) {
          setValError('Provider already exists !!!')
          toast.error('Provider already exists !!!')
        } else if (result?.statusCode === Number(200)) {
          toast.success('Provider added successfully')
          navigate('/providers')
        } else {
          toast.error('Something went wrong!!!')
        }
      } catch (err) {
        toast.error(err)
      }
    }
  }

  return (
    <FormContainer className="p-3">
      <h1>Create Provider</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">Please enter name.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleInputChange}
            required
            isInvalid={validated && !/^\S+@\S+\.\S+$/.test(formData.email)}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="role">
          <Form.Label>Type</Form.Label>
          <Form.Select
            aria-label="Type"
            name="type"
            // value={formData.role}
            onChange={handleInputChange}
          >
            <option>Select..</option>
            <option value="INDIVIDUAL">Farmer</option>
            <option value="COMPANY">Company</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">Select a type.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="city">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            name="mobile_number"
            placeholder="Enter Mobile number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter a mobile number.
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}

export default AddProvider
