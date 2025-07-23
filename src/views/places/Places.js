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
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilImage, cilPencil, cilTrash, cilCheck } from '@coreui/icons'
import NewPlace from './NewPlace'
import placesApi from '../../api/endpoints/placesApi'
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal'
import AlertMessage from '../../components/AlertMessage'

const Places = () => {
  const [isVisibleNewPlace, setIsVisibleNewPlace] = useState(false)
  const [places, setPlaces] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [editData, setEditData] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [placeToDelete, setPlaceToDelete] = useState(null)
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })

  const fetchData = async () => {
    const { data } = await placesApi.getAllPlaces()
    setPlaces(data)
  }

  const handleEdit = (place) => {
    setIsEdit(true)
    setEditData(place)
    setIsVisibleNewPlace(true)
  }

  const handleDeleteClick = (place) => {
    setPlaceToDelete(place)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (placeToDelete) {
      try {
        await placesApi.deletePlace(placeToDelete.id)
        setShowDeleteModal(false)
        setPlaceToDelete(null)
        setAlert({ visible: true, message: 'Lugar eliminado correctamente', color: 'success' })
        fetchData()
      } catch (err) {
        setShowDeleteModal(false)
        setPlaceToDelete(null)
        setAlert({ visible: true, message: 'Error al eliminar el lugar', color: 'danger' })
      }
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setPlaceToDelete(null)
  }

  const handleApprove = async (place) => {
    const status = place.published ? false : true
    try {
      await placesApi.publishPlace(place.id, status)
      setAlert({ visible: true, message: 'Lugar aprobado correctamente', color: 'success' })
      fetchData()
    } catch (err) {
      setAlert({ visible: true, message: 'Error al aprobar el lugar', color: 'danger' })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <CRow>
        <CCol>
          <h3>Places</h3>
        </CCol>
        <CCol className="text-end">
          <CButton color="primary" onClick={() => setIsVisibleNewPlace(!isVisibleNewPlace)}>
            <CIcon icon={cilPlus} /> New Place
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
                    <CTableHeaderCell>Place ID</CTableHeaderCell>
                    <CTableHeaderCell>Tour ID</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Languages</CTableHeaderCell>
                    <CTableHeaderCell>Coords</CTableHeaderCell>
                    <CTableHeaderCell>Published</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody className="text-center">
                  {places.map((place) => {
                    return (
                      <CTableRow key={place.id}>
                        <CTableDataCell>
                          <CIcon icon={cilImage} size="lg" />
                        </CTableDataCell>
                        <CTableDataCell>{place.id ? place.id.split('-').pop() : ''}</CTableDataCell>
                        <CTableDataCell>
                          {place.tour_id ? place.tour_id.split('-').pop() : ''}
                        </CTableDataCell>
                        <CTableDataCell>{place.content[0]?.name}</CTableDataCell>
                        <CTableDataCell>
                          {place.content.map((entry) => (
                            <div key={entry.lang}>{entry.lang}</div>
                          ))}
                        </CTableDataCell>
                        <CTableDataCell>
                          {place.lat} | {place.lon}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={place.published ? 'success' : 'secondary'}>
                            {place.published ? 'Yes' : 'No'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <CButton
                              color={place.published ? 'secondary' : 'success'}
                              size="sm"
                              className="me-2"
                              onClick={() => handleApprove(place)}
                            >
                              <CIcon icon={cilCheck} style={{ color: 'white' }} />
                            </CButton>
                            <CButton
                              color="info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(place)}
                            >
                              <CIcon icon={cilPencil} className="text-white" />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              className="me-2"
                              onClick={() => handleDeleteClick(place)}
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
      <NewPlace
        visible={isVisibleNewPlace}
        isEdit={isEdit}
        data={editData}
        onClose={() => setIsVisibleNewPlace(false)}
        onSaved={() => {
          setIsVisibleNewPlace(false)
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

export default Places
