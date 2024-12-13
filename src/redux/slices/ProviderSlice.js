import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { appConfig } from '../../config'

const token = localStorage.getItem('token')
//create action
export const createProvider = createAsyncThunk('createProvider', async (data, { rejectWithValue }) => {
  console.log('data', data)
  const response = await fetch(`${appConfig.ip}/provider`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  try {
    const result = await response.json()
    return result
  } catch (error) {
    return rejectWithValue(error)
  }
})

//read action
export const showProvider = createAsyncThunk('showProvider', async (data, { rejectWithValue }) => {
  console.log(data.page)
  let response
 response = await fetch(
        `${appConfig.ip}/provider?pageNumber=${data.page}&pageSize=5`,
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
})


export const showProvidersByKeyword = createAsyncThunk('showProvidersByKeyword', async (data, { rejectWithValue }) => {
  console.log(data.page)
  let response
 response = await fetch(
        `${appConfig.ip}/provider/keyword/${data.keyword}?pageNumber=${data.page}&pageSize=5`,
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
})


//block action
export const blockProvider = createAsyncThunk('blockProvider', async (data, { rejectWithValue, dispatch }) => {
  const response = await fetch(`${appConfig.ip}/provider/block/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({ block_reason: data.block_reason }),
  })

  try {
    const result = await response.json()
    console.log(result)
    dispatch(showProvider());
    return result
  } catch (error) {
    return rejectWithValue(error)
  }
})

//update action
export const updateProvider = createAsyncThunk('updateProvider', async (data, { rejectWithValue }) => {
  console.log('updated data', data)
  const response = await fetch(`${appConfig.ip}/provider/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  try {
    const result = await response.json()
    return result
  } catch (error) {
    return rejectWithValue(error)
  }
})

//update action
export const fetchProviderById = createAsyncThunk('fetchProviderById', async (id, { rejectWithValue }) => {
  const response = await fetch(`${appConfig.ip}/provider/${id}`, {
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
})

export const providerSlice = createSlice({
  name: 'ptovider',
  initialState: {
    providers: [],
    result:null,
    loading: false,
    error: null,
    searchData: [],
    count: 0,
  },

  reducers: {
   
  },

  extraReducers: (builder) => {
    builder
      .addCase(createProvider.pending, (state) => {
        state.loading = true
      })
      .addCase(createProvider.fulfilled, (state, action) => {
        state.loading = false
        state.result=action.payload;
      })
      .addCase(createProvider.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
      .addCase(showProvider.pending, (state) => {
        state.loading = true
      })
      .addCase(showProvider.fulfilled, (state, action) => {
        state.loading = false
        state.providers = action.payload.content;
        state.count = action.payload.totalElements;
      })
      .addCase(showProvider.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(showProvidersByKeyword.pending, (state) => {
        state.loading = true;
      })
      .addCase(showProvidersByKeyword.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload.content;
        state.count = action.payload.totalElements;
      })
      .addCase(showProvidersByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(blockProvider.pending, (state) => {
        state.loading = true
      })
      .addCase(blockProvider.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(blockProvider.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateProvider.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProvider.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.map((ele) => (ele.id == action.payload.id ? action.payload : ele))
      })
      .addCase(updateProvider.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
  },
})

export default providerSlice.reducer