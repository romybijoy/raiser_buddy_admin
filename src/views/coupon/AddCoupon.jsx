import React, { useState } from 'react'
import { createCoupon } from '../../redux/slices/CouponSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Firebase } from '../../firebase/config'
import FormContainer from '../../components/Form/FormContainer'
import { Alert, Button, Form, Row, Col} from 'react-bootstrap'
import DatePicker from 'react-datepicker'

import { toast } from 'react-toastify'
import ImageCropper from '../../components/ImageUpload/ImageCropper'
import { useRef } from 'react'

const AddCoupon = () => {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    title: '',
    desc: '',
    validFrom: '',
    validUntil: '',
    status: true,
  })
  const [image, setImage] = useState()
  const [validated, setValidated] = useState(false)
  const [valError, setValError] = useState('')
  const [selectedValidFromDate, setSelectedValidFromDate] = useState(null);
  const [selectedValidUntilDate, setSelectedValidUntilDate] = useState(null);

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { coupons, error, loading } = useSelector((state) => state.coupon)

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value })
  }

  const inputRef = useRef()

  const handleSubmit = (e) => {
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      try {
        e.preventDefault()
        console.log(formData)
        formData.validFrom = selectedValidFromDate;
        formData.validUntil= selectedValidUntilDate
        dispatch(createCoupon(formData))
        // Clear the form fields after successful registration
        setFormData({
          code: '',
          discount: '',
          title: '',
          desc: '',
          validFrom: '',
          validUntil: '',
          status: true,
        })

        console.log(error)
        if (error === 400) {
          setValError('Field should not be blank')
        } else if (error === 409) {
          console.log('first')
          toast.error('Duplicate coupon code')
          navigate('/coupon')
        } else {
          toast.success('Coupon added successfully')
          navigate('/coupon')
        }
      } catch (err) {
        toast.error('Something happened')
      }
    }
  }

  return (
    <FormContainer className="p-3">
      <h1>Create Coupon</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="my-2" controlId="code">
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">Please enter a code.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">Please enter a code.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="desc">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Description"
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">Please enter a description.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="discount">
          <Form.Label>Discount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter discount"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">Please enter a discount.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="validFrom">
        <Form.Label>
          Select Valid From Date
        </Form.Label>
        <Col sm={10}>
          <DatePicker
            selected={selectedValidFromDate}
            onChange={(date) => setSelectedValidFromDate(date)}
            className="form-control"
            placeholderText="Select a date"
          />
        </Col>
      </Form.Group>

      <Form.Group className="my-2" controlId="validUntil">
        <Form.Label>
          Select Valid Until Date
        </Form.Label>
        <Col sm={10}>
          <DatePicker
            selected={selectedValidUntilDate}
            onChange={(date) => setSelectedValidUntilDate(date)}
            className="form-control"
            placeholderText="Select a date"
          />
        </Col>
      </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}

export default AddCoupon
