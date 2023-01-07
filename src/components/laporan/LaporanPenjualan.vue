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
              <h1 class="text-xl uppercase">Unit Bina Usaha</h1>
              <h1 class="text-xl uppercase">PERUMDA Pasar Mangu Giri Sedana</h1>
              <span>Jalan I Gusti Ngurah Rai Mengwi Badung</span>
            </div>
          </div>
          <div class="block text-center mb-4">
            <h2 class="font-medium uppercase">
              <span v-if="jenis == 'rekapitulasi'">Laporan Rekapitulasi Penjualan</span>
              <span v-else-if="jenis == 'item'">Laporan Item Penjualan</span>
              <span v-else>Penjualan Teratas</span>              
            </h2>
            <h2 class="text-sm">Periode</h2>
            <span class="text-sm font-medium">{{ formatedDate(tanggalAwal) }} s/d {{ formatedDate(tanggalAkhir) }}</span>
          </div>       
          <template v-if="jenis == 'rekapitulasi'">
            <table>
              <thead>
                <tr>
                  <th scope="col" class="bg-white text-gray-800 text-left">No</th>
                  <th scope="col" class="bg-white text-gray-800 text-left">No Transaksi</th>
                  <th scope="col" class="bg-white text-gray-800 text-left">Tanggal</th>
                  <th scope="col" class="bg-white text-gray-800 text-left">Total</th>
                  <th scope="col" class="bg-white text-gray-800 text-center">Diskon</th>
                  <th scope="col" class="bg-white text-gray-800 text-center">Grand Total</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="penjualan">
                  <tr v-if="penjualan.length == 0"><td class="text-center" colspan="6">Tidak ada data yang dapat ditampilkan</td></tr>
                  <tr v-for="(item, index) in penjualan" :key="item.id">
                    <td class="bg-white text-gray-800 border-gray-200 text-left">{{ incrementIndex(index) }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-left">{{ item.no_transaksi}}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-left">{{ formatedDate(item.tanggal) }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-right">Rp. {{ formatNumber(toFixed(item.total, 0)) }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-right">Rp. {{ formatNumber(toFixed(item.diskon, 0)) }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-right">Rp. {{ formatNumber(toFixed(item.grand_total, 0)) }}</td>
                  </tr>
                  <tr class="border-b border-gray-200 bg-gray-50">
                    <td class="bg-white text-gray-800 border-gray-200 text-left font-medium" colspan="3"><span class="font-medium">Total</span></td>
                    <td class="bg-white text-gray-800 border-gray-200 text-right font-medium"><span class="font-medium">Rp. {{ formatNumber(toFixed(this.total, 0)) }}</span></td>
                    <td class="bg-white text-gray-800 border-gray-200 text-right font-medium"><span class="font-medium">Rp. {{ formatNumber(toFixed(this.diskon, 0)) }}</span></td>
                    <td class="bg-white text-gray-800 border-gray-200 text-right font-medium"><span class="font-medium">Rp. {{ formatNumber(toFixed(this.grandTotal, 0)) }}</span></td>
                  </tr>                   
                </template>         
              </tbody>
            </table>
          </template>
          <template v-else-if="jenis == 'item'">
            <table>
              <thead>
                <tr>
                  <th scope="col" class="bg-white text-gray-800 text-left">No</th>
                  <th scope="col" class="bg-white text-gray-800 text-left">Kode Barang</th>
                  <th scope="col" class="bg-white text-gray-800 text-left">Nama Barang</th>
                  <th scope="col" class="bg-white text-gray-800 text-left">Satuan</th>
                  <th scope="col" class="bg-white text-gray-800 text-center">Harga</th>
                  <th scope="col" class="bg-white text-gray-800 text-center">Qty</th>
                  <th scope="col" class="bg-white text-gray-800 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="penjualan">
                  <tr v-if="penjualan.length == 0"><td class="text-center" colspan="5">Tidak ada data yang dapat ditampilkan</td></tr>
                  <tr v-for="(item, index) in penjualan" :key="item.id">
                    <td class="bg-white text-gray-800 border-gray-200 text-left">{{ incrementIndex(index) }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-left">{{ item.kode_barang }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-left">{{ item.nama_barang }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-left">{{ item.satuan }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-right">Rp. {{ formatNumber(toFixed(item.harga, 0)) }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-right">{{ formatNumber(toFixed(item.qty, 0)) }}</td>
                    <td class="bg-white text-gray-800 border-gray-200 text-right">Rp. {{ formatNumber(toFixed(item.total, 0)) }}</td>
                  </tr>                
                </template>         
              </tbody>
            </table>            
          </template>
          <template v-else>
            <div class="w-full flex gap-4">
              <div class="w-full md:w-1/2 mb-2">
                <highcharts :options="salesChartOptions" ref="salesCharts"></highcharts>
              </div>
              <div class="w-full md:w-1/2 mb-2">
                <table>
                  <thead>
                    <tr>
                      <th scope="col" class="bg-white text-gray-800 text-left">No</th>
                      <th scope="col" class="bg-white text-gray-800 text-left">Kode Barang</th>
                      <th scope="col" class="bg-white text-gray-800 text-left">Nama Barang</th>
                      <th scope="col" class="bg-white text-gray-800 text-left">Satuan</th>
                      <th scope="col" class="bg-white text-gray-800 text-center">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="penjualan">
                      <tr v-if="penjualan.length == 0"><td class="text-center" colspan="5">Tidak ada data yang dapat ditampilkan</td></tr>
                      <tr v-for="(item, index) in penjualan" :key="item.id">
                        <td class="bg-white text-gray-800 border-gray-200 text-left">{{ incrementIndex(index) }}</td>
                        <td class="bg-white text-gray-800 border-gray-200 text-left">{{ item.kode_barang }}</td>
                        <td class="bg-white text-gray-800 border-gray-200 text-left">{{ item.nama_barang }}</td>
                        <td class="bg-white text-gray-800 border-gray-200 text-left">{{ item.satuan }}</td>
                        <td class="bg-white text-gray-800 border-gray-200 text-right">{{ formatNumber(toFixed(item.qty, 0)) }}</td>
                      </tr>                
                    </template>         
                  </tbody>
                </table>
              </div>
            </div>          
          </template>          
          <div class="flex w-full mt-4 pt-4 border-t">
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
import penjualanServices from '@/services/laporan/penjualanServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconPrint from '../icons/IconPrint.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'
import Logo from '../../assets/images/logo.png'
dayjs.locale("id")
import {Chart} from 'highcharts-vue'
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import exportingData from 'highcharts/modules/export-data'

exportingInit(Highcharts)
exportingData(Highcharts)

export default {
  name: 'ModalLaporanPenjualan',
  components: { 
    IconPlus,
    IconTrash,
    IconEdit,
    IconPrint,
    IconDateRange,
    Modal,
    highcharts: Chart,
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
      jenis: '',
      tanggalAwal: '',
      tanggalAkhir: '',
      awaitingSearch: false,
      penjualan: [],
      total: '',
      diskon: '',
      grandTotal: '',
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
      salesChartData: [],
      salesChartOptions: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Penjualan Teratas'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: 'Produk',
          colorByPoint: true,
          data: []
        }]
      },      
    }
  },
  methods: {
    async fetchData(props) {
      try {
        this.isLoading = true

        const params = {
          type: props.jenis,
          start: dayjs(props.tanggal_awal).format("YYYY/MM/DD"),
          end: dayjs(props.tanggal_akhir).format("YYYY/MM/DD"),
          sort_field: 'tanggal',
          sort_option: 'ASC'
        }        
        const response = await penjualanServices.fetchData(params)
        if (response.data.status === 'success') {
          this.isLoading =false

          this.penjualan = []
          const records = response.data.data

          if (this.jenis == 'grafik') {
            this.salesChartData = []
            records.forEach(element => {
              this.salesChartData.push({
                name: element.nama_barang,
                y: parseFloat(element.qty)
              })
            })

            this.penjualan = records
            this.salesChartOptions.series[0].data = this.salesChartData   
            // console.log(JSON.stringify(this.salesChartOptions.series))
          } else {
            records.forEach(element => {
              this.penjualan.push(element)
              if (this.jenis == 'rekapitulasi') {
                this.total = parseFloat(this.unformatNumber(this.toFixed(this.total, 0))) + parseFloat(this.unformatNumber(this.toFixed(element.total, 0)))
                this.diskon = parseFloat(this.unformatNumber(this.toFixed(this.diskon, 0))) + parseFloat(this.unformatNumber(this.toFixed(element.diskon, 0)))
                this.grandTotal = parseFloat(this.unformatNumber(this.toFixed(this.grandTotal, 0))) + parseFloat(this.unformatNumber(this.toFixed(element.grand_total, 0)))              
              }
            })            
          }
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
      this.jenis = props.jenis
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