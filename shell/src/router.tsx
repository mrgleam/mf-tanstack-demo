import React from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  lazyRouteComponent,
} from '@tanstack/react-router'
import NavBar from './NavBar'

const root = createRootRoute({
  component: () => (
    <>
      <NavBar />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">Go back home</a>
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => root,
  path: '/',
  component: () => (
    <div>
      <h1>Welcome to the Shell App</h1>
      <p>This is the main application shell.</p>
      <p>Module Federation is configured to load shop routes.</p>
      <a href="/shop">Go to Shop</a>
    </div>
  ),
})

const shopRoutes = await import('shop/ShopRoutes');

shopRoutes.default.routes[0].options.getParentRoute = () => root;
shopRoutes.default.routes[1].options.getParentRoute = () => root;

export const router = createRouter({
  routeTree: root.addChildren([indexRoute, ...shopRoutes.default.routes]),
})
