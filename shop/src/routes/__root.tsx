import React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const shopRoot = createRootRoute({
    component: () => (
      <>
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
export default shopRoot

