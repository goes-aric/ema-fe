import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/penjualan/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/penjualan`, {params})
  },  
  fetchById(id){
    return axios.get(`/penjualan/${id}`)
  },
  create(payload){
    return axios.post(`/penjualan`, payload)
  },
  update(id, payload){
    return axios.post(`/penjualan/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/penjualan/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/penjualan`, payload)
  },
  charts(){
    return axios.get(`/penjualan/charts`)
  },   
}