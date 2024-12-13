import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { appConfig } from '../../config'

const token = localStorage.getItem('token')

export const createProduct = createAsyncThunk(
  'createProduct',
  async (yourData, { rejectWithValue, dispatch }) => {
    const { name, shortDesc, desc, images, price, discount, quantity, categoryId, provider } = yourData

    const data = {
      name: name,
      shortDesc: shortDesc,
      desc: desc,
      images: images,
      price: price,
      discount: discount,
      quantity: quantity,
    }
    console.log('data', categoryId)

    try {
      const response = await fetch(`${appConfig.ip}/product/${categoryId}/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        return rejectWithValue(response.status)
      }

      const result = await response.json()
      console.log(result)
      dispatch(showProduct({ page: 0 }))
      return result
    } catch (error) {
      console.log(error)
      return rejectWithValue(error)
    }
  },
)

//read action
export const showProduct = createAsyncThunk('showProduct', async (data, { rejectWithValue }) => {
  console.log(data)
  let response
  response = await fetch(`${appConfig.ip}/product?pageNumber=${data.page}&pageSize=5`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  try {
    const result = await response.json()
    // console.log(result);
    return result
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const showProductByKeyword = createAsyncThunk(
  'showProductByKeyword',
  async (data, { rejectWithValue }) => {
    console.log(data.page)
    let response
    response = await fetch(
      `${appConfig.ip}/product/keyword/${data.keyword}?pageNumber=${data.page}&pageSize=5`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    try {
      const result = await response.json()
      console.log(result)
      return result
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

//update action
export const fetchProductById = createAsyncThunk(
  'fetchProductById',
  async (id, { rejectWithValue }) => {
    const response = await fetch(`${appConfig.ip}/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    try {
      const result = await response.json()
      console.log(result)
      return result
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

//delete action
export const deleteProduct = createAsyncThunk(
  'deleteProduct',
  async (id, { rejectWithValue, dispatch }) => {
    const response = await fetch(`${appConfig.ip}/product/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    try {
      const result = await response.json()
      console.log(result)
      dispatch(showProduct({ page: 0 }))
      return result
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

//update action
export const updateProduct = createAsyncThunk(
  'updateProduct',
  async (data, { rejectWithValue, dispatch }) => {
    console.log('updated data', data)
    const response = await fetch(`${appConfig.ip}/product/${data.productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    try {
      const result = await response.json()
      dispatch(showProduct({ page: 0 }))
      return result
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const productDetail = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    message: '',
    error: null,
    searchData: [],
    count: 0,
  },

  reducers: {
    searchProduct: (state, action) => {
      console.log(action.payload)
      state.searchData = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.result = action.payload
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(showProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(showProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.content

        if (action.payload.code === 404) {
          state.products = []
        }
        state.count = action.payload.totalElements
      })
      .addCase(showProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(showProductByKeyword.pending, (state) => {
        state.loading = true
      })
      .addCase(showProductByKeyword.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.content
        if (action.payload.code === 404) {
          state.products = []
        }
        state.count = action.payload.totalElements
      })
      .addCase(showProductByKeyword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload.product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload
        // state.products = state.products.map((ele) =>
        //   ele.id == action.payload.id ? action.payload : ele
        // );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
  },
})

export default productDetail.reducer

export const {} = productDetail.actions
