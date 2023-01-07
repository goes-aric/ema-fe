import axios from '@/axios'

export default {
  fetchData(params){
    return axios.get(`/laporan-pembelian`, {params})
  },
}