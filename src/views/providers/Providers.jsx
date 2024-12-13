import React, { useEffect, useState } from 'react'
import { blockProvider, showProvider, showProvidersByKeyword } from '../../redux/slices/ProviderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button, Container, Form, Card, Table } from 'react-bootstrap'
import Pagination from '../../components/Pagination/Pagination'
import CardHead from '../../components/CardHeader/CardHeader'
import NodataMsg from '../../components/NoDataMsg/NoDataMsg'

import CIcon from '@coreui/icons-react'
import { cilUserUnfollow } from '@coreui/icons'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const Providers = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [searchData, setSearchData] = useState('')

  const [visible, setVisible] = useState(false)
  const [reason, setReason] = useState('')
  const [id, setId] = useState(0)

  const { providers, count, loading } = useSelector((state) => state.provider)

  useEffect(() => {
    dispatch(showProvider({ page: 0 }))
  }, [])

  if (loading) {
    return <h2>Loading</h2>
  }

  const handlehandleChange = (e) => {
    const { name, value } = e.target

    setSearchData({ ...searchData, [name]: value })
  }

  const deleteProviderData = async (providerId) => {
    try {
      // Prompt for confirmation before deleting the provider
      const confirmDelete = window.confirm('Are you sure you want to delete this provider?')

      if (confirmDelete) {
        dispatch(deleteProvider(providerId))
        // After deleting the provider, fetch the updated list of providers
        navigate('/home')
      }
    } catch (error) {
      console.error('Error deleting provider:', error)
    }
  }

  function handlePageClick(e) {
    const selectedPage = e.selected
    console.log(selectedPage)
    dispatch(showProvider({ page: selectedPage }))
    setPage(selectedPage)
  }

  const handleSearch = (e) => {
    let searchVal = e.target.value
    console.log(searchVal)
    setSearchData(searchVal)
    if (searchVal !== '') {
      dispatch(showProvidersByKeyword({ page: 0, keyword: searchVal }))
    } else {
      dispatch(showProvider({ page: 0, pageSize: 5 }))
    }
  }

  const onRefresh = async (e) => {
    setSearchData({
      keyword: '',
      role: '',
    })
    dispatch(showProvider(searchData))
  }

  const handleBlock = () => {
    dispatch(blockProvider({ block_reason: reason, id: id }))
    setVisible(false)
    dispatch(showProvider(searchData))
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
              title="Providers List"
              count={count}
              placeholder="Provider Name/ email"
              value={searchData}
              searchHandler={handleSearch}
              hasSearch={true}
              hasCmnFltr={true}
              hasFilter={true}
              // filterData={props.parentCategry}
              // filterHandler={filterHandler}
              // filter={filter}
              filtertitle="Select Provider"
            />
          </Card.Header>
          {/* <Form onSubmit={handleSearch}>
          <Form.Control
            className="mt-3"
            type="text"
            name="keyword"
            placeholder="Enter search"
            // value={}
            onChange={handlehandleChange}
            style={{ width: '20%' }}
          ></Form.Control>

          <Form.Select
            className="mt-3"
            aria-label="Role"
            name="role"
            value={searchData.role}
            onChange={handlehandleChange}
            style={{ width: '20%' }}
          >
            <option value="">Role..</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </Form.Select>
          <Button
            type="submit"
            variant="primary"
            className="mt-3"
            style={{
              marginRight: '20px',
            }}
          >
            Search
          </Button>
          <Button type="submit" onClick={onRefresh} variant="primary" className="mt-3">
            Refresh
          </Button>
        </Form> */}
          <Card.Body>
          <Button className="btn_cmn" style={{ marginBottom: '15px' }}>
            <Link to="/add-provider" style={{ textDecoration: 'none', color: 'white' }}>
              <i className="fa fa-plus fa-md"></i>

              <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>ADD</span>
            </Link>
          </Button>
            <Table className="mt-4" striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Mobile No.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {loading ? (
                <h2>Loading</h2>
              ) : (
                providers && providers?.map((provider, i) => (
                  <tr key={i}>
                    <td>{5 * (p - 1) + i + 1}</td>
                    <td>{provider?.name}</td>
                    <td>{provider?.email}</td>
                    <td>{provider?.role === 'INDIVIDUAL' ? 'Farmer' : 'Company'}</td>
                    <td>{provider?.mobile_number}</td>
                    <td>
                      <CIcon icon={cilUserUnfollow} size="xl" onClick={() => submit(provider?.id)} />
                    </td>
                  </tr>
                )))}
              </tbody>
            </Table>
            {providers && providers?.length === 0 && <NodataMsg />}
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
          <CModalTitle id="VerticallyCenteredExample">Block Provider</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <input
            placeholder="Enter Reason"
            value={reason}
            onChange={({ target }) => {
              setReason(target.value)
            }}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleBlock}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Providers
