import axiosClient from '../axiosClient'

const taxonomyApi = {
  getAllTaxonomies: () => axiosClient.get('/taxonomy'),
}

export default taxonomyApi
