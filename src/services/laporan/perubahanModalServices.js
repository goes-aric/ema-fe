import axios from '@/axios'

export default {
  fetchDataAccTransaction(params){
    return axios.get(`/perubahan-modal/data`, {params})
  },  
}