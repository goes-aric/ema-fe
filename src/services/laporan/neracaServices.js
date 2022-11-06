import axios from '@/axios'

export default {
  fetchDataAccTransaction(params){
    return axios.get(`/neraca/data`, {params})
  },
}