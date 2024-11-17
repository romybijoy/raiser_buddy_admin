import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Button, Table } from 'react-bootstrap'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { showSales } from '../../redux/slices/SalesSlice'
import DatePicker from 'react-datepicker'

import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import NodataMsg from '../../components/NoDataMsg/NoDataMsg'

const Sales = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const data = [
    {
      date: '2024-10-01',
      sales: 30,
      amount: 1500,
      orders: [
        { orderId: '123', product: 'Widget A', quantity: 2, price: 500 },
        { orderId: '124', product: 'Widget B', quantity: 1, price: 500 },
      ],
    },
    {
      date: '2024-10-02',
      sales: 50,
      amount: 2500,
      orders: [{ orderId: '125', product: 'Widget C', quantity: 5, price: 500 }],
    },
    // More data
  ]

  const [filteredData, setFilteredData] = useState(data)
  const dispatch = useDispatch()

  const { sales, loading } = useSelector((state) => state.sales)

  const filterData = () => {
    // const filtered = data.filter((item) => {
    //   const itemDate = new Date(item.date)
    //   return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate)
    // })
    // setFilteredData(filtered)

    dispatch(showSales({ startDate: startDate, endDate: endDate }))
  }
  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ['Total Sales:', sales.totalSales],
        ['Sales count:', sales.salesCount],
        ['Total Discount:', sales.totalDiscount],
      ]),
      'Summary',
    )

    const worksheet = XLSX.utils.json_to_sheet(sales.orders)

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report')
    XLSX.writeFile(workbook, 'SalesReport.xlsx')
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

    doc.text(`Sales Report`, 14, 5)

    doc.autoTable({ html: '#sales-table' })

    doc.autoTable({ html: '#order-table' })
    doc.save('SalesReport.pdf')
  }

  // let p = page + 1

  return (
    <div>
      <h3>Sales Report</h3>
      <Form>
        <Form.Group as={Row} controlId="formStartDate">
          <Form.Label column sm={2}>
            Start Date
          </Form.Label>
          <Col sm={4}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="pt-2" controlId="formEndDate">
          <Form.Label column sm={2}>
            End Date
          </Form.Label>
          <Col sm={4}>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="pt-2">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button onClick={filterData}>Filter</Button>
          </Col>
        </Form.Group>
      </Form>

      {sales && (
        <table id="sales-table">
          <tbody>
            <tr>
              <td>Overall Sales Count</td>
              <td className="">{sales.salesCount}</td>
            </tr>
            <tr>
              <td>Overall Sales Discount </td>
              <td>{sales.totalDiscount}</td>
            </tr>
            <tr>
              <td>Overall Total Sales</td>
              <td>
                {''}
                {sales.totalSales}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <Table className="mt-4" striped bordered hover size="sm" id="order-table">
        <thead>
          <tr>
            {/* <th>S. No.</th> */}
            <th>Date</th>
            <th>Order Id</th>
            <th>Total Price</th>
            <th>discount</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <h2>Loading</h2>
          ) : (
            sales?.orders?.length !== 0 &&
            sales?.orders?.map((item, i) => (
              <tr key={i}>
                {/* <td>{5 * (p - 1) + i + 1}</td> */}
                <td>{item.orderDate}</td>
                <td>{item.orderId}</td>
                <td>{item.totalPrice}</td>
                <td>{item.discount}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {sales === '' && <NodataMsg />}

      <div className="pt-3">
        <Button className="m-2" onClick={downloadExcel}>
          Download Excel
        </Button>
        <Button onClick={downloadPDF}>Download PDF</Button>
      </div>
    </div>
  )
}

export default Sales
