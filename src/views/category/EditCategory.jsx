import React, { useEffect, useState } from 'react'
import { showCategory, updateCategory } from '../../redux/slices/CategorySlice'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Firebase } from '../../firebase/config'
import FormContainer from '../../components/Form/FormContainer'
import { Button, Form, Image } from 'react-bootstrap'
import Loader from '../../components/Loader/Loader'

import { toast } from 'react-toastify'

const EditCategory = () => {
  const [formData, setFormData] = useState('')
  const [image, setImage] = useState()
  const { categoryId } = useParams()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { categories, error, loading } = useSelector((state) => state.category)

  useEffect(() => {
    dispatch(showCategory({ page: 0}))
    if (categoryId) {
      const singleCategory = categories.filter(
        (category) => category.categoryId === Number(categoryId),
      )
      setFormData({
        categoryId: categoryId,
        name: singleCategory[0]?.name,
        desc: singleCategory[0]?.desc,
        image: singleCategory[0]?.image,
      })

      setImage(singleCategory[0]?.image)

      console.log(categories)
      console.log(singleCategory)
    }
  }, [categoryId])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
    console.log(e.target.files[0])
    Firebase.storage()
      .ref(`/category/${e.target.files[0].name}`)
      .put(e.target.files[0])
      .then(({ ref }) => {
        ref.getDownloadURL().then((url) => {
          console.log(e.target.name, url)
          setFormData({ ...formData, [e.target.name]: url })
        })
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      console.log(formData)
      dispatch(updateCategory(formData))
      // Clear the form fields after successful registration
      setFormData({
        name: '',
        desc: '',
        image: '',
      })

      if (error) {
        toast.error(error)
        navigate('/category')
      } else {
        dispatch(showCategory({ page: 0, pageSize: 5 }))
        toast.success('Category updated successfully')
        navigate('/category')
      }
    } catch (err) {
      toast.error(error)
      navigate('/category')
    }
  }

  return (
    <FormContainer className="p-3">
      <h1>Update Category</h1>
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

        <Form.Group className="my-2" controlId="name">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="desc"
            placeholder="Enter name"
            value={formData.desc}
            onChange={handleInputChange}
          ></Form.Control>
        </Form.Group>

        {/* <Form.Group className="my-2" controlId="image">
              <Form.Label>Image</Form.Label>
              <br />
              <Image
                alt=""
                width="200px"
                height="200px"
                src={
                  image ? (
                    formData.image === "" ? (
                      <p>Loading...</p>
                    ) : (
                      URL.createObjectURL(formData.image)
                    )
                  ) : (
                    ""
                  )
                }
              ></Image>
    
              <br />
              <input type="file" name="image" onChange={handleImageChange} />
            </Form.Group> */}

        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}

export default EditCategory
