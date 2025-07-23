import axiosClient from '../axiosClient'

const placesApi = {
  getAllPlaces: () => axiosClient.get('/places'),
  savePlace: (data) => {
    if (data.id) {
      return axiosClient.put(`/places/${data.id}`, data)
    } else {
      return axiosClient.post('/places', data)
    }
  },
  deletePlace: (id) => axiosClient.delete(`/places/${id}`),
  publishPlace: (id, status) =>
    axiosClient.post(`/publish/${id}`, null, {
      params: {
        status,
      },
    }),
}

export default placesApi
