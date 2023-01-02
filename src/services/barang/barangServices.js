import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/barang/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/barang`, {params})
  },  
  fetchById(id){
    return axios.get(`/barang/${id}`)
  },
  create(payload){
    return axios.post(`/barang`, payload)
  },
  update(id, payload){
    return axios.put(`/barang/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/barang/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/barang`, payload)
  },
  fetchDataOptions(params){
    return axios.get(`/barang/options`, {params})
  },
}