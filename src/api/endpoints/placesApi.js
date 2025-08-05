import axiosClient from '../axiosClient'

const placesApi = {
  getAllPlaces: () => axiosClient.get('/places'),
  getPlaceById: (id) => axiosClient.get(`/places/${id}`),
  savePlace: (data) => {
    if (data.id) {
      return axiosClient.post(`/places/${data.id}`, data)
    } else {
      return axiosClient.post('/places', data)
    }
  },
  deletePlace: (id) => axiosClient.delete(`/places/${id}`),
  publishPlace: (id, status) => axiosClient.post(`/places/${id}/publish/${status}`),
  uploadPlaceImages: (data) => axiosClient.post('/upload', data),
}

export default placesApi
