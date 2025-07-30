import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { shopRouter } from './routes/ShopRoutes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={shopRouter} />
) 