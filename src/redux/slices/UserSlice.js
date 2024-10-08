import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { hostname } from '../../config'

const token = localStorage.getItem('token')
//create action
export const createUser = createAsyncThunk('createUser', async (data, { rejectWithValue }) => {
  console.log('data', data)
  const response = await fetch(`${hostname}/auth/register`, {
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
export const showUser = createAsyncThunk('showUser', async (data, { rejectWithValue }) => {
  console.log(data.page)
  let response
 response = await fetch(
        `${hostname}/admin/get-all-users?pageNumber=${data.page}&pageSize=5`,
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


export const showUsersByKeyword = createAsyncThunk('showUsersByKeyword', async (data, { rejectWithValue }) => {
  console.log(data.page)
  let response
 response = await fetch(
        `${hostname}/admin/get-all-users/keyword/${data.keyword}?pageNumber=${data.page}&pageSize=5`,
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
export const blockUser = createAsyncThunk('blockUser', async (data, { rejectWithValue, dispatch }) => {
  const response = await fetch(`${hostname}/admin/block/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ block_reason: data.block_reason }),
  })

  try {
    const result = await response.json()
    console.log(result)
    dispatch(showUser());
    return result
  } catch (error) {
    return rejectWithValue(error)
  }
})

//update action
export const updateUser = createAsyncThunk('updateUser', async (data, { rejectWithValue }) => {
  console.log('updated data', data)
  const response = await fetch(`${hostname}/admin/update/${data.id}`, {
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
export const fetchUserById = createAsyncThunk('fetchUserById', async (id, { rejectWithValue }) => {
  const response = await fetch(`${hostname}/admin/get-users/${id}`, {
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

export const userDetail = createSlice({
  name: 'userDetail',
  initialState: {
    users: [],
    loading: false,
    error: null,
    searchData: [],
    count: 0,
  },

  reducers: {
    searchUser: (state, action) => {
      console.log(action.payload)
      state.searchData = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
      .addCase(showUser.pending, (state) => {
        state.loading = true
      })
      .addCase(showUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.content;
        state.count = action.payload.totalElements;
      })
      .addCase(showUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(showUsersByKeyword.pending, (state) => {
        state.loading = true;
      })
      .addCase(showUsersByKeyword.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content;
        state.count = action.payload.totalElements;
      })
      .addCase(showUsersByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(blockUser.pending, (state) => {
        state.loading = true
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.map((ele) => (ele.id == action.payload.id ? action.payload : ele))
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
    // .addCase(fetchUserById.pending, (state) => {
    //   state.loading = true;
    // })
    // .addCase(fetchUserById.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.user = action.payload.ourUsers;
    // })
    // .addCase(fetchUserById.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.message;
    // });
  },
})

export default userDetail.reducer

export const { searchUser } = userDetail.actions
