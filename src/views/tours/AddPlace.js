import { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash, cilArrowThickTop, cilArrowThickBottom } from '@coreui/icons'
import placesApi from '../../api/endpoints/placesApi'
import AlertMessage from '../../components/AlertMessage'

const AddPlace = ({ places = [], addRemovePLace = () => {} }) => {
  const [newPlaceValue, setNewPlaceValue] = useState('')
  const [placesList, setPlacesList] = useState([])
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })

  useEffect(() => {
    setPlacesList(places)
  }, [places])

  const handleAddPlace = () => {
    const isPlaceExist = places.find((item) => item.id == newPlaceValue)
    if (isPlaceExist) {
      setAlert({
        visible: true,
        message: 'Places exists on the tour',
        color: 'danger',
      })
      return
    }

    if (newPlaceValue) {
      placesApi
        .getPlaceById(newPlaceValue)
        .then(({ data }) => {
          setPlacesList((prev) => [...prev, data[0]])
          addRemovePLace(data[0], 'add')
          setAlert({ visible: true, message: 'Place added successfully', color: 'success' })
        })
        .catch(({ response }) => {
          setAlert({
            visible: true,
            message: response?.data?.message || 'Error al agregar el lugar',
            color: 'danger',
          })
        })
        .finally(() => {
          setNewPlaceValue('')
        })
    }
  }

  const handleDelete = (place) => {
    addRemovePLace(place, 'remove')
    setPlacesList((prev) => prev.filter((p) => p.id !== place.id))
    setAlert({ visible: true, message: 'Place deleted successfully', color: 'success' })
  }

  const orderPlace = (place, direction) => {
    const index = placesList.findIndex((p) => p.id === place.id)
    let newList = []
    if (direction === 'up' && index > 0) {
      newList = [...placesList]
      const [movedItem] = newList.splice(index, 1)
      newList.splice(index - 1, 0, movedItem)
      setPlacesList(newList)
    } else if (direction === 'down' && index < placesList.length - 1) {
      newList = [...placesList]
      const [movedItem] = newList.splice(index, 1)
      newList.splice(index + 1, 0, movedItem)
      setPlacesList(newList)
    }
    addRemovePLace(newList, 'replace')
  }

  return (
    <>
      <h3>Places</h3>

      <CTable hover striped responsive>
        <CTableHead className="text-center">
          <CTableRow>
            <CTableHeaderCell>Position</CTableHeaderCell>
            <CTableHeaderCell>Image</CTableHeaderCell>
            <CTableHeaderCell>Place ID</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Coords</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody className="text-center">
          {placesList.length === 0 && (
            <CTableRow>
              <CTableDataCell colSpan={6}>No places added</CTableDataCell>
            </CTableRow>
          )}
          {placesList.map((place, index) => {
            return (
              <CTableRow key={place.id}>
                <CTableDataCell>#{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={place.thumbnail}
                    alt={place.content[0]?.name}
                    style={{ maxWidth: '50px', borderRadius: '4px' }}
                  />
                </CTableDataCell>
                <CTableDataCell>{place.id}</CTableDataCell>
                <CTableDataCell>{place.content[0]?.name}</CTableDataCell>
                <CTableDataCell>
                  {place.lat} , {place.lon}
                </CTableDataCell>
                <CTableDataCell>
                  <div>
                    <CButton
                      color="success"
                      size="sm"
                      className="me-2"
                      disabled={index == 0}
                      onClick={() => orderPlace(place, 'up')}
                    >
                      <CIcon icon={cilArrowThickTop} className="text-white" />
                    </CButton>
                    <CButton
                      color="info"
                      size="sm"
                      className="me-2"
                      disabled={index == placesList.length - 1}
                      onClick={() => orderPlace(place, 'down')}
                    >
                      <CIcon icon={cilArrowThickBottom} className="text-white" />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(place)}
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

      <CRow>
        <CCol md={4}>
          <CFormInput
            type="text"
            name="place-uuid"
            placeholder="Place UUID"
            value={newPlaceValue}
            onChange={(e) => setNewPlaceValue(e.target.value.trim())}
          />
        </CCol>
        <CCol md={2}>
          <CButton color="info" className="text-white" onClick={handleAddPlace}>
            <CIcon icon={cilPlus} /> Add Place
          </CButton>
        </CCol>
      </CRow>

      <AlertMessage
        visible={alert.visible}
        message={alert.message}
        color={alert.color}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </>
  )
}

export default AddPlace
