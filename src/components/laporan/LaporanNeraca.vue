<template>
  <div>
    <!-- Modal Dialog Print -->
    <modal :show="showModal" @close="showModal = false" addClass="modal-xl" modalOrientation="pt-20 lg:pt-6">
      <template v-slot:header><h3>{{ modalTitle }}</h3></template>
      <template v-slot:body>
        <div id="canvasDataNeraca" class="bg-white rounded-sm overflow-y-auto">
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
            <h2 class="font-medium uppercase">Laporan Neraca</h2>
            <h2 class="text-sm">Periode</h2>
            <span class="text-sm font-medium">{{ formatedDate(tanggalAwal) }} s/d {{ formatedDate(tanggalAkhir) }}</span>
          </div>
          <div class="flex border">
            <div class="w-1/2 p-4 border-r">
              <h2 class="text-sm font-semibold border-b text-center pb-2">AKTIVA</h2>
              <div v-for="akun in dataAktiva" :key="akun.kode_akun" class="text-sm">
                <h3 class="py-2 font-medium uppercase">{{ akun.nama_akun }}</h3>
                <template v-for="item in akun.transaksi" :key="item.kode_akun">
                  <div class="flex pb-2">
                    <div class="w-1/2">{{ item.nama_akun }}</div>
                    <div class="w-1/2 text-right">{{ (item.debet-item.kredit) < 0 ? '(' + formatNumber(toFixed(item.debet-item.kredit, 0)) + ')' : formatNumber(toFixed(item.debet-item.kredit, 0)) }}</div>
                  </div>
                </template>
                <div class="flex font-medium pb-2">
                  <div class="w-1/2">Jumlah {{ akun.nama_akun }}</div>
                  <div class="w-1/2 border-t text-right">{{ formatNumber(toFixed(akun.total, 0)) }}</div>
                </div>
              </div>
            </div>
            <div class="w-1/2 p-4">
              <h2 class="text-sm font-semibold border-b text-center pb-2">KEWAJIBAN + EKUITAS</h2>
              <div v-for="akun in dataKewajiban" :key="akun.kode_akun" class="text-sm">
                <h3 class="py-2 font-semibold uppercase">{{ akun.nama_akun }}</h3>
                <template v-for="item in akun.transaksi" :key="item.kode_akun">
                  <div class="flex pb-2">
                    <div class="w-1/2">{{ item.nama_akun }}</div>
                    <div class="w-1/2 text-right">{{ (item.kredit-item.debet) < 0 ? '(' + formatNumber(toFixed(item.kredit-item.debet, 0)) + ')' : formatNumber(toFixed(item.kredit-item.debet, 0)) }}</div>
                  </div>
                </template>
                <div class="flex font-medium pb-2">
                  <div class="w-1/2">Jumlah {{ akun.nama_akun }}</div>
                  <div class="w-1/2 border-t text-right">{{ formatNumber(toFixed(akun.total, 0)) }}</div>
                </div>                
              </div>
              <div v-for="akun in dataEkuitas" :key="akun.kode_akun" class="text-sm">
                <h3 class="py-2 font-semibold uppercase">{{ akun.nama_akun }}</h3>
                <template v-for="item in akun.transaksi" :key="item.kode_akun">
                  <div class="flex pb-2">
                    <div class="w-1/2">{{ item.nama_akun }}</div>
                    <div class="w-1/2 text-right">{{ (item.kredit-item.debet) < 0 ? '(' + formatNumber(toFixed(item.kredit-item.debet, 0)) + ')' : formatNumber(toFixed(item.kredit-item.debet, 0)) }}</div>
                  </div>
                </template>
                <div class="flex font-medium pb-2">
                  <div class="w-1/2">Jumlah {{ akun.nama_akun }}</div>
                  <div class="w-1/2 border-t text-right">{{ formatNumber(toFixed(akun.total, 0)) }}</div>
                </div>                
              </div>              
            </div>
          </div>
          <div class="flex border text-sm font-semibold">
            <div class="w-1/2 p-4 border-r">
              <div class="flex">
                <div class="w-1/2">Total Nilai Aktiva</div>
                <div class="w-1/2 text-right">{{ formatNumber(toFixed(this.totalAktiva, 0)) }}</div>
              </div>
            </div>
            <div class="w-1/2 p-4 border-r">
              <div class="flex">
                <div class="w-1/2">Total Nilai Kewajiban + Ekuitas</div>
                <div class="w-1/2 text-right">{{ formatNumber(toFixed((this.totalKewajiban + this.totalEkuitas), 0)) }}</div>
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
import neracaServices from '@/services/laporan/neracaServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconPrint from '../icons/IconPrint.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'
import Logo from '../../assets/images/logo.png'
dayjs.locale("id")

export default {
  name: 'ModalLaporanNeraca',
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
      dataAktiva: [],
      totalAktiva: 0,
      dataKewajiban: [],
      totalKewajiban: 0,
      dataEkuitas: [],
      totalEkuitas: 0,
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
        id: "canvasDataNeraca",
        popTitle: 'Laporan Neraca',
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
    async fetchDataAktiva(props) {
      try {
        this.isLoading = true

        const params = {
          start: dayjs(props.tanggal_awal).format("YYYY/MM/DD"),
          end: dayjs(props.tanggal_akhir).format("YYYY/MM/DD"),
          tipe: 'AKTIVA'
        }        
        const response = await neracaServices.fetchDataAccTransaction(params)
        if (response.data.status === 'success') {
          this.isLoading =false
          const records = response.data.data
          this.dataAktiva = []
          let total = 0
          records.forEach(akun => {
            let totalItem = 0
            let transaksi = []
            akun.transaksi.forEach(item => {
              const find = transaksi.filter(data => data.kode_akun == item.kode_akun)
              const index = transaksi.findIndex(data => data.kode_akun == item.kode_akun)
              if (find.length == 0) {
                transaksi.push(item)
              } else {
                transaksi[index].debet = parseFloat(transaksi[index].debet) + parseFloat(item.debet)
                transaksi[index].kredit = parseFloat(transaksi[index].kredit) + parseFloat(item.kredit)
              }             
              totalItem += (parseFloat(item.debet) - parseFloat(item.kredit))
            })
            this.dataAktiva.push({
              kode_akun: akun.kode_akun,
              nama_akun: akun.nama_akun,
              akun_utama: akun.akun_utama,
              tipe_akun: akun.tipe_akun,
              transaksi: transaksi,
              total: totalItem
            })
            total += parseFloat(totalItem)
          })
          this.totalAktiva = total
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
    async fetchDataKewajiban(props) {
      try {
        this.isLoading = true

        const params = {
          start: dayjs(props.tanggal_awal).format("YYYY/MM/DD"),
          end: dayjs(props.tanggal_akhir).format("YYYY/MM/DD"),
          tipe: 'KEWAJIBAN'
        }
        const response = await neracaServices.fetchDataAccTransaction(params)
        if (response.data.status === 'success') {
          this.isLoading =false
          const records = response.data.data
          this.dataKewajiban = []
          let total = 0
          records.forEach(akun => {
            let totalItem = 0
            let transaksi = []
            akun.transaksi.forEach(item => {
              const find = transaksi.filter(data => data.kode_akun == item.kode_akun)
              const index = transaksi.findIndex(data => data.kode_akun == item.kode_akun)
              if (find.length == 0) {
                transaksi.push(item)
              } else {
                transaksi[index].debet = parseFloat(transaksi[index].debet) + parseFloat(item.debet)
                transaksi[index].kredit = parseFloat(transaksi[index].kredit) + parseFloat(item.kredit)
              }             
              totalItem += (parseFloat(item.debet) - parseFloat(item.kredit))
            })
            this.dataKewajiban.push({
              kode_akun: akun.kode_akun,
              nama_akun: akun.nama_akun,
              akun_utama: akun.akun_utama,
              tipe_akun: akun.tipe_akun,
              transaksi: transaksi,
              total: totalItem
            })
            total += parseFloat(totalItem)
          })
          this.totalKewajiban = total
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
    async fetchDataEkuitas(props) {
      try {
        this.isLoading = true

        const params = {
          start: dayjs(props.tanggal_awal).format("YYYY/MM/DD"),
          end: dayjs(props.tanggal_akhir).format("YYYY/MM/DD"),
          tipe: 'EKUITAS'
        }        
        const response = await neracaServices.fetchDataAccTransaction(params)
        if (response.data.status === 'success') {
          this.isLoading =false
          const records = response.data.data
          this.dataEkuitas = []
          let total = 0
          records.forEach(akun => {
            let totalItem = 0
            let transaksi = []
            akun.transaksi.forEach(item => {
              const find = transaksi.filter(data => data.kode_akun == item.kode_akun)
              const index = transaksi.findIndex(data => data.kode_akun == item.kode_akun)
              if (find.length == 0) {
                transaksi.push(item)
              } else {
                transaksi[index].debet = parseFloat(transaksi[index].debet) + parseFloat(item.debet)
                transaksi[index].kredit = parseFloat(transaksi[index].kredit) + parseFloat(item.kredit)
              }             
              totalItem += (parseFloat(item.debet) - parseFloat(item.kredit))
            })
            this.dataEkuitas.push({
              kode_akun: akun.kode_akun,
              nama_akun: akun.nama_akun,
              akun_utama: akun.akun_utama,
              tipe_akun: akun.tipe_akun,
              transaksi: transaksi,
              total: totalItem
            })
            total += parseFloat(totalItem)
          })
          this.totalEkuitas = total
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
      this.modalTitle = 'Laporan Neraca'
      this.fetchDataAktiva(props)
      this.fetchDataKewajiban(props)
      this.fetchDataEkuitas(props)
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