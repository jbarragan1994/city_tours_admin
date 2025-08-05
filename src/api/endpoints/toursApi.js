import axiosClient from '../axiosClient'

const toursApi = {
  getAllTours: () => axiosClient.get('/tours'),
  getTourById: (id) => axiosClient.get(`/tours/${id}`),
  saveTour: (data) => {
    if (data.id) {
      return axiosClient.post(`/tours/${data.id}`, data)
    } else {
      return axiosClient.post('/tours', data)
    }
  },
  deleteTour: (id) => axiosClient.delete(`/tours/${id}`),
}

export default toursApi
