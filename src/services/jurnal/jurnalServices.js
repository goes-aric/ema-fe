import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/jurnal/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/jurnal`, {params})
  },  
  fetchById(id){
    return axios.get(`/jurnal/${id}`)
  },
  create(payload){
    return axios.post(`/jurnal`, payload)
  },
  update(id, payload){
    return axios.post(`/jurnal/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/jurnal/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/jurnal`, payload)
  },
  fetchJournalNumber(){
    return axios.get(`/jurnal/number`)
  }  
}