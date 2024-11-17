import React, { useEffect, useState } from 'react'
import { deleteCoupon, showCoupon } from '../../redux/slices/CouponSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button, Container, Form, Card, Table } from 'react-bootstrap'

import CIcon from '@coreui/icons-react'
import { cilDelete, cilPlus } from '@coreui/icons'
import Pagination from '../../components/Pagination/Pagination'
import CardHead from '../../components/CardHeader/CardHeader'
import NodataMsg from '../../components/NoDataMsg/NoDataMsg'
import { toast } from 'react-toastify'

const Coupon = () => {
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [searchData, setSearchData] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { coupons, count, loading } = useSelector((state) => state.coupon)

  useEffect(() => {
    dispatch(showCoupon({ page: 0, pageSize: 5 }))
  }, [])

  const handlehandleChange = (e) => {
    const { name, value } = e.target

    setSearchData({ ...searchData, [name]: value })
  }

  const deleteCouponData = (couponId) => {
    try {
      // Prompt for confirmation before deleting the coupon
      const confirmDelete = window.confirm('Are you sure you want to delete this Coupon?')

      if (confirmDelete) {
        dispatch(deleteCoupon(couponId))
        // After deleting the coupon, fetch the updated list of coupons
        toast.success('Coupon deleted successfully')
        navigate('/coupon')
      }
    } catch (error) {
      console.error('Error deleting coupon:', error)
    }
  }

  function handlePageClick(e) {
    const selectedPage = e.selected
    console.log(selectedPage)
    dispatch(showCoupon({ page: selectedPage, pageSize: 5 }))
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

  let p = page + 1
  let countPagination = Math.ceil(count / 5)

  return (
    <>
      <Card>
        <Card.Header>
          <CardHead
            title="Coupon List"
            count={count}
            placeholder="Category Name"
            // value={searchData}
            // searchHandler={handleSearch}
            // hasSearch={true}
            // hasCmnFltr={true}
            // hasFilter={true}
            // filterData={props.parentCategry}
            // filterHandler={filterHandler}
            // filter={filter}
            filtertitle="Select Category"
          />
        </Card.Header>
        <Card.Body>
          <Button className="btn_cmn" style={{ marginBottom: '15px' }}>
            <Link to="/add-coupon" style={{ textDecoration: 'none', color: 'white' }}>
              <i className="fa fa-plus fa-md"></i>

              <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>ADD</span>
            </Link>
          </Button>

          <Table className="mt-4" striped bordered hover size="sm">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Code</th>
                <th>Discount(%)</th>
                <th>Valid From</th>
                <th>Valid Until</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {coupons.length !== 0 &&
                coupons?.map((data, i) => (
                  <tr key={i}>
                    <td>{5 * (p - 1) + i + 1}</td>
                    <td>{data.code}</td>
                    <td>{data.discount}</td>
                    <td>{data.validFrom}</td>
                    <td>{data.validUntil}</td>
                    <td>
                      <i
                        className="fa fa-trash fa-lg"
                        style={{
                          paddingLeft: 10,
                        }}
                        onClick={() => deleteCouponData(data.id)}
                      ></i>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {coupons && coupons?.length === 0 && <NodataMsg />}
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

export default Coupon
