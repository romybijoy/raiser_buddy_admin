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
  const [currentStatus, setCurrentStatus] = useState('')

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

  const handleStatus = () => {
    if (!status) return
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

  const submit = (id, status) => {
    setVisible(true)
    setId(id)
    setStatus('') // reset dropdown
    setCurrentStatus(status)
  }

  let p = page + 1
  let countPagination = Math.ceil(count / 5)

  const statusFlow = {
    PLACED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  }

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
            <Table className="mt-4" striped bordered hover size="sm" responsive>
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
                        {order.orderStatus !== 'PENDING' && (
                          <i
                            className="fa fa-exchange"
                            style={{ paddingLeft: 10 }}
                            onClick={() => submit(order?.id, order?.orderStatus)}
                          ></i>
                        )}
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
        <CModalBody className="pb-5 space-y-4">
          {/* Current Status */}
          <p className="text-sm text-gray-500 mx-1">
            Current Status :{' '}
            <span className="font-semibold text-gray-700 mx-1">{currentStatus}</span>
          </p>

          {/* Dropdown */}
          {statusFlow[currentStatus]?.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-gray-600 mx-1">Update Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
               bg-white text-gray-700 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>

                {statusFlow[currentStatus]?.map((s) => (
                  <option key={s} value={s}>
                    {s === 'CONFIRMED' && '✅ Confirmed'}
                    {s === 'SHIPPED' && '🚚 Shipped'}
                    {s === 'DELIVERED' && '📦 Delivered'}
                    {s === 'CANCELLED' && '❌ Cancelled'}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-gray-500 text-sm bg-gray-100 p-3 rounded-lg">
              ✅ This order is completed. No further updates allowed.
            </div>
          )}
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
