import { useEffect } from 'react'
import { CAlert } from '@coreui/react'

const AlertMessage = ({ visible, message, color = 'success', onClose }) => {
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      onClose && onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [visible, onClose])

  if (!visible) return null

  return (
    <CAlert color={color} className="alert-message">
      {message}
    </CAlert>
  )
}

export default AlertMessage
