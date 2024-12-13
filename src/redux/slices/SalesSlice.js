import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { appConfig } from '../../config'

const token = localStorage.getItem('token')
const dateConverter = (dateString) =>{
  const dateObject = new Date(dateString);
  
  // Extract parts of the date
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(dateObject.getDate()).padStart(2, '0');
  const hours = String(dateObject.getHours()).padStart(2, '0');
  const minutes = String(dateObject.getMinutes()).padStart(2, '0');
  const seconds = String(dateObject.getSeconds()).padStart(2, '0');
  
  // Format the date
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  
  return formattedDate;
  }

  
  

//read action
export const showSales = createAsyncThunk('showSales', async (data, { rejectWithValue }) => {
  console.log(data)

  const startDate = dateConverter(data.startDate);
  const endDate =  dateConverter(data.endDate);
  let response 
  response = await fetch(`${appConfig.ip}/sales/report?startDate=${startDate}&endDate=${endDate}`, {
    method: 'GET',
    headers: {
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


export const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    sales: "",
    loading: false,
    error: null,
    searchData: [],
    count: 0,
  },

  reducers: {
   
  },

  extraReducers: (builder) => {
    builder
     
      .addCase(showSales.pending, (state) => {
        state.loading = true
      })
      .addCase(showSales.fulfilled, (state, action) => {
        state.loading = false
        state.sales = action.payload
      })
      .addCase(showSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default salesSlice.reducer
