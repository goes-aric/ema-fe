<template>
  <div>
    <div class="breadcrumb flex justify-between">
      <div class="w-full md:w-1/2 flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">LAPORAN</h1>
      </div>
      <div class="flex items-center right-0 gap-2"></div>
    </div>
    <div class="flex w-full mb-4 gap-4">
      <div class="w-1/2 p-6 rounded-sm bg-white shadow-lg">
        <h1 class="text-center mb-2">Laporan Pembelian</h1>
        <div class="flex items-center gap-4">
          <v-date-picker ref="calendar" v-model="pembelianFilterDate" mode="date" :masks="masks" color="purple" title-position="left" :popover="{ visibility: 'click' }" :attributes="attrs" is-range>
            <template v-slot="{ inputValue, inputEvents, isDragging }">
              <div class="flex gap-2">
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="startDate" ref="startDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" autofocus readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>
                  </div>
                </div>
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="endDate" ref="endDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>                      
                  </div>
                </div>                  
              </div>
            </template>
          </v-date-picker>
          <div class="flex -mt-4 gap-2">
            <button type="button" class="btn btn--success" @click="toggleLaporanPembelian()">Tampilkan</button>
          </div>
        </div>
      </div>
      <div class="w-1/2 p-6 rounded-sm bg-white shadow-lg">   
        <h1 class="text-center mb-2">Laporan Penjualan</h1>
        <div class="flex items-center gap-4">
          <v-date-picker ref="calendar" v-model="penjualanFilterDate" mode="date" :masks="masks" color="purple" title-position="left" :popover="{ visibility: 'click' }" :attributes="attrs" is-range>
            <template v-slot="{ inputValue, inputEvents, isDragging }">
              <div class="flex gap-2">
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="startDate" ref="startDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" autofocus readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>
                  </div>
                </div>
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="endDate" ref="endDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>                      
                  </div>
                </div>                  
              </div>
            </template>
          </v-date-picker>
          <div class="flex -mt-4 gap-2">
            <button type="button" class="btn btn--success" @click="toggleLaporanPenjualan()">Tampilkan</button>
          </div>
        </div>
      </div>      
    </div>
    <div class="flex w-full mb-4 gap-4">
      <div class="w-1/2 p-6 rounded-sm bg-white shadow-lg">   
        <h1 class="text-center mb-2">Laporan Jurnal Umum</h1>
        <div class="flex items-center gap-4">
          <v-date-picker ref="calendar" v-model="jurnalFilterDate" mode="date" :masks="masks" color="purple" title-position="left" :popover="{ visibility: 'click' }" :attributes="attrs" is-range>
            <template v-slot="{ inputValue, inputEvents, isDragging }">
              <div class="flex gap-2">
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="startDate" ref="startDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" autofocus readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>
                  </div>
                </div>
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="endDate" ref="endDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>                      
                  </div>
                </div>                  
              </div>
            </template>
          </v-date-picker>
          <div class="flex -mt-4 gap-2">
            <button type="button" class="btn btn--success" @click="toggleLaporanJurnalUmum()">Tampilkan</button>
          </div>
        </div>
      </div>
      <div class="w-1/2 p-6 rounded-sm bg-white shadow-lg">
        <h1 class="text-center mb-2">Laporan Laba Rugi</h1>
        <div class="flex items-center gap-4">
          <v-date-picker ref="calendar" v-model="labaRugiFilterDate" mode="date" :masks="masks" color="purple" title-position="left" :popover="{ visibility: 'click' }" :attributes="attrs" is-range>
            <template v-slot="{ inputValue, inputEvents, isDragging }">
              <div class="flex gap-2">
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="startDate" ref="startDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" autofocus readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>
                  </div>
                </div>
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="endDate" ref="endDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>                      
                  </div>
                </div>                  
              </div>
            </template>
          </v-date-picker>
          <div class="flex -mt-4 gap-2">
            <button type="button" class="btn btn--success" @click="toggleLaporanLabaRugi()">Tampilkan</button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-full mb-4 gap-4">
      <div class="w-1/2 p-6 rounded-sm bg-white shadow-lg">
        <h1 class="text-center mb-2">Laporan Neraca</h1>
        <div class="flex items-center gap-4">
          <v-date-picker v-model="neracaFilterDate" mode="date" :masks="masks" color="purple" title-position="left" :attributes="attrs">
            <template v-slot="{ inputValue, inputEvents }">
              <div class="md:flex gap-6">
                <div class="w-full">
                  <div class="relative flex justify-between items-center">
                    <input id="endDate" type="text" class="form-control" :value="inputValue" v-on="inputEvents" readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>                      
                  </div>
                </div>
              </div>
            </template>
          </v-date-picker>
          <div class="flex gap-2">
            <button type="button" class="btn btn--success" @click="toggleLaporanNeraca()">Tampilkan</button>
          </div>
        </div>
      </div>
      <div class="w-1/2 p-6 rounded-sm bg-white shadow-lg">
        <h1 class="text-center mb-2">Laporan Arus Kas</h1>
        <div class="flex items-center gap-4">
          <v-date-picker ref="calendar" v-model="kasFilterDate" mode="date" :masks="masks" color="purple" title-position="left" :popover="{ visibility: 'click' }" :attributes="attrs" is-range>
            <template v-slot="{ inputValue, inputEvents, isDragging }">
              <div class="flex gap-2">
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="startDate" ref="startDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" autofocus readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>
                  </div>
                </div>
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="endDate" ref="endDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>                      
                  </div>
                </div>                  
              </div>
            </template>
          </v-date-picker>
          <div class="flex -mt-4 gap-2">
            <button type="button" class="btn btn--success" @click="toggleLaporanArusKas()">Tampilkan</button>
          </div>
        </div>
      </div>      
    </div> 
    <div class="flex w-full mb-4 gap-4">
      <div class="w-1/2 p-6 rounded-sm bg-white shadow-lg">
        <h1 class="text-center mb-2">Laporan Perubahan Modal</h1>
        <div class="flex items-center gap-4">
          <v-date-picker ref="calendar" v-model="modalFilterDate" mode="date" :masks="masks" color="purple" title-position="left" :popover="{ visibility: 'click' }" :attributes="attrs" is-range>
            <template v-slot="{ inputValue, inputEvents, isDragging }">
              <div class="flex gap-2">
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="startDate" ref="startDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" autofocus readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>
                  </div>
                </div>
                <div class="w-1/2 mb-4">
                  <div class="relative flex justify-between items-center">
                    <input id="endDate" ref="endDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" readonly>
                    <span class="h-full absolute pointer-events-none right-0">
                      <IconDateRange class="m-3" />
                    </span>                      
                  </div>
                </div>                  
              </div>
            </template>
          </v-date-picker>
          <div class="flex -mt-4 gap-2">
            <button type="button" class="btn btn--success" @click="toggleLaporanPerubahanModal()">Tampilkan</button>
          </div>
        </div>
      </div>
      <div class="w-1/2">
      </div>      
    </div>
    <LaporanPembelian ref="laporanPembelian" />
    <LaporanPenjualan ref="laporanPenjualan" />
    <LaporanJurnalUmum ref="laporanJurnalUmum" />
    <LaporanNeraca ref="laporanNeraca" />
    <LaporanLabaRugi ref="laporanLabaRugi" />
    <LaporanArusKas ref="LaporanArusKas" />
    <LaporanPerubahanModal ref="LaporanPerubahanModal" />
  </div>
</template>

<script>
import { createToastInterface } from 'vue-toastification'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'
import Logo from '../../assets/images/logo.png'
import LaporanPembelian from './LaporanPembelian.vue'
import LaporanPenjualan from './LaporanPenjualan.vue'
import LaporanJurnalUmum from './LaporanJurnalUmum.vue'
import LaporanNeraca from './LaporanNeraca.vue'
import LaporanLabaRugi from './LaporanLabaRugi.vue'
import LaporanArusKas from './LaporanArusKas.vue'
import LaporanPerubahanModal from './LaporanPerubahanModal.vue'

export default {
  name: 'RekapitulasiListPage',
  components: {
    IconDateRange,
    Modal,
    LaporanPembelian,
    LaporanPenjualan,
    LaporanJurnalUmum,
    LaporanNeraca,
    LaporanLabaRugi,
    LaporanArusKas,
    LaporanPerubahanModal
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
      pembelianFilterDate: {
        start: '',
        end: ''
      },
      penjualanFilterDate: {
        start: '',
        end: ''
      },
      jurnalFilterDate: {
        start: '',
        end: ''
      },
      neracaFilterDate: '',
      labaRugiFilterDate: {
        start: '',
        end: ''
      },
      kasFilterDate: {
        start: '',
        end: ''
      },
      modalFilterDate: {
        start: '',
        end: ''
      },                                 
      masks: {
        input: 'YYYY/MM/DD',
      },
      attrs: [
        {
          key: 'today',
          highlight: 'red',
          dates: new Date(),
        },
      ],
      awaitingSearch: false,
      error: [],
      isLoading: false,
      number: {
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 2,
      },
      LogoSource: Logo,
    }
  },
  methods: {
    toggleLaporanPembelian() {
      if (this.pembelianFilterDate.start == '' && this.pembelianFilterDate.end == '') {
          /* THROW ERROR MESSAGES */
          this.toast.error('Silakan masukan tanggal awal dan akhir laporan yang ingin ditampilkan!')         
      } else {
        const params = {
          tanggal_awal: this.pembelianFilterDate ? this.pembelianFilterDate.start : null,
          tanggal_akhir: this.pembelianFilterDate ? this.pembelianFilterDate.end : null,
        }
        this.$refs.laporanPembelian.toggleModal(params)
      }
    },
    toggleLaporanPenjualan() {
      if (this.penjualanFilterDate.start == '' && this.penjualanFilterDate.end == '') {
          /* THROW ERROR MESSAGES */
          this.toast.error('Silakan masukan tanggal awal dan akhir laporan yang ingin ditampilkan!')         
      } else {
        const params = {
          tanggal_awal: this.penjualanFilterDate ? this.penjualanFilterDate.start : null,
          tanggal_akhir: this.penjualanFilterDate ? this.penjualanFilterDate.end : null,
        }
        this.$refs.laporanPenjualan.toggleModal(params)
      }
    },
    toggleLaporanJurnalUmum() {
      if (this.jurnalFilterDate.start == '' && this.jurnalFilterDate.end == '') {
          /* THROW ERROR MESSAGES */
          this.toast.error('Silakan masukan tanggal awal dan akhir laporan yang ingin ditampilkan!')         
      } else {
        const params = {
          tanggal_awal: this.jurnalFilterDate ? this.jurnalFilterDate.start : null,
          tanggal_akhir: this.jurnalFilterDate ? this.jurnalFilterDate.end : null,
        }
        this.$refs.laporanJurnalUmum.toggleModal(params)
      }
    },
    toggleLaporanNeraca() {
      if (this.neracaFilterDate == '') {
          /* THROW ERROR MESSAGES */
          this.toast.error('Silakan masukan tanggal laporan yang ingin ditampilkan!')         
      } else {
        const params = {
          tanggal: this.neracaFilterDate ? this.neracaFilterDate : null,
        }
        this.$refs.laporanNeraca.toggleModal(params)
      }
    },
    toggleLaporanLabaRugi() {
      if (this.labaRugiFilterDate.start == '' && this.labaRugiFilterDate.end == '') {
          /* THROW ERROR MESSAGES */
          this.toast.error('Silakan masukan tanggal awal dan akhir laporan yang ingin ditampilkan!')         
      } else {
        const params = {
          tanggal_awal: this.labaRugiFilterDate ? this.labaRugiFilterDate.start : null,
          tanggal_akhir: this.labaRugiFilterDate ? this.labaRugiFilterDate.end : null,
        }
        this.$refs.laporanLabaRugi.toggleModal(params)
      }
    },
    toggleLaporanArusKas() {
      if (this.kasFilterDate.start == '' && this.kasFilterDate.end == '') {
          /* THROW ERROR MESSAGES */
          this.toast.error('Silakan masukan tanggal awal dan akhir laporan yang ingin ditampilkan!')         
      } else {
        const params = {
          tanggal_awal: this.kasFilterDate ? this.kasFilterDate.start : null,
          tanggal_akhir: this.kasFilterDate ? this.kasFilterDate.end : null,
        }
        this.$refs.LaporanArusKas.toggleModal(params)
      }
    },
    toggleLaporanPerubahanModal() {
      if (this.modalFilterDate.start == '' && this.modalFilterDate.end == '') {
          /* THROW ERROR MESSAGES */
          this.toast.error('Silakan masukan tanggal awal dan akhir laporan yang ingin ditampilkan!')         
      } else {
        const params = {
          tanggal_awal: this.modalFilterDate ? this.modalFilterDate.start : null,
          tanggal_akhir: this.modalFilterDate ? this.modalFilterDate.end : null,
        }
        this.$refs.LaporanPerubahanModal.toggleModal(params)
      }
    },                    
  },
}
</script>