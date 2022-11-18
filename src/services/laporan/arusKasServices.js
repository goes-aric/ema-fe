import axios from '@/axios'

export default {
  fetchDataAccTransaction(params){
    return axios.get(`/arus-kas/data`, {params})
  },
}