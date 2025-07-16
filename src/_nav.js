import CIcon from '@coreui/icons-react'
import { cilLocationPin, cilMap } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Lugares',
    to: '/places',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tours',
    to: '/tours',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },
]

export default _nav
