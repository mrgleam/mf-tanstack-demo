import { Link } from '@tanstack/react-router'
import React from 'react'
export default function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/shop">Shop Home</Link> | <Link to="/shop/name-xyz">Shop Product</Link>
    </nav>
  )
}
