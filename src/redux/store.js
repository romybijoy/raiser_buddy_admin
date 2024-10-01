import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './slices/UserSlice'
import AuthSlice from './slices/AuthSlice'
import { ApiSlice } from './slices/ApiSlice'
import ProductSlice from './slices/ProductSlice'
import CategorySlice from './slices/CategorySlice'

const store = configureStore({
  reducer: {
    [ApiSlice.reducerPath]: ApiSlice.reducer,
    app: UserSlice,
    auth: AuthSlice,
    product: ProductSlice,
    category: CategorySlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
})

export default store
