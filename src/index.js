import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import 'react-datepicker/dist/react-datepicker.css'

import App from './App'

import store from './redux/store'
import { AuthContextProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthContextProvider>
    <App />
    </AuthContextProvider>
  </Provider>,
)
