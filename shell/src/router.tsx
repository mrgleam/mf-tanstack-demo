import React from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import NavBar from './NavBar'
import { moduleLoader, MODULE_CONFIGS } from './moduleLoader'

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

// Enhanced Module Federation loader with caching and retry logic
const loadFederatedModules = async () => {
  try {
    // Load all modules using the module loader
    const moduleResults = await moduleLoader.loadModules([
      MODULE_CONFIGS.shop,
      // Add more modules as needed:
      // MODULE_CONFIGS.admin,
      // MODULE_CONFIGS.dashboard,
    ]);

    const modules: any = {};
    
    moduleResults.forEach(result => {
      if (result.success && result.module) {
        const moduleName = result.name.split('/')[0]; // Extract 'shop' from 'shop/ShopRoutes'
        modules[`${moduleName}Routes`] = result.module.default.routes;
      } else {
        console.error(`Module ${result.name} failed to load:`, result.error);
        const moduleName = result.name.split('/')[0];
        modules[`${moduleName}Routes`] = [];
      }
    });

    return modules;
  } catch (error) {
    console.error('Failed to load federated modules:', error);
    return {
      shopRoutes: [],
      // adminRoutes: [],
      // dashboardRoutes: [],
    };
  }
};

// Load modules and create router with enhanced error handling
const createRouterWithFederatedModules = async () => {
  console.log('🚀 Loading federated modules...');
  
  const modules = await loadFederatedModules();
  
  console.log('📦 Loaded modules:', Object.keys(modules));
  
  // Replace parent routes for all modules
  const updatedShopRoutes = replaceParentRoute(modules.shopRoutes, root);
  // const updatedAdminRoutes = replaceParentRoute(modules.adminRoutes, root);
  // const updatedDashboardRoutes = replaceParentRoute(modules.dashboardRoutes, root);

  const router = createRouter({
    routeTree: root.addChildren([
      indexRoute,
      ...updatedShopRoutes,
      // ...updatedAdminRoutes,
      // ...updatedDashboardRoutes,
    ]),
  });

  console.log('✅ Router created successfully');
  return router;
};

// Export the router creation function
export const createRouterAsync = createRouterWithFederatedModules;

// Export cache management functions
export const clearModuleCache = (moduleName?: string) => moduleLoader.clearCache(moduleName);
export const getModuleCacheStatus = () => moduleLoader.getCacheStatus();

export const router = await createRouterAsync();
