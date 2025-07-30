import React from 'react'
import { createRoute, createRouter, useParams, useSearch } from '@tanstack/react-router'
import shopRoot from './__root'

const shopHome = createRoute({
  getParentRoute: () => shopRoot,
  path: '/shop',
  component: () => <div>🛍️ Shop Home</div>,
})

const shopProduct = createRoute({
  getParentRoute: () => shopRoot,
  path: '/shop/$productId',
  validateSearch: (search: Record<string, unknown>) => {
    return {
      category: search.category as string | undefined,
      sort: search.sort as 'asc' | 'desc' | undefined,
      page: Number(search.page) || 1,
    }
  },
  component: () => {
    const { productId } = useParams({ strict: false })

    const { category, sort, page } = useSearch({ strict: false })
    
    return (
      <div>
        <h2>🧾 Product Details</h2>
        <p>Product ID: <strong>{productId}</strong></p>
        <div>
          <p>Category: {category || 'All'}</p>
          <p>Sort: {sort || 'default'}</p>
          <p>Page: {page}</p>
        </div>
        <div>
          <a href={`/shop/${productId}?category=electronics&sort=asc&page=1`}>
            Electronics (Asc)
          </a> | 
          <a href={`/shop/${productId}?category=clothing&sort=desc&page=2`}>
            Clothing (Desc)
          </a>
        </div>
        <a href="/shop">Back to Shop</a>
      </div>
    )
  },
})

export const routes = [shopHome, shopProduct];

export const shopRouter = createRouter({
  routeTree: shopRoot.addChildren(routes),
})
