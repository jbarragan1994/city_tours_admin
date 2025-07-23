import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'

const ConfirmDeleteModal = ({
  visible,
  onConfirm,
  onCancel,
  title = 'Confirm Delete',
  body = 'Are you sure you want to delete this item?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmColor = 'danger',
  cancelColor = 'secondary',
}) => (
  <CModal visible={visible} onClose={onCancel}>
    <CModalHeader>
      <CModalTitle>{title}</CModalTitle>
    </CModalHeader>
    <CModalBody>{body}</CModalBody>
    <CModalFooter>
      <CButton color={confirmColor} onClick={onConfirm} className="text-white">
        {confirmText}
      </CButton>
      <CButton color={cancelColor} onClick={onCancel}>
        {cancelText}
      </CButton>
    </CModalFooter>
  </CModal>
)

export default ConfirmDeleteModal
