import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/supplier/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/supplier`, {params})
  },  
  fetchById(id){
    return axios.get(`/supplier/${id}`)
  },
  create(payload){
    return axios.post(`/supplier`, payload)
  },
  update(id, payload){
    return axios.put(`/supplier/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/supplier/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/supplier`, payload)
  },
  fetchDataOptions(params){
    return axios.get(`/supplier/options`, {params})
  },
}