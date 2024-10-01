import React, { useState, useEffect, useRef } from 'react'
import { updateProduct } from '../../redux/slices/ProductSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Firebase } from '../../firebase/config'
import FormContainer from '../../components/Form/FormContainer'
import { Button, Form, Image } from 'react-bootstrap'
import Loader from '../../components/Loader/Loader'
import { showCategory, fetchCategoryById } from '../../redux/slices/CategorySlice'
import { showProduct } from '../../redux/slices/ProductSlice'

import { toast } from 'react-toastify'
import ImageCropper from '../../components/ImageUpload/ImageCropper'

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
  })
  // const [image, setImage] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const { productId } = useParams()
  const [ currentPage, setCurrentPage] = useState('choose-img');

  const [categoryId, setCategoryId] = useState('')
  const [searchData, setSearchData] = useState({
    keyword: '',
  })

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const [imgAfterCrop, setImgAfterCrop] = useState([])
  const [imgName, setImgName] = useState('')

  const [imgUrls, setImgUrls] = useState([])
  const inputRef = useRef()
  const { categories } = useSelector((state) => state.category)
  const { error, message, products } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(showCategory({ page: 0, pageSize: 30 }))

    if (productId) {
      const singleProduct = products.filter((product) => product.productId === Number(productId))
      setFormData({
        productId: productId,
        name: singleProduct[0].name,
        shortDesc: singleProduct[0].shortDesc,
        desc: singleProduct[0].desc,
        images: singleProduct[0].images,
        price: singleProduct[0].price,
        discount: singleProduct[0].discount,
        quantity: singleProduct[0].quantity,
        categoryId: singleProduct[0].categoryId
      })
    }
  }, [productId, products])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (e) => {
    // let category = categories.find((item) => item.categoryId === Number(e.target.value))
    // console.log(category)
    setFormData({ ...formData, categoryId: e.target.value })

    // setCategoryId(e.target.value);
  }

  const handleImageChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      // setImage(e.target.files[i])
      setUploading(true)
      Firebase.storage()
        .ref(`/product/${e.target.files[i].name}`)
        .put(e.target.files[i])
        .then(({ ref }) => {
          ref.getDownloadURL().then((url) => {
            if (url) {
              setUploading(false)
              console.log(e.target.name, url)
              setImages([...images, url])
              // setImages([...images,url]);
              console.log(images)
            }
          })
        })
    }
  }

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[i])
        console.log(reader.result)
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
              //console.log(e.target.name, url)
              setImgUrls([...imgUrls, url])
              // setImages([...images,url]);
              console.log(imgUrls)
            }
          })
        })
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    formData.images = images
    try {
      console.log(categoryId)
      dispatch(updateProduct(formData))
      // Clear the form fields after successful registration
      setFormData({
        name: '',
        shortDesc: '',
        desc: '',
        images: [],
        discount:0,
        price: 0,
        quantity: 0,
        categoryId: 0,
      })
      if(error){
        toast.error(error);
        navigate("/signup");
      }else{
        dispatch(showProduct({ page: 0, pageSize: 30 }))
      toast.success("Product updated successfully");
      navigate("/products");
      }
    } catch (err) {
      toast.error(error);
    }
  }

  return (
    <FormContainer className="p-3">
      <h1>Update Product</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleInputChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="desc">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="desc"
            placeholder="Enter description"
            value={formData.desc}
            onChange={handleInputChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="shortDesc">
          <Form.Label>Short Description</Form.Label>
          <Form.Control
            type="text"
            name="shortDesc"
            placeholder="Enter short description"
            value={formData.shortDesc}
            onChange={handleInputChange}
          ></Form.Control>
        </Form.Group>
        {/* <Form.Group className="my-2" controlId="category">
          <Form.Label>Category</Form.Label>

          <Form.Select
            aria-label="category"
            name="category"
            // value={category}
            onChange={handleSelectChange}
          >
            <option>Select..</option>
            {categories?.map((category, i) => (
              <option key={i} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group> */}

        <Form.Group className="my-2" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleInputChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="discount">
          <Form.Label>Discount</Form.Label>
          <Form.Control
            type="number"
            name="discount"
            placeholder="Enter discount"
            value={formData.discount}
            onChange={handleInputChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="quantity">
          <Form.Label>Quantity/ Kg</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleInputChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="image">
          <Form.Label>Images</Form.Label>
          {/* <br />
          {uploading ? (
            <Loader />
          ) : (
            images?.map((image) => {
              console.log(image), (<Image src={image} />)
            })
          )}

          <Form.Control
            type="file"
            label="Choose file"
            multiple
            onChange={handleImageChange}
          ></Form.Control> */}
          {/* <input type="file" multiple name="images" onChange={handleImageChange} /> */}

          <Form.Control
            type="file"
            // accept="image/*"
            multiple
            ref={inputRef}
            
            onChange={handleOnChange}
            // style={{ display: 'none' }}
          ></Form.Control>
          {currentPage === 'crop-img' ? (
            <ImageCropper
              image={images}
              visible={true}
              onCropDone={onCropDone}
              // onCropCancel={onCropCancel}
            />
          ) : (
            <div></div>
          )}
            {/* <Form.Control.Feedback type="invalid">Please choose an image</Form.Control.Feedback> */}
            </Form.Group>
        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}

export default AddProduct
