import React, { useEffect, useState } from 'react'
import {
  deleteCategory,
  showCategory,
  showCategoryByKeyword,
  updateCategory,
} from '../../redux/slices/CategorySlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button, Container, Form, Card, Table } from 'react-bootstrap'

import CIcon from '@coreui/icons-react'
import { cilDelete, cilPlus } from '@coreui/icons'
import Pagination from '../../components/Pagination/Pagination'
import CardHead from '../../components/CardHeader/CardHeader'
import NodataMsg from '../../components/NoDataMsg/NoDataMsg'

const Category = () => {
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [searchData, setSearchData] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { categories, count, loading } = useSelector((state) => state.category)

  useEffect(() => {
    dispatch(showCategory({ page: 0, pageSize: 5 }))
  }, [])

  const handlehandleChange = (e) => {
    const { name, value } = e.target

    setSearchData({ ...searchData, [name]: value })
  }

  const deleteCategoryData = (categoryId) => {
    try {
      // Prompt for confirmation before deleting the category
      const confirmDelete = window.confirm('Are you sure you want to delete this category?')

      if (confirmDelete) {
        dispatch(deleteCategory(categoryId))
        // After deleting the category, fetch the updated list of categorys
        
        dispatch(showCategory({ page: 0, pageSize: 5 }))
        navigate('/category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  function handlePageClick(e) {
    const selectedPage = e.selected
    console.log(selectedPage)
    dispatch(showCategory({ page: selectedPage, pageSize: 5 }))
    setPage(selectedPage)
  }

  const handleSearch = (e) => {
    let searchVal = e.target.value
    console.log(searchVal)
    setSearchData(searchVal)
    if (searchVal !== '') {
      dispatch(showCategoryByKeyword({ page: 0, keyword: searchVal }))
    } else {
      dispatch(showCategory({ page: 0, pageSize: 5 }))
    }
  }

  const onRefresh = async (e) => {
    setSearchData({
      keyword: '',
      role: '',
    })
    dispatch(showCategory(searchData))
  }

  let p = page + 1
  let countPagination = Math.ceil(count / 5)

  return (
    <>
      <Card>
        <Card.Header>
          <CardHead
            title="Category List"
            count={count}
            placeholder="Category Name"
            value={searchData}
            searchHandler={handleSearch}
            hasSearch={true}
            hasCmnFltr={true}
            hasFilter={true}
            // filterData={props.parentCategry}
            // filterHandler={filterHandler}
            // filter={filter}
            filtertitle="Select Category"
          />
        </Card.Header>
        <Card.Body>
          <Button className="btn_cmn" style={{ marginBottom: '15px' }}>
            <Link to="/add-category" style={{ textDecoration: 'none', color: 'white' }}>
              <i className="fa fa-plus fa-md"></i>

              <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>ADD</span>
            </Link>
          </Button>
          
          <Table className="mt-4" striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Name</th>
                <th>Description</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* {loading && (
                <h2>Loading</h2>)}
              */}
            <tbody>
                {categories.length !== 0 && categories?.map((data, i) => (
                  <tr key={i}>
                    <td>{5 * (p - 1) + i + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.desc}</td>
                    <td>
                      <img src={data.image} width="100px" height="100px" />
                    </td>
                    <td>
                      <Link
                        to={`/update-category/${data.categoryId}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <i className="fa fa-edit fa-lg " style={{ paddingLeft: 10 }}></i>
                      </Link>
                      <i
                        className="fa fa-trash fa-lg"
                        style={{
                          paddingLeft: 10,
                        }}
                        onClick={() => deleteCategoryData(data.categoryId)}
                      ></i>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>

          {categories && categories?.length === 0 && <NodataMsg />}
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

export default Category
