import React, { useEffect, useState } from 'react'
import {
  deleteProduct,
  showProduct,
  showProductByKeyword,
  updateProduct,
} from '../../redux/slices/ProductSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button, Container, Form, Card, Table } from 'react-bootstrap'

import CIcon from '@coreui/icons-react'
import { cilPlus, cilDelete } from '@coreui/icons'
import Pagination from '../../components/Pagination/Pagination'
import CardHead from '../../components/CardHeader/CardHeader'
import NodataMsg from '../../components/NoDataMsg/NoDataMsg'

const Stocks = () => {
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [searchData, setSearchData] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { products, count, loading } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(showProduct({ page: 0 }))
  }, [])

  if (loading) {
    return <h2>Loading</h2>
  }

  const handlehandleChange = (e) => {
    const { name, value } = e.target

    setSearchData({ ...searchData, [name]: value })
  }

  const deleteProductData = async (productId) => {
    try {
      // Prompt for confirmation before deleting the product
      const confirmDelete = window.confirm('Are you sure you want to delete this product?')

      if (confirmDelete) {
        dispatch(deleteProduct(productId))
        // After deleting the product, fetch the updated list of products
        navigate('/products')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  function handlePageClick(e) {
    const selectedPage = e.selected
    console.log(selectedPage)
    dispatch(showProduct({ page: selectedPage }))

    setPage(selectedPage)
  }

  const handleSearch = (e) => {
    let searchVal = e.target.value
    console.log(searchVal)
    setSearchData(searchVal)
    if (searchVal !== '') {
      dispatch(showProductByKeyword({ page: 0, keyword: searchVal }))
    } else {
      dispatch(showProduct({ page: 0, pageSize: 5 }))
    }
  }

  const onRefresh = async (e) => {
    setSearchData('')
    dispatch(showProduct(searchData))
  }

  let p = page + 1
  let countPagination = Math.ceil(count / 5)

  return (
    <>
      <Card>
        <Card.Header>
          <CardHead
            title="Stock List"
            count={count}
            placeholder="Product Name"
            value={searchData}
            searchHandler={handleSearch}
            hasSearch={true}
            hasCmnFltr={true}
            hasFilter={true}
            // filterData={props.parentCategry}
            // filterHandler={filterHandler}
            // filter={filter}
            filtertitle="Select Stock Product"
          />
        </Card.Header>
        <Card.Body>
          <Table className="mt-4" striped bordered hover size="sm">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Name</th>
                <th>Short Desc</th>
                <th>Description</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Special Price</th>
                <th>Stock</th>
                {/* <th>Images</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <h2>Loading</h2>
              ) : (
                products.length !== 0 &&
                products?.map((data, i) => (
                  <tr key={i}>
                    <td>{5 * (p - 1) + i + 1}</td>
                    <td>{data?.name}</td>
                    <td>{data?.shortDesc}</td>
                    <td>{data?.desc}</td>
                    <td>{data?.price}</td>
                    <td>{data?.discount}</td>
                    <td>{data?.specialPrice}</td>
                    <td>{data?.quantity}</td>
                    {/* <td>
                    {data.images.map((image, i) => (
                      <img key={i} src={image} width="100px" height="100px" />
                    ))}
                  </td> */}
                    <td>
                      <Link
                        to={`/update-stock/${data.productId}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <i className="fa fa-edit fa-lg " style={{ paddingLeft: 10 }}></i>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {products && products?.length === 0 && <NodataMsg />}
        </Card.Body>
        <Pagination
          page={page}
          handlePageClick={handlePageClick}
          countPagination={countPagination}
        />
      </Card>
    </>
  )
}

export default Stocks
