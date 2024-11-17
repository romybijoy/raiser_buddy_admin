import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const Users = React.lazy(() => import('./views/users/Users'))
const Providers = React.lazy(() => import('./views/providers/Providers'))
const Products = React.lazy(() => import('./views/products/Products'))
const Category = React.lazy(() => import('./views/category/Category'))
const Stocks = React.lazy(() => import('./views/stocks/Stocks'))
const UpdateStock = React.lazy(() => import('./views/stocks/EditStock'))
const Orders = React.lazy(() => import('./views/orders/Orders'))

const AddProduct = React.lazy(() => import('./views/products/AddProduct'))
const AddCategory = React.lazy(() => import('./views/category/AddCategory'))
const UpdateProduct = React.lazy(() => import('./views/products/EditProduct'))
const UpdateCategory = React.lazy(() => import('./views/category/EditCategory'))

const Sales = React.lazy(() => import('./views/salesReport/Sales'))

const Coupon = React.lazy(() => import('./views/coupon/Coupon'))
const AddCoupon = React.lazy(() => import('./views/coupon/AddCoupon'))

const routes = [
  { path: '/home', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/users', name: 'Users', element: Users },
  { path: '/products', name: 'Products', element: Products },
  { path: '/category', name: 'Category', element: Category },
  { path: '/add-category', name: 'Add Category', element: AddCategory },
  { path: '/add-product', name: 'Add Product', element: AddProduct },
  { path: '/update-category/:categoryId', name: 'Update Category', element: UpdateCategory },
  { path: '/update-product/:productId', name: 'Update Product', element: UpdateProduct },
  { path: '/update-stock/:productId', name: 'Update Stock', element: UpdateStock },
  { path: '/stocks', name: 'Stocks', element: Stocks },
  { path: '/orders', name: 'Orders', element: Orders },

  { path: '/providers', name: 'Providers', element: Providers },
  { path: '/sales', name: 'Sales', element: Sales },
  { path: '/coupon', name: 'Coupon', element: Coupon },
  { path: '/add-coupon', name: 'Add Coupon', element: AddCoupon },
]

export default routes
