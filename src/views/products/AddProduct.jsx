import React, { useState, useEffect } from 'react'
import { createProduct } from '../../redux/slices/ProductSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Firebase } from '../../firebase/config'
import FormContainer from '../../components/Form/FormContainer'
import { Alert, Button, Form, Image as image } from 'react-bootstrap'
import { showCategory } from '../../redux/slices/CategorySlice'
import { showProvider } from '../../redux/slices/ProviderSlice'

import { toast } from 'react-toastify'
import ImageCropper from '../../components/ImageUpload/ImageCropper'
import { useRef } from 'react'

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    shortDesc: '',
    desc: '',
    images: [],
    price: 0,
    discount: 0,
    quantity: 0,
    categoryId: '',
    provider: '',
  })
  // const [image, setImage] = useState('')
  const [images, setImages] = useState([])
  const [currentPage, setCurrentPage] = useState('choose-img')
  const [uploading, setUploading] = useState(false)
  const [validated, setValidated] = useState(false)
  const [valError, setValError] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [searchData, setSearchData] = useState({
    keyword: '',
  })

  const [imgAfterCrop, setImgAfterCrop] = useState([])
  const [imgName, setImgName] = useState('')

  const [imgUrls, setImgUrls] = useState([])
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const inputRef = useRef()

  const { categories } = useSelector((state) => state.category)
  const { error, result } = useSelector((state) => state.product)

  const { providers } = useSelector((state) => state.provider)

  useEffect(() => {
    dispatch(showCategory({ page: 0, pageSize: 30 }))
    dispatch(showProvider({ page: 0, pageSize: 30 }))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (e) => {
    setFormData({ ...formData, categoryId: e.target.value })
  }

  const handleSelectProviderChange = (e) => {
    setFormData({ ...formData, provider: e.target.value })
  }

  const handleOnChange = (event) => {
    if (imgUrls.length >= 3) {
      alert('You can only upload up to 3 images')
      return
    }

    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[i])
        reader.onload = function (e) {
          setImages(reader.result)
          setImgName(event.target.files[i].name)
          setCurrentPage('crop-img')
        }
      }
    }
  }

  // Callback function when cropping is done
  const onCropDone = (imgCroppedArea) => {
    console.log(imgCroppedArea)
    const canvasEle = document.createElement('canvas')
    canvasEle.width = imgCroppedArea.width
    canvasEle.height = imgCroppedArea.height

    const context = canvasEle.getContext('2d')

    let imageObj1 = new Image()
    imageObj1.src = images
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height,
      )

      const dataURL = canvasEle.toDataURL('image/jpeg')

      setImgAfterCrop([...imgAfterCrop, dataURL])
      setCurrentPage('img-cropped')
      Firebase.storage()
        .ref(`/product/${imgName}`)
        .putString(dataURL.split(',')[1], 'base64', { contentType: 'image/jpeg' })
        .then(({ ref }) => {
          ref.getDownloadURL().then((url) => {
            if (url) {
              setUploading(false)
              console.log(url)
              setImgUrls((prevImages) => [...prevImages, url])
              // setImages([...images,url]);
              console.log(imgUrls)
              setValidated(true)
            }
          })
        })
    }
  }

  // Callback function when cropping is canceled
  const onCropCancel = () => {
    setCurrentPage('choose-img')
    setImage('')
  }

 
  const handleSubmit = async (e) => {
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      e.preventDefault()

      formData.images = imgUrls
      try {
        console.log(categoryId)
        dispatch(createProduct(formData))
        // Clear the form fields after successful registration
        setFormData({
          name: '',
          shortDesc: '',
          desc: '',
          images: [],
          price: 0,
          quantity: 0,
          discount: 0,
          categoryId: 0,
          provider: '',
        })
        console.log(error)
        if (error === Number(409)) {
          setValError('Product already exists !!!')
          toast.error('Product already exists !!!')
        } else if (result?.statusCode === Number(201)) {
          toast.success('Product added successfully')
          navigate('/products')
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
      <h1>Create Product</h1>
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

        <Form.Group className="my-2" controlId="desc">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="desc"
            placeholder="Enter description"
            value={formData.desc}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">Please enter a description.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="shortDesc">
          <Form.Label>Short Description</Form.Label>
          <Form.Control
            type="text"
            name="shortDesc"
            placeholder="Enter short description"
            value={formData.shortDesc}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter short description.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="my-2" controlId="category">
          <Form.Label>Category</Form.Label>

          <Form.Control
            as="select"
            aria-label="category"
            name="category"
            // value={category}
            onChange={handleSelectChange}
            required
          >
            <option value="">Select..</option>
            {categories?.map((category, i) => (
              <option key={i} value={Number(category.categoryId)}>
                {category.name}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">Select a category.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="provider">
          <Form.Label>Provider</Form.Label>

          <Form.Control
            as="select"
            aria-label="provider"
            name="provider"
            onChange={handleSelectProviderChange}
            required
          >
            <option value="">Select..</option>
            {providers?.map((provider, i) => (
              <option key={i} value={provider.id}>
                {provider.email}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">Select a provider.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price || ''}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">Please enter price.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="discount">
          <Form.Label>Discount</Form.Label>
          <Form.Control
            type="number"
            name="discount"
            placeholder="Enter discount"
            value={formData.discount || ''}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">Please enter discount.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="quantity">
          <Form.Label>Quantity/ Kg</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            value={formData.quantity || ''}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">Please enter quantity.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="my-2" controlId="image">
          <Form.Label>Images</Form.Label>

          <Form.Control
            type="file"
            // accept="image/*"
            multiple
            ref={inputRef}
            required
            isInvalid={validated && currentPage === 'crop-img'}
            onChange={handleOnChange}
          ></Form.Control>
          {currentPage === 'crop-img' ? (
            <ImageCropper
              image={images}
              visible={true}
              onCropDone={onCropDone}
              onCropCancel={onCropCancel}
            />
          ) : (
            <></>
          )}

          <br />
          <div style={{ display: 'flex', gap: '10px' }}>
            {imgUrls.length > 0 &&
              imgUrls.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={i}
                  style={{ width: '100px', height: 'auto', border: '1px solid black' }}
                />
              ))}
          </div>
          <Form.Control.Feedback type="invalid">Please choose an image</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}

export default AddProduct
