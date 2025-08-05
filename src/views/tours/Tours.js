import { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons'
import toursApi from '../../api/endpoints/toursApi'
import NewTour from './NewTour'
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal'
import AlertMessage from '../../components/AlertMessage'

const Tours = () => {
  const [isVisibleRegisterModal, setIsVisibleRegisterModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [tourIdSelected, setTourIdSelected] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tourToDelete, setTourToDelete] = useState(null)
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })
  const [tours, setTours] = useState([])

  const fetchData = async () => {
    const { data } = await toursApi.getAllTours()
    setTours(data)
  }

  const handleEdit = (tour) => {
    setIsEdit(true)
    setTourIdSelected(tour.id)
    setIsVisibleRegisterModal(true)
  }

  const handleDeleteClick = (tour) => {
    setTourToDelete(tour)
    setShowDeleteModal(true)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setTourToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (tourToDelete) {
      try {
        await toursApi.deleteTour(tourToDelete.id)
        setShowDeleteModal(false)
        setTourToDelete(null)
        setAlert({ visible: true, message: 'Tour deleted successfully', color: 'success' })
        fetchData()
      } catch (err) {
        setShowDeleteModal(false)
        setTourToDelete(null)
        setAlert({
          visible: true,
          message: response?.data?.message || 'Error al eliminar el tour',
          color: 'danger',
        })
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <CRow>
        <CCol>
          <h3>Tours</h3>
        </CCol>
        <CCol className="text-end">
          <CButton
            color="primary"
            onClick={() => setIsVisibleRegisterModal(!isVisibleRegisterModal)}
          >
            <CIcon icon={cilPlus} className="me-2" /> New Tour
          </CButton>
        </CCol>
      </CRow>
      <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardBody>
              <CTable hover striped responsive>
                <CTableHead className="text-center">
                  <CTableRow>
                    <CTableHeaderCell>Image</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Languages</CTableHeaderCell>
                    <CTableHeaderCell>Places</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody className="text-center">
                  {tours.map((tour) => {
                    return (
                      <CTableRow key={tour.id}>
                        <CTableDataCell>
                          <img
                            src={tour.thumbnail}
                            alt={tour.content[0]?.name}
                            style={{ maxWidth: '50px', borderRadius: '4px' }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{tour.content[0]?.name}</CTableDataCell>
                        <CTableDataCell>
                          {tour.content.map((entry) => entry.lang).join(', ')}
                        </CTableDataCell>
                        <CTableDataCell>{tour.place_count}</CTableDataCell>

                        <CTableDataCell>
                          <div>
                            <CButton
                              color="info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(tour)}
                            >
                              <CIcon icon={cilPencil} className="text-white" />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              className="me-2"
                              onClick={() => handleDeleteClick(tour)}
                            >
                              <CIcon icon={cilTrash} className="text-white" />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <NewTour
        visible={isVisibleRegisterModal}
        isEdit={isEdit}
        tourId={tourIdSelected}
        onClose={() => {
          setIsVisibleRegisterModal(false)
          setTourIdSelected(null)
        }}
        onSaved={() => {
          setTourIdSelected(null)
          setIsVisibleRegisterModal(false)
          fetchData()
        }}
      />
      <ConfirmDeleteModal
        visible={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <AlertMessage
        visible={alert.visible}
        message={alert.message}
        color={alert.color}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </>
  )
}

export default Tours
