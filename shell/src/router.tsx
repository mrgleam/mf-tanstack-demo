import React from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import NavBar from './NavBar'

// Utility function to replace parent route
const replaceParentRoute = (routes: any[], newParent: any) => {
  return routes?.map(route => {
    route.getParentRoute = () => newParent;
    return route
  });
};

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

// Replace parent routes using the utility function
const updatedShopRoutes = replaceParentRoute(shopRoutes.default.routes, root);

export const router = createRouter({
  routeTree: root.addChildren([indexRoute, ...updatedShopRoutes]),
})
