import { useState, useEffect } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CRow,
  CFormLabel,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CFormSelect,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilPlus, cilSave, cilXCircle } from '@coreui/icons'
import toursApi from '../../api/endpoints/toursApi'
import taxonomyApi from '../../api/endpoints/taxonomyApi'
import AlertMessage from '../../components/AlertMessage'
import AddPlace from './AddPlace'

const initialForm = {
  content: [
    {
      lang: '',
      name: '',
    },
  ],
  places: [],
}

const NewTour = ({ visible, onClose, onSaved, isEdit, tourId }) => {
  const [form, setForm] = useState(initialForm)
  const [isSaving, setIsSaving] = useState(false)
  const [taxonomies, setTaxonomies] = useState([])
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })

  const isSaveDisabled =
    form.places.length === 0 || form.content.some((entry) => !entry.lang || !entry.name)

  useEffect(() => {
    if (visible && isEdit && tourId) {
      toursApi.getTourById(tourId).then(({ data }) => {
        setForm({
          id: data.id,
          content: data.content,
          places: data.places,
        })
      })
    }
  }, [visible])

  useEffect(() => {
    if (visible) {
      const fetchTaxonomies = async () => {
        try {
          const { data } = await taxonomyApi.getAllTaxonomies()
          setTaxonomies(data.languages || [])
        } catch ({ response }) {
          setAlert({
            visible: true,
            message: response?.data?.message || 'Error al obtener las taxonomías',
            color: 'danger',
          })
        }
      }

      fetchTaxonomies()
    }
  }, [visible])

  const handleChange = (e, index = null, field = null) => {
    const { name, value, type, checked } = e.target

    if (index !== null && field) {
      const updatedContent = [...form.content]
      updatedContent[index][field] = value
      setForm((prev) => ({ ...prev, content: updatedContent }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
  }

  const handleAddContent = () => {
    setForm((prev) => ({
      ...prev,
      content: [...prev.content, { lang: '', name: '' }],
    }))
  }

  const handleRemoveContent = (index) => {
    const updatedContent = [...form.content]
    updatedContent.splice(index, 1)
    setForm((prev) => ({ ...prev, content: updatedContent }))
  }

  const handleClose = () => {
    onClose()
    setForm(initialForm)
  }

  const handleAddRemovePlace = (place, action) => {
    if (action == 'add') {
      setForm((prev) => ({ ...prev, places: [...prev.places, place] }))
    }
    if (action == 'remove') {
      setForm((prev) => ({
        ...prev,
        places: prev.places.filter((p) => p !== place),
      }))
    }
    if (action == 'replace') {
      setForm((prev) => ({ ...prev, places: place }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await toursApi.saveTour({
        ...form,
        places: form.places.map((place) => place.id),
      })
      onSaved()
      setForm(initialForm)
      setAlert({ visible: true, message: 'Tour saved successfully', color: 'success' })
    } catch ({ response }) {
      handleClose()
      setAlert({
        visible: true,
        message: response?.data?.message || 'Error saving tour',
        color: 'danger',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <CModal size="xl" visible={visible} onClose={handleClose}>
        <CModalHeader>
          <CModalTitle>{isEdit ? 'Edit Tour' : 'New Tour'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={12}>
                <h5>Content</h5>
                {form.content.map((entry, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-2">
                          <CFormLabel>Language</CFormLabel>
                          <CFormSelect
                            value={entry.lang}
                            onChange={(e) => handleChange(e, index, 'lang')}
                          >
                            <option value="">Select a language</option>
                            {taxonomies.map((taxonomy) => (
                              <option key={taxonomy.code} value={taxonomy.code}>
                                {taxonomy.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-2">
                          <CFormLabel>Title</CFormLabel>
                          <CFormInput
                            type="text"
                            value={entry.name}
                            onChange={(e) => handleChange(e, index, 'name')}
                            placeholder="e.g. Central Park"
                          />
                        </div>
                      </CCol>
                      <CCol md={12}>
                        {form.content.length > 1 && (
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleRemoveContent(index)}
                          >
                            <CIcon icon={cilTrash} className="text-white" />
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                  </div>
                ))}

                <CButton color="info" onClick={handleAddContent} className="mb-4 text-white">
                  <CIcon icon={cilPlus} className="text-white me-2" />
                  Add Content
                </CButton>
              </CCol>
            </CRow>
          </CForm>

          <AddPlace places={form.places} addRemovePLace={handleAddRemovePlace} />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving || isSaveDisabled}
          >
            <CIcon icon={cilSave} className="text-white me-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </CButton>
          <CButton color="secondary" onClick={handleClose} disabled={isSaving}>
            <CIcon icon={cilXCircle} className="text-white me-2" />
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      <AlertMessage
        visible={alert.visible}
        message={alert.message}
        color={alert.color}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </>
  )
}

export default NewTour
