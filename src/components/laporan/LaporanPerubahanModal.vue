<template>
  <div>
    <!-- Modal Dialog Print -->
    <modal :show="showModal" @close="showModal = false" addClass="modal-xl" modalOrientation="pt-20 lg:pt-6">
      <template v-slot:header><h3>{{ modalTitle }}</h3></template>
      <template v-slot:body>
        <div id="canvasDataPerubahanModal" class="bg-white rounded-sm overflow-y-auto">
          <div class="flex w-full border-b-2 border-gray-900 pb-2 mb-4 gap-2">
            <div class="w-1/12">
              <img :src="LogoSource" class="h-16 mx-auto">
            </div>
            <div class="w-11/12 text-center">
              <h1 class="text-xl uppercase">Unit Bina Usaha</h1>
              <h1 class="text-xl uppercase">PERUMDA Pasar Mangu Giri Sedana</h1>
              <span>Jalan I Gusti Ngurah Rai Mengwi Badung</span>
            </div>
          </div>
          <div class="block text-center mb-4">
            <h2 class="font-medium uppercase">Laporan Perubahan Modal</h2>
            <h2 class="text-sm">Periode</h2>
            <span class="text-sm font-medium">{{ formatedDate(tanggalAwal) }} s/d {{ formatedDate(tanggalAkhir) }}</span>
          </div>
          <div class="border p-4 text-sm">
            <h2 class="font-semibold border-b text-center pb-2 mb-2 uppercase">PERUBAHAN MODAL</h2>
            <div class="w-full">
              <template v-for="akun in dataPerubahanModal" :key="akun.kode_akun">
                <div class="flex pb-2">
                  <div class="w-1/2">{{ akun.nama_akun }}</div>
                  <div class="w-1/2 text-right">{{ (akun.kredit-akun.debet) < 0 ? '(' + formatNumber(toFixed(akun.kredit-akun.debet, 0)) + ')' : formatNumber(toFixed(akun.kredit-akun.debet, 0)) }}</div>
                </div>
              </template>
              <div class="flex font-medium border-t pt-1">
                <div class="w-1/2 uppercase">Modal Akhir</div>
                <div class="w-1/2 text-right">{{ formatNumber(toFixed(this.totalPerubahanModal, 0)) }}</div>
              </div>              
            </div>        
          </div>
          <div class="flex w-full mt-4">
            <div class="w-1/4"></div>
            <div class="w-1/4"></div>
            <div class="w-2/4 text-center">
              <span class="block text-sm">Mangupura, {{ formatedLongDate(currentDate) }}</span>
              <span class="block text-sm">Perumda Pasar Mangu Giri Sedana</span>
              <span class="block text-sm mb-8">Kepala Unit Bina Usaha</span>
              <span class="text-sm underline">(Ni Rai Putri, SE)</span>
            </div>
          </div>          
        </div>
      </template>
      <template v-slot:footer>
        <button :disabled="isLoading" type="button" v-print="printJurnalUmum" class="btn btn--success" alt="Cetak" title="Cetak">
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
import perubahanModalServices from '@/services/laporan/perubahanModalServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconPrint from '../icons/IconPrint.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'
import Logo from '../../assets/images/logo.png'
dayjs.locale("id")

export default {
  name: 'ModalLaporanPerubahanModal',
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
      dataPerubahanModal: [],
      totalPerubahanModal: 0,
      currentDate: new Date(),
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
      printJurnalUmum: {
        id: "canvasDataPerubahanModal",
        popTitle: 'Laporan Perubahan Modal',
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
    async fetchDataPerubahanModal(props) {
      try {
        this.isLoading = true

        const params = {
          start: dayjs(props.tanggal_awal).format("YYYY/MM/DD"),
          end: dayjs(props.tanggal_akhir).format("YYYY/MM/DD"),
          tipe: 'EKUITAS'
        }        
        const response = await perubahanModalServices.fetchDataAccTransaction(params)
        if (response.data.status === 'success') {
          this.isLoading =false
          const records = response.data.data
          this.dataPerubahanModal = []
          let total = 0
          records.forEach(akun => {
            const find = this.dataPerubahanModal.filter(data => data.kode_akun == akun.kode_akun)
            const index = this.dataPerubahanModal.findIndex(data => data.kode_akun == akun.kode_akun)
            if (find.length == 0) {
              this.dataPerubahanModal.push(akun)
            } else {
              this.dataPerubahanModal[index].debet = parseFloat(this.dataPerubahanModal[index].debet) + parseFloat(akun.debet)
              this.dataPerubahanModal[index].kredit = parseFloat(this.dataPerubahanModal[index].kredit) + parseFloat(akun.kredit)
            }             
            total += (parseFloat(akun.kredit) - parseFloat(akun.debet))
          })
          this.totalPerubahanModal = total
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
      this.clearData()
      this.showModal = true
      this.tanggalAwal = props.tanggal_awal
      this.tanggalAkhir = props.tanggal_akhir
      this.modalTitle = 'Laporan Perubahan Modal'
      this.fetchDataPerubahanModal(props)
    },
    clearData() {
      this.dataPerubahanModal = []
      this.totalPerubahanModal = 0
    },    
    incrementIndex(key) {
      return key + 1
    },      
    formatedDate(date) {
      return dayjs(date).format("DD-MM-YYYY")
    },
    formatedLongDate(date) {
      return dayjs(date).format("DD MMMM YYYY")
    },    
  },
  computed: {
    ...mapGetters({
      userData: 'user'
    })
  },
}
</script>