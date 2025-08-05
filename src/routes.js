import React from 'react'

const AuthHandler = React.lazy(() => import('./views/auth/AuthHandler'))
const Places = React.lazy(() => import('./views/places/Places'))
const Tours = React.lazy(() => import('./views/tours/Tours'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  // { path: '/api/auth', name: 'AuthHandler', element: AuthHandler },
  { path: '/places', name: 'Places', element: Places },
  { path: '/tours', name: 'Tours', element: Tours },
]

export default routes
