<template>
  <div>
    <!-- FORM SECTION -->
    <div class="p-6 rounded-sm bg-white shadow-lg transition duration-150 ease-in">
      <div class="mb-4 p-4 border border-gray-100 text-center">
        <img :src="LogoSource" class="h-16 mx-auto mb-4">
        <h3 class="text-xl">Selamat Datang</h3>
        <h1 class="text-xl">Sistem Informasi Keuangan Unit Bina Usaha</h1>
        <h1 class="text-xl">PERUMDA Pasar Mangu Giri Sedana</h1>
      </div>
      <div class="flex w-full gap-2">
        <div class="w-1/2">
          <div class="mb-4 p-4 border border-gray-100">
            <highcharts :options="chartPembelianOptions" ref="pembelianCharts"></highcharts>
          </div>        
          <div class="mb-4 p-4 border border-gray-100">
            <h3 class="block uppercase text-gray-600 mb-2">Pembelian</h3>
            <h1 class="block text-4xl text-gray-900 mb-2">Rp. {{ formatNumber(toFixed(totalPembelian, 0)) }}</h1>
            <span class="block text-gray-600 mb-2">Period Tahun {{ periodeTahun }}</span>
          </div>        
        </div>
        <div class="w-1/2">
          <div class="mb-4 p-4 border border-gray-100">
            <highcharts :options="chartPenjualanOptions" ref="penjualanCharts"></highcharts>
          </div>        
          <div class="mb-4 p-4 border border-gray-100">
            <h3 class="block uppercase text-gray-600 mb-2">Penjualan</h3>
            <h1 class="block text-4xl text-gray-900 mb-2">Rp. {{ formatNumber(toFixed(totalPenjualan, 0)) }}</h1>
            <span class="block text-gray-600 mb-2">Period Tahun {{ periodeTahun }}</span>
          </div>        
        </div>      
      </div>
    </div>
  </div>
</template>

<script>
import format from '@/helpers/formatNumber'
import { createToastInterface } from 'vue-toastification'
import {Chart} from 'highcharts-vue'
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import exportingData from 'highcharts/modules/export-data'
import pembelianServices from '@/services/pembelian/pembelianServices'
import penjualanServices from '@/services/penjualan/penjualanServices'
import Logo from '../../assets/images/logo.png'

exportingInit(Highcharts)
exportingData(Highcharts)

export default {
  name: 'DashboardPage',
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
  components: {
    Logo,
    highcharts: Chart,
  },  
  data() {
    return {
      LogoSource: Logo,
      totalPembelian: '',
      totalPenjualan: '',
      periodeTahun: '',
      chartPembelianData: [],
      chartPembelianOptions: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Grafik Pembelian'
        },
        subtitle: {
          text: 'Sumber: Data Pembelian Persediaan'
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nop', 'Des']
        },
        yAxis: {
          title: {
            text: 'Jumlah Pendapatan'
          },
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          useHTML: true,
          formatter: function () {
            return ['<h5><b>Bulan : ' + this.x + '</b></h5><br>'].concat(
              this.points ? this.points.map(function (point) {
                return '<span>Rp. ' + point.y + '</span><br>'              
              }) : []
            )
          }          
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y}'
            }
          }
        },      
        series: []      
      },
      chartPenjualanData: [],
      chartPenjualanOptions: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Grafik Penjualan'
        },
        subtitle: {
          text: 'Sumber: Data Penjualan'
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nop', 'Des']
        },
        yAxis: {
          title: {
            text: 'Jumlah Pendapatan'
          },
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          useHTML: true,
          formatter: function () {
            return ['<h5><b>Bulan : ' + this.x + '</b></h5><br>'].concat(
              this.points ? this.points.map(function (point) {
                return '<span>Rp. ' + point.y + '</span><br>'              
              }) : []
            )
          }          
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y}'
            }
          }
        },      
        series: []      
      },            
    }
  },
  methods: {
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
    async fetchPembelianData() {
      try {
        this.isLoading = true
        const response = await pembelianServices.charts()
        if (response.data.status === 'success') {
          this.isLoading =false

          /* EMPTY ERRORS VARIABLE */
          this.error = []        

          const records = response.data.data
          this.totalPembelian = 0

          this.chartPembelianData = []
          records.forEach(element => {
            let data = []
            element.data.forEach(item => {
              data.push({
                'y': parseFloat(item.amount)
              })

              this.totalPembelian += parseFloat(item.amount)
            })

            this.chartPembelianData.push({
              name: element.name,
              marker: {
                symbol: 'square'
              },
              data: data
            })
            this.periodeTahun = element.name
          })

          this.chartPembelianOptions.series = this.chartPembelianData
        } else {
          this.isLoading =false

          /* EMPTY ERRORS VARIABLE */
          this.error = []

          /* STORE RESPONSE MESSAGE TO A VARIABLE */
          let responseReturn = response.data.message

          /* ELSE, THROW ERROR MESSAGES */
          this.toast.error(responseReturn)
        }
      } catch (error) {
        this.isLoading =false
        console.log(error)
      }
    }, 
    async fetchPenjualanData() {
      try {
        this.isLoading = true
        const response = await penjualanServices.charts()
        if (response.data.status === 'success') {
          this.isLoading =false

          /* EMPTY ERRORS VARIABLE */
          this.error = []        

          const records = response.data.data
          this.totalPenjualan = 0

          this.chartPenjualanData = []
          records.forEach(element => {
            let data = []
            element.data.forEach(item => {
              data.push({
                'y': parseFloat(item.amount)
              })

              this.totalPenjualan += parseFloat(item.amount)
            })

            this.chartPenjualanData.push({
              name: element.name,
              marker: {
                symbol: 'square'
              },
              data: data
            })
            this.periodeTahun = element.name
          })

          this.chartPenjualanOptions.series = this.chartPenjualanData
        } else {
          this.isLoading =false

          /* EMPTY ERRORS VARIABLE */
          this.error = []

          /* STORE RESPONSE MESSAGE TO A VARIABLE */
          let responseReturn = response.data.message

          /* ELSE, THROW ERROR MESSAGES */
          this.toast.error(responseReturn)
        }
      } catch (error) {
        this.isLoading =false
        console.log(error)
      }
    },        
  },
  mounted() {
    this.fetchPembelianData()
    this.fetchPenjualanData()
  }
}
</script>