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
  CFormTextarea,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilPlus, cilSave, cilXCircle } from '@coreui/icons'
import placesApi from '../../api/endpoints/placesApi'
import AlertMessage from '../../components/AlertMessage'

const initialForm = {
  content: [
    {
      lang: '',
      name: '',
      text: '',
    },
  ],
  images: [],
  lat: '',
  lon: '',
  published: false,
}

const NewPlace = ({ visible, onClose, onSaved, isEdit, data = {} }) => {
  const [form, setForm] = useState(initialForm)
  const [imagePreview, setImagePreview] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })

  useEffect(() => {
    if (isEdit && data) {
      setForm({
        id: data.id || '',
        content: data.content || initialForm.content,
        images: [],
        lat: data.lat || '',
        lon: data.lon || '',
        published: data.published || false,
      })
    }
  }, [isEdit, data])

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
      content: [...prev.content, { lang: '', name: '', text: '' }],
    }))
  }

  const handleRemoveContent = (index) => {
    const updatedContent = [...form.content]
    updatedContent.splice(index, 1)
    setForm((prev) => ({ ...prev, content: updatedContent }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    const base64Images = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result.split(',')[1])
            reader.onerror = reject
            reader.readAsDataURL(file)
          }),
      ),
    )
    setForm((prev) => ({ ...prev, images: base64Images }))
    setImagePreview(files.map((file) => URL.createObjectURL(file)))
  }

  const handleClose = () => {
    onClose()
    setForm(initialForm)
    setImagePreview([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await placesApi.savePlace({
        ...form,
      })
      onSaved()
      setForm(initialForm)
      setImagePreview([])
      setAlert({ visible: true, message: 'Lugar guardado correctamente', color: 'success' })
    } catch (error) {
      handleClose()
      setAlert({ visible: true, message: 'Error al guardar el lugar', color: 'danger' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <CModal size="xl" visible={visible} onClose={handleClose}>
        <CModalHeader>
          <CModalTitle>{isEdit ? 'Edit Place' : 'New Place'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow>
              <h5>Place</h5>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Latitude</CFormLabel>
                  <CFormInput
                    type="number"
                    step="any"
                    name="lat"
                    value={form.lat}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Longitude</CFormLabel>
                  <CFormInput
                    type="number"
                    step="any"
                    name="lon"
                    value={form.lon}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

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
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
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
                        <div className="mb-2">
                          <CFormLabel>Text</CFormLabel>
                          <CFormTextarea
                            value={entry.text}
                            onChange={(e) => handleChange(e, index, 'text')}
                            rows={4}
                            placeholder="Descriptive text"
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

              <CCol md={12}>
                <div className="mb-3">
                  <h5>Images</h5>
                  <CFormInput type="file" accept="image/*" multiple onChange={handleImageUpload} />
                  {imagePreview.length > 0 && (
                    <div className="mt-3 d-flex flex-wrap gap-2">
                      {imagePreview.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`preview-${idx}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CCol>

              <CCol md={12}>
                <div className="mb-3">
                  <CFormCheck
                    type="checkbox"
                    name="published"
                    checked={form.published}
                    onChange={handleChange}
                    label="Published"
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" type="submit" onClick={handleSubmit} disabled={isSaving}>
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

export default NewPlace
