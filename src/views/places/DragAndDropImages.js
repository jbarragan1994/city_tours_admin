import { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { cilXCircle } from '@coreui/icons'

const DragDropImages = ({
  imagesData = [],
  onDeleteImage = () => {},
  onOrderChange = () => {},
}) => {
  const [images, setImages] = useState([])

  const [draggedIndex, setDraggedIndex] = useState(null)

  useEffect(() => {
    if (imagesData.length) setImages(imagesData)
  }, [imagesData])

  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedItem = newImages[draggedIndex]

    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedItem)

    setImages(newImages)
    onOrderChange(newImages)
    setDraggedIndex(null)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '10px',
        padding: '20px',
        margin: 'auto',
        overflowY: 'auto',
        maxHeight: '400px',
        border: '1px solid #ddd',
        borderRadius: '10px',
      }}
      className="mt-3"
    >
      {images.map((image, index) => (
        <div
          key={index}
          style={{
            position: 'relative',
            width: '100%',
            height: '100px',
          }}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
        >
          <img
            src={image}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              border: '2px solid #ccc',
              borderRadius: '8px',
              cursor: 'move',
            }}
          />
          <CIcon
            onClick={() => onDeleteImage(index)}
            style={{
              position: 'absolute',
              top: '3px',
              right: '3px',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
            icon={cilXCircle}
            size="sm"
          />
        </div>
      ))}
    </div>
  )
}

export default DragDropImages
