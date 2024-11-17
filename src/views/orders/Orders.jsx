import React, { useEffect, useState } from 'react'
import { showOrder, statusChange } from '../../redux/slices/OrderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button, Container, Form, Card, Table } from 'react-bootstrap'
import Pagination from '../../components/Pagination/Pagination'
import CardHead from '../../components/CardHeader/CardHeader'
import NodataMsg from '../../components/NoDataMsg/NoDataMsg'

import CIcon from '@coreui/icons-react'
import { cilUserUnfollow } from '@coreui/icons'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const Orders = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [searchData, setSearchData] = useState('')

  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState('')
  const [id, setId] = useState(0)

  const { orders, count, loading } = useSelector((state) => state.order)

  useEffect(() => {
    dispatch(showOrder({ page: 0 }))
  }, [])

  if (loading) {
    return <h2>Loading</h2>
  }

  // const cancelOrder = async (orderId) => {
  //   try {
  //     // Prompt for confirmation before deleting the order
  //     const confirmDelete = window.confirm('Are you sure you want to cancel this order?')

  //     if (confirmDelete) {
  //       dispatch(cancelOrder(orderId))
  //       // After deleting the order, fetch the updated list of orders
  //       navigate('/orders')
  //     }
  //   } catch (error) {
  //     console.error('Error canceling order:', error)
  //   }
  // }
  const handleStatus = () => {
    dispatch(statusChange({ status: status, id: id }))
    setVisible(false)
    dispatch(showOrder())
  }

  function handlePageClick(e) {
    const selectedPage = e.selected
    console.log(selectedPage)
    dispatch(showOrder({ page: selectedPage }))
    setPage(selectedPage)
  }

  const handleSearch = (e) => {
    let searchVal = e.target.value
    console.log(searchVal)
    setSearchData(searchVal)
    if (searchVal !== '') {
      dispatch(showUsersByKeyword({ page: 0, keyword: searchVal }))
    } else {
      dispatch(showOrder({ page: 0, pageSize: 5 }))
    }
  }

  const submit = (id) => {
    setVisible(!visible)
    setId(id)
  }

  let p = page + 1
  let countPagination = Math.ceil(count / 5)

  return (
    <>
      <Container>
        <Card>
          <Card.Header>
            <CardHead
              title="Orders List"
              count={count}
              placeholder="User Name/ email"
              value={searchData}
              searchHandler={handleSearch}
              hasSearch={false}
              hasCmnFltr={true}
              hasFilter={true}
              // filterData={props.parentCategry}
              // filterHandler={filterHandler}
              // filter={filter}
              filtertitle="Select User"
            />
          </Card.Header>

          <Card.Body>
            <Table className="mt-4" striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>S. No.</th>
                  {/* <th>Name</th> */}
                  <th>Order Id</th>
                  {/* <th>Mobile No.</th> */}
                  <th>Total Items</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h2>Loading</h2>
                ) : (
                  orders.map((order, i) => (
                    <tr key={i}>
                      <td>{5 * (p - 1) + i + 1}</td>
                      {/* <td>{order?.user.name}</td> */}
                      <td>{order?.orderId}</td>
                      {/* <td>{order?.user.mobile_number}</td> */}
                      <td>{order?.totalItem}</td>

                      <td>{new Date(order?.orderDate).toLocaleString()}</td>
                      <td>{order?.orderStatus}</td>
                      <td>
                        <i
                          className="fa fa-exchange"
                          style={{ paddingLeft: 10 }}
                          onClick={() => submit(order?.id)}
                        ></i>
                        {/* <i
                          className="fa fa-ban"
                          style={{ paddingLeft: 10 }}
                          onClick={() => cancelOrder(order?.id)}
                        ></i> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            {orders && orders?.length === 0 && <NodataMsg />}
          </Card.Body>
          <Pagination
            page={page}
            handlePageClick={handlePageClick}
            countPagination={countPagination}
          />
        </Card>
      </Container>

      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Status change</CModalTitle>
        </CModalHeader>
        <CModalBody className="pb-5">
          <select
            name="status"
            onChange={({ target }) => {
              setStatus(target.value)
            }}
          >
            <option>Select Status..</option>
            <option value="confirmed">CONFIRMED</option>
            <option value="ship">SHIPPED</option>
            <option value="deliver">DELIVERED</option>
            <option value="cancel">CANCELLED</option>
          </select>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleStatus}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Orders
