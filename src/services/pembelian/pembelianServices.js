import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/pembelian/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/pembelian`, {params})
  },  
  fetchById(id){
    return axios.get(`/pembelian/${id}`)
  },
  create(payload){
    return axios.post(`/pembelian`, payload)
  },
  update(id, payload){
    return axios.post(`/pembelian/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/pembelian/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/pembelian`, payload)
  },
  charts(){
    return axios.get(`/pembelian/charts`)
  },  
}