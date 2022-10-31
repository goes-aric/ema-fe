<template>
  <div>
    <!-- Modal Dialog Print -->
    <modal :show="showModal" @close="showModal = false" addClass="modal-xl" modalOrientation="pt-20 lg:pt-6">
      <template v-slot:header><h3>{{ modalTitle }}</h3></template>
      <template v-slot:body>
        <div id="canvasDataPenjualan" class="bg-white rounded-sm overflow-y-auto">
          <div class="flex w-full border-b-2 border-gray-900 pb-2 mb-4 gap-2">
            <div class="w-1/12">
              <img :src="LogoSource" class="h-16 mx-auto">
            </div>
            <div class="w-11/12 text-center">
              <h1 class="text-xl uppercase">Perusahaan Umum Daerah Pasar Mangu Giri Sedana</h1>
              <h1 class="text-xl uppercase">Unit Pasar Umum Beringkit</h1>
              <span>Jalan I Gusti Ngurah Rai Mengwi Badung</span>
            </div>
          </div>
          <div class="block text-center mb-4">
            <h2 class="font-medium uppercase">Laporan Penjualan</h2>
            <h2 class="text-sm">Periode</h2>
            <span class="text-sm font-medium">{{ formatedDate(tanggalAwal) }} s/d {{ formatedDate(tanggalAkhir) }}</span>
          </div>       
          <table>
            <thead>
              <tr>
                <th scope="col" class="bg-white text-gray-800 text-left">No</th>
                <th scope="col" class="bg-white text-gray-800 text-left">Kode Jual</th>
                <th scope="col" class="bg-white text-gray-800 text-left">Tanggal</th>
                <th scope="col" class="bg-white text-gray-800 text-left">Keterangan</th>
                <th scope="col" class="bg-white text-gray-800 text-center">Nominal</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="penjualan">
                <tr v-if="penjualan.length == 0"><td class="text-center" colspan="5">Tidak ada data yang dapat ditampilkan</td></tr>
                <tr v-for="(item, index) in penjualan" :key="item.id">
                  <td class="bg-white text-gray-800 border-gray-200 text-left">{{ incrementIndex(index) }}</td>
                  <td class="bg-white text-gray-800 border-gray-200 text-left">{{ item.kode_jual}}</td>
                  <td class="bg-white text-gray-800 border-gray-200 text-left">{{ formatedDate(item.tanggal) }}</td>
                  <td class="bg-white text-gray-800 border-gray-200 text-left">{{ item.uraian }}</td>
                  <td class="bg-white text-gray-800 border-gray-200 text-right">Rp. {{ formatNumber(toFixed(item.nominal, 0)) }}</td>
                </tr>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <td class="bg-white text-gray-800 border-gray-200 text-left font-medium" colspan="4"><span class="font-medium">Total Penjualan</span></td>
                  <td class="bg-white text-gray-800 border-gray-200 text-right font-medium"><span class="font-medium">Rp. {{ formatNumber(toFixed(this.grandTotal, 0)) }}</span></td>
                </tr>                   
              </template>         
            </tbody>                              
          </table>          
        </div>   
      </template>
      <template v-slot:footer>
        <button :disabled="isLoading" type="button" v-print="printPenjualan" class="btn btn--success" alt="Cetak" title="Cetak">
          Cetak
        </button>
      </template> 
    </modal>     
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import format from '@/helpers/formatNumber'
import { createToastInterface } from 'vue-toastification'
import _ from 'lodash'
import dayjs from 'dayjs'
import penjualanServices from '@/services/penjualan/penjualanServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconPrint from '../icons/IconPrint.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'
import Logo from '../../assets/images/logo.png'

export default {
  name: 'ModalLaporanPenjualan',
  components: { 
    IconPlus,
    IconTrash,
    IconEdit,
    IconPrint,
    IconDateRange,
    Modal,
  },
  setup () { 
    const toastOptions = {
      position: "top-right",
      timeout: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: false,
      pauseOnHover: true,
      draggable: false,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: true,
      closeButton: "button",
      icon: false,
      rtl: false      
    }
    const toast = createToastInterface(toastOptions)

    return {
      toast
    }
  },  
  data() {
    return {
      tanggalAwal: '',
      tanggalAkhir: '',
      awaitingSearch: false,
      penjualan: [],
      grandTotal: '',
      error: [],
      modalTitle: '',     
      showModal: false,
      isLoading: false,
      number: {
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 2,
      },
      printPenjualan: {
        id: "canvasDataPenjualan",
        popTitle: 'Laporan Penjualan',
        beforeOpenCallback (vue) {
          vue.printLoading = true
          console.log('打开之前')
        },
        openCallback (vue) {
          vue.printLoading = false
          console.log('执行了打印')
        },
        closeCallback () {
          console.log('关闭了打印工具')
        }
      },
      LogoSource: Logo,
    }
  },
  methods: {
    async fetchData(props) {
      try {
        this.isLoading = true

        const params = {
          start: dayjs(props.tanggal_awal).format("YYYY/MM/DD"),
          end: dayjs(props.tanggal_akhir).format("YYYY/MM/DD")
        }        
        const response = await penjualanServices.fetchAll(params)
        if (response.data.status === 'success') {
          this.isLoading =false

          this.penjualan = []
          const records = response.data.data
          records.forEach(element => {
            this.penjualan.push(element)
            this.grandTotal = parseFloat(this.unformatNumber(this.toFixed(this.grandTotal, 0))) + parseFloat(this.unformatNumber(this.toFixed(element.nominal, 0)))
          })
        } else {
          this.isLoading =false

          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)          
        }
      } catch (error) {
        this.isLoading =false
        console.log(error.message)
      }
    },
    formatNumber(num) {
      let result = format.formatNumber(num)
      return result
    },
    unformatNumber(num) {
      let result = format.unformatNumber(num)
      return result
    },
    toFixed(num, digit) {
      let result = format.toFixed(num, digit)
      return result
    },
    onlyNumber() {
      return format.onlyNumber()
    },
    toggleModal(props) {
      this.error = []
      this.showModal = true
      this.tanggalAwal = props.tanggal_awal
      this.tanggalAkhir = props.tanggal_akhir
      this.modalTitle = 'Laporan Penjualan'
      this.fetchData(props)
    },
    incrementIndex(key) {
      return key + 1
    },
    formatedDate(date) {
      return dayjs(date).format("DD-MM-YYYY")
    },
  },
  computed: {
    ...mapGetters({
      userData: 'user'
    })
  },
}
</script>