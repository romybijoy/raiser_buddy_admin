import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilBriefcase,
  cilList,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Users Management',
  },

  {
    component: CNavGroup,
    name: 'Users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/users',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Providers Management',
  },

  {
    component: CNavGroup,
    name: 'Providers',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Providers',
        to: '/providers',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Product Management',
  },

  {
    component: CNavGroup,
    name: 'Products',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Products',
        to: '/products',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Order Management',
  },

  {
    component: CNavGroup,
    name: 'Orders',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Orders',
        to: '/orders',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Stock Management',
  },

  {
    component: CNavGroup,
    name: 'Stocks',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Stocks',
        to: '/stocks',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Category Management',
  },

  {
    component: CNavGroup,
    name: 'Category',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Category',
        to: '/category',
      },
    ],
  },

  ,
  {
    component: CNavTitle,
    name: 'Coupon Management',
  },

  {
    component: CNavGroup,
    name: 'Coupon',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Coupon',
        to: '/coupon',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Sales Report',
  },

  {
    component: CNavGroup,
    name: 'Sales Report',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Sales Report',
        to: '/sales',
      },
    ],
  },
]

export default _nav
