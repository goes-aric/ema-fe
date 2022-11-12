import axios from '@/axios'

export default {
  fetchDataAccTransaction(params){
    return axios.get(`/laba-rugi/data`, {params})
  },
}