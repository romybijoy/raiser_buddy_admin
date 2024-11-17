import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './slices/UserSlice'
import AuthSlice from './slices/AuthSlice'
import { ApiSlice } from './slices/ApiSlice'
import ProductSlice from './slices/ProductSlice'
import CategorySlice from './slices/CategorySlice'
import OrderSlice from './slices/OrderSlice'
import CouponSlice from './slices/CouponSlice'
import SalesSlice from './slices/SalesSlice'
import ProviderSlice from './slices/ProviderSlice'
import SidebarSlice from './slices/SidebarSlice'
import DashboardSlice from './slices/DashboardSlice'

const store = configureStore({
  reducer: {
    [ApiSlice.reducerPath]: ApiSlice.reducer,
    app: UserSlice,
    auth: AuthSlice,
    product: ProductSlice,
    category: CategorySlice,
    order: OrderSlice,
    coupon: CouponSlice,
    sales: SalesSlice,
    provider: ProviderSlice,
    sidebar: SidebarSlice,
    dashboard: DashboardSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
})

export default store
