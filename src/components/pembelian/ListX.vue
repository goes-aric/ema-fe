<template>
  <div>
    <div class="breadcrumb flex justify-between">
      <div class="w-full md:w-1/2 flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">DATA PEMBELIAN</h1>
      </div>
      <div class="flex items-center right-0 gap-2">
        <button type="button" class="btn btn--success flex" @click="toggleNew()">
          <IconPlus />
          <span class="ml-2 md:block hidden">Tambah</span>
        </button>
      </div>
    </div>
    <!-- FORM SECTION -->
    <div class="p-6 rounded-sm bg-white shadow-lg transition duration-150 ease-in">   
      <!-- TABLE FILTER SECTION -->
      <div class="flex pb-4 justify-between items-center">
        <div class="relative">
          <select v-model="take" @change="updateTake()" class="select-form-control">
            <option v-for="show in shows" :key="show" :value="show" :selected="show === take ? 'selected' : ''">{{ show }}</option>
          </select>          
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M16.59 8.29504L12 12.875L7.41 8.29504L6 9.70504L12 15.705L18 9.70504L16.59 8.29504Z" />
            </svg>
          </div>
        </div>
        <div class="flex w-96">
          <div class="relative flex-1">
            <svg width="20" height="20" fill="currentColor" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"></path></svg>
            <input type="text" ref="search" v-model="search" @input="runSearch()" aria-label="Search" placeholder="Pencarian ( Tekan &quot;/&quot; untuk fokus )" class="search-form-control">
          </div>        
        </div>
      </div>      
      <!-- TABLE SECTION -->
      <div class="bg-white rounded-sm overflow-y-auto">
        <table>
          <thead>
            <tr>
              <th scope="col" class="text-left">Kode Beli</th>
              <th scope="col" class="text-left">Tanggal</th>
              <th scope="col" class="text-left">Metode Bayar</th>
              <th scope="col" class="text-left">Uraian</th>
              <th scope="col" class="text-left">Nominal</th>
              <th scope="col" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pembelian.length == 0"><td class="text-center" colspan="6">Tidak ada data yang dapat ditampilkan</td></tr>
            <tr v-else-if="totalFiltered == 0"><td class="text-center" colspan="6">Tidak ada catatan yang cocok ditemukan</td></tr>
            <tr v-for="(item, index) in pembelian" :key="item.id">
              <td class="text-left">{{ item.kode_beli }}</td>
              <td class="text-left">{{ item.tanggal }}</td>
              <td class="text-left">{{ item.metode_bayar }}</td>
              <td class="text-left">{{ item.uraian }}</td>
              <td class="text-right">{{ formatNumber(toFixed(item.nominal, 0)) }}</td>
              <td class="text-center">
                <div class="flex item-center justify-center">
                  <button @click="toggleEdit( item.id )" type="button" class="btn-edit" alt="Edit" title="Edit">
                    <IconEdit />
                  </button>                  
                  <button @click="confirmDialog( item.id )" type="button" class="btn-delete" alt="Hapus" title="Hapus">
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>         
          </tbody>                              
        </table>
        <div class="flex py-4 bg-white justify-between items-center">
          <div class="flex-shrink text-sm hidden md:block">
            <span>Menampilkan {{ fromRecord }} sampai {{ toRecord }} dari {{ totalFiltered }} Entri </span><span v-if="totalFiltered !== totalRecords"> ( difilter dari {{ totalRecords }} total entri )</span>
          </div>
          <div class="pagination">
            <button type="button" :disabled="(currentPage - 1) === 0" @click="prevPage" class="page-item">
              <span class="capitalize text-sm">Sebelumnya</span>
            </button>
            <button type="button" :disabled="currentPage === lastPage || currentPage > lastPage" @click="nextPage" class="page-item">
              <span class="capitalize text-sm">Berikutnya</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Dialog -->
    <modal :show="showModal" @close="showModal = false" addClass="modal-md" modalOrientation="pt-20 lg:pt-6">
      <template v-slot:header><h3>{{ modalTitle }}</h3></template>
      <template v-slot:body>
        <Form id="modalForm" @submit="saveConfirmDialog()">
          <div class="flex w-full mb-2 gap-2">
            <div class="md:w-2/5">
              <label for="kode_beli" class="label-control md:py-3">Kode Beli <span class="text-red-600">*</span></label>
            </div>
            <div class="flex md:w-3/5">
              <div class="w-1/2">
                <Field id="kode_beli" name="kode_beli" v-model="kodeBeli" label="Kode Beli" type="text" rules="" class="form-control" disabled />
                <ErrorMessage name="kode_beli" class="capitalize text-sm text-red-600" />
                <div v-if="error.kode_beli" class="capitalize text-sm text-red-600"><span>{{ error.kode_beli[0] }}</span></div>                  
              </div>
              <div class="w-1/2"></div>
            </div>
          </div>
          <div class="flex w-full mb-2 gap-2">
            <div class="md:w-2/5">
              <label for="tanggal" class="label-control md:py-3">Tanggal <span class="text-red-600">*</span></label>
            </div>
            <div class="flex md:w-3/5">
              <div class="w-1/2">
                <v-date-picker v-model="tanggal" mode="date" :masks="masks" color="purple" title-position="left" :attributes="attrs">
                  <template v-slot="{ inputValue, inputEvents }">
                    <div class="md:flex gap-6">
                      <div class="w-full">
                        <div class="relative flex justify-between items-center">
                          <input id="tanggal" type="text" class="form-control" :value="inputValue" v-on="inputEvents">
                          <span class="h-full absolute pointer-events-none right-0">
                            <IconDateRange class="m-3" />
                          </span>                      
                        </div>
                        <div v-if="error.tanggal" class="capitalize text-sm text-red-600"><span>{{ error.tanggal[0] }}</span></div>
                      </div>
                    </div>
                  </template>
                </v-date-picker>                  
              </div>
              <div class="w-1/2"></div>
            </div>
          </div>
          <div class="flex w-full mb-2 gap-2">
            <div class="md:w-2/5">
              <label for="metode_bayar" class="label-control md:py-3">Metode Bayar <span class="text-red-600">*</span></label>
            </div>
            <div class="md:w-3/5">
              <VueMultiselect id="metode_bayar" name="metode_bayar" ref="metode_bayar" v-model="metodeBayar" :options="metodeBayarOptions" :showLabels="false" placeholder="Pilih Metode Bayar">
                <template v-slot:caret>
                  <div>
                    <div class="multiselect__select">
                      <span>
                        <svg class="text-gray-500 my-2 ml-1 w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M16.59 8.29504L12 12.875L7.41 8.29504L6 9.70504L12 15.705L18 9.70504L16.59 8.29504Z"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </template>
              </VueMultiselect>
              <ErrorMessage name="metode_bayar" class="capitalize text-sm text-red-600" />
              <div v-if="error.metode_bayar" class="capitalize text-sm text-red-600"><span>{{ error.metode_bayar[0] }}</span></div> 
            </div>
          </div>
          <div class="flex w-full mb-2 gap-2">
            <div class="md:w-2/5">
              <label for="nominal" class="label-control md:py-3">Nominal <span class="text-red-600">*</span></label>
            </div>
            <div class="flex md:w-3/5">
              <div class="w-1/2">
                <Field id="nominal" name="nominal" v-model.lazy="nominal" v-number="number" label="Nominal" type="text" rules="" class="form-control" />
                <ErrorMessage name="nominal" class="capitalize text-sm text-red-600" />
                <div v-if="error.nominal" class="capitalize text-sm text-red-600"><span>{{ error.nominal[0] }}</span></div>                  
              </div>
              <div class="w-1/2"></div>
            </div>
          </div>            
          <div class="flex w-full mb-2 gap-2">
            <div class="md:w-2/5">
              <label for="uraian" class="label-control md:py-3">Uraian <span class="text-red-600">*</span></label>
            </div>
            <div class="md:w-3/5">
              <Field id="uraian" name="uraian" v-model="uraian" label="Uraian" as="textarea" rules="required" rows="5" class="form-control" />
              <ErrorMessage name="uraian" class="capitalize text-sm text-red-600" />
              <div v-if="error.uraian" class="capitalize text-sm text-red-600"><span>{{ error.uraian[0] }}</span></div>
            </div>
          </div>
          <div class="flex w-full mb-2 gap-2">
            <div class="md:w-2/5">
              <label for="kode_akun_persediaan" class="label-control md:py-3">Akun Debet <span class="text-red-600">*</span></label>
            </div>
            <div class="md:w-3/5">
              <VueMultiselect id="kode_akun_persediaan" name="kode_akun_persediaan" ref="akunPersediaan" v-model="akunPersediaan" :options="akunOptions" :showLabels="false" label="nama_akun" track-by="kode_akun" :custom-label="nameWithId" placeholder="Pilih Akun">
                <template v-slot:caret>
                  <div>
                    <div class="multiselect__select">
                      <span>
                        <svg class="text-gray-500 my-2 ml-1 w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M16.59 8.29504L12 12.875L7.41 8.29504L6 9.70504L12 15.705L18 9.70504L16.59 8.29504Z"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </template>
              </VueMultiselect>
              <ErrorMessage name="kode_akun_persediaan" class="capitalize text-sm text-red-600" />
              <div v-if="error.kode_akun_persediaan" class="capitalize text-sm text-red-600"><span>{{ error.kode_akun_persediaan[0] }}</span></div> 
            </div>
          </div>
          <div class="flex w-full mb-2 gap-2">
            <div class="md:w-2/5">
              <label for="kode_akun_pembayaran" class="label-control md:py-3">Akun Kredit <span class="text-red-600">*</span></label>
            </div>
            <div class="md:w-3/5">
              <VueMultiselect id="kode_akun_pembayaran" name="kode_akun_pembayaran" ref="akunPembayaran" v-model="akunPembayaran" :options="akunOptions" :showLabels="false" label="nama_akun" track-by="kode_akun" :custom-label="nameWithId" placeholder="Pilih Akun">
                <template v-slot:caret>
                  <div>
                    <div class="multiselect__select">
                      <span>
                        <svg class="text-gray-500 my-2 ml-1 w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M16.59 8.29504L12 12.875L7.41 8.29504L6 9.70504L12 15.705L18 9.70504L16.59 8.29504Z"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </template>
              </VueMultiselect>
              <ErrorMessage name="kode_akun_pembayaran" class="capitalize text-sm text-red-600" />
              <div v-if="error.kode_akun_pembayaran" class="capitalize text-sm text-red-600"><span>{{ error.kode_akun_pembayaran[0] }}</span></div> 
            </div>
          </div>
          <div class="flex w-full mb-2 gap-2">
            <div class="md:w-2/5">
              <label for="gambar" class="label-control md:py-3">Bukti Transaksi <span class="text-red-600">*</span></label>
            </div>
            <div class="md:w-3/5">
              <div class="md:h-32 border border-dashed border-gray-400 flex items-center justify-center p-1 rounded-sm mb-2">
                <img class="h-full" :src="image" />
              </div>
              <input id="gambar" name="gambar" type="file" ref="gambar" @change="onFileChange" rules="image|ext:jpg,png" label="Gambar" />
              <ErrorMessage name="gambar" class="capitalize text-sm text-red-600" />
              <div v-if="error.gambar" class="capitalize text-sm text-red-600"><span>{{ error.gambar[0] }}</span></div>              
            </div>
          </div>
        </Form>     
      </template>
      <template v-slot:footer>
        <button :disabled="isLoading" type="submit" form="modalForm" class="btn btn--success" alt="Simpan" title="Simpan">
          Simpan
        </button>
      </template> 
    </modal>
  </div>
</template>

<script>
import format from '@/helpers/formatNumber'
import { Field, Form, ErrorMessage } from "vee-validate"
import { createToastInterface } from 'vue-toastification'
import _ from 'lodash'
import dayjs from 'dayjs'
import akunServices from '@/services/akun/akunServices'
import pembelianServices from '@/services/pembelian/pembelianServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'

export default {
  name: 'HalamanPembelian',
  components: {
    Field,
    Form,
    ErrorMessage,    
    IconPlus,
    IconTrash,
    IconEdit,
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
      take: 25,
      page: 1,
      search: null,
      dateField: { field: 'created_at', name: 'Tanggal Dibuat' },
      dateFields: [
        { field: 'created_at', name: 'Tanggal Dibuat' },
        { field: 'updated_at', name: 'Tanggal Diedit' }
      ],
      filterDate: {
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
      sortField: { field: 'id', name: 'ID (Bawaan)' },
      sortFields: [
        { field: 'tanggal', name: 'Tanggal' },
        { field: 'grand_total', name: 'Grand Total' },
        { field: 'updated_at', name: 'Diedit' },
        { field: 'id', name: 'ID (Bawaan)' }
      ],        
      sortOption: { field: 'asc', name: 'Ascending' },
      sortOptions: [
        { field: 'asc', name: 'Ascending' },
        { field: 'desc', name: 'Descending' }
      ],
      awaitingSearch: false,
      totalRecords: null,
      totalFiltered: null,
      fromRecord: null,
      toRecord: null,
      currentPage: null,
      lastPage: null,
      shows: ['25', '50', '100'],
      pembelian: [],
      error: [],
      modalTitle: '',     
      showModal: false,      
      isEdit: false,
      pembelianId: '',
      kodeBeli: '',
      tanggal: '',
      metodeBayar: '',
      metodeBayarOptions: ['TUNAI', 'KREDIT'],
      nominal: '',
      uraian: '',    
      akunPersediaan: '',
      akunPembayaran: '',
      akunOptions: [],
      image: '',
      pembelianImage: '',
      isLoading: false,
      number: {
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 2,
      },       
    }
  },
  methods: {
    async fetchAkunOptions() {
      try {
        const response = await akunServices.fetchDataOptions(null)
        if (response.data.status === 'success') {
          const records = response.data.data
          this.akunOptions = []
          records.forEach(element => {
            this.akunOptions.push({
              'kode_akun': element.kode_akun,
              'nama_akun': element.nama_akun,
            })
          })          
        } else {
          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)          
        }
      } catch (error) {
        console.log(error.message)
      }
    },    
    async fetchData() {
      try {
        this.isLoading = true

        const params = {
          take: this.take,
          page: this.page,
          search: this.search,
          date_field: this.dateField.field,
          start: this.filterDate.start || '',
          end: this.filterDate.end || '',
          sort_field: this.sortField.field,
          sort_option: this.sortOption.field
        }
        const response = await pembelianServices.fetchLimit(params)
        if (response.data.status === 'success') {
          this.isLoading =false

          const records = response.data.data
          this.totalRecords = records.total
          this.totalFiltered = records.total_filter
          this.fromRecord = records.from
          this.toRecord = records.to
          this.currentPage = records.current_page
          this.lastPage = records.last_page
          this.pembelian = records.data
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
    async delete(id) {
      try {
        const response = await pembelianServices.delete(id)
        return response.data
      } catch (error) {     
        return error
      }
    },
    async confirmDialog(id) {
      // console.log(id)
      this.$swal.fire({
        title: 'Anda yakin akan menghapusnya?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#4b5563',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          /* CALL DELETE FUNCTION */
          const result = this.delete(id)
          const response = await result

          if (response.status) {
            if (response.status === 'success') {
              /* REFRESH DATA */
              this.fetchData()

              this.$swal.fire({
                title: 'Dihapus!',
                text: "Catatan Anda telah dihapus",
                icon: 'success',
                showConfirmButton: false,
                timer: 3000            
              })              
            } else {
              this.$swal.fire({
                title: 'Gagal!',
                text: response.message,
                icon: 'error',
                showConfirmButton: false,
                timer: 3000            
              })              
            }
          } else {
            this.toast.error(response.message)
          }
        }
      })
    },
    async saveConfirmDialog() {
      this.$swal.fire({
        title: 'Konfirmasi Data',
        text: "Anda yakin data yang dimasukan sudah benar?",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#4b5563',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (this.unformatNumber(this.totalDebet) != this.unformatNumber(this.totalKredit)) {
            /* THROW ERROR MESSAGES */
            this.toast.error('Jumlah total Debet dan Kredit tidak sama, proses tidak dapat dilanjutkan!')
          } else {
            /* CALL CREATE FUNCTION */
            this.save()            
          }
        }
      })
    },
    async fetchDataById(id){
      try {
        this.isLoading = true
        const response = await pembelianServices.fetchById(id)
        if (response.data.status === 'success') {
          this.isLoading = false
          this.record = response.data.data

          this.kodeBeli = this.record.kode_beli
          this.tanggal = this.record.tanggal
          this.metodeBayar = this.record.metode_bayar
          this.uraian = this.record.uraian
          this.nominal = this.formatNumber(this.toFixed(this.record.nominal, 0))
          this.akunPersediaan = { kode_akun: this.record.kode_akun_persediaan, nama_akun: this.record.nama_akun_persediaan }
          this.akunPembayaran = { kode_akun: this.record.kode_akun_pembayaran, nama_akun: this.record.nama_akun_pembayaran }
          this.image = this.record.gambar
        } else {
          this.isLoading = false

          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)            
        }
      } catch (error) {
        this.isLoading = false
        console.log(error.message)
      }
    },     
    async save(){
      try {
        this.isLoading = true
        let payload = new FormData()
        payload.append('tanggal', dayjs(this.tanggal).format('YYYY/MM/DD'))
        payload.append('metode_bayar', this.metodeBayar)
        payload.append('nominal', this.unformatNumber(this.nominal))
        payload.append('uraian', this.uraian)
        payload.append('kode_akun_persediaan', this.akunPersediaan ? this.akunPersediaan.kode_akun : null)
        payload.append('kode_akun_pembayaran', this.akunPembayaran ? this.akunPembayaran.kode_akun : null)
        payload.append('gambar', this.pembelianImage)

        let response = ''
        if (this.isEdit) {
          payload.append('_method', 'PUT')
          response = await pembelianServices.update(this.pembelianId, payload)
        } else {
          response = await pembelianServices.create(payload)
        }
        
        if (response.data.status === 'success') {
          /* SET IS EDIT STATE TO FALSE */
          this.isEdit = false

          /* SET LOADING STATE IS FALSE */
          this.isLoading = false

          this.showModal = false

          /* EMPTY ERRORS VARIABLE */
          this.error = []
          
          /* SUCCESS MESSAGES */
          this.toast.success(response.data.message)

          /* RELOAD DATA */
          this.fetchData()
        } else {
          /* SET LOADING STATE IS FALSE */
          this.isLoading = false

          /* EMPTY ERRORS VARIABLE */
          this.error = []

          /* STORE RESPONSE MESSAGE TO A VARIABLE */
          let responseReturn = response.data.message

          /* IF RESPONSE HAS OBJECT, STORE RESPONSE TO ERRORS VARIABLE */
          if (responseReturn.tanggal || responseReturn.metode_bayar || responseReturn.nominal || responseReturn.uraian || responseReturn.kode_akun_pembayaran || responseReturn.kode_akun_persediaan) {
              this.error = response.data.message

          /* ELSE, THROW ERROR MESSAGES */
          } else {
            this.toast.error(response.data.message)
          }          
        }        
      } catch (error) {
        /* SET LOADING STATE IS FALSE */
        this.isLoading = false

        /* THROW ERROR MESSAGES */
        this.toast.error(error.message)        
      }
    },
    clearHeader(){
      this.kodeBeli = !this.isEdit ? 'OTOMATIS' : ''
      this.tanggal = new Date()
      this.metodeBayar = ''
      this.uraian = ''
      this.nominal = ''
      this.akunPersediaan = ''
      this.akunPembayaran = ''
      this.image = ''    
    },
    updateQueryString() {
      const search = this.search ? this.search.toLowerCase() : ''
      const start = this.filterDate.start ? new Date(this.filterDate.start).toISOString().slice(0,10) : ''
      const end = this.filterDate.end ? new Date(this.filterDate.end).toISOString().slice(0,10) : ''
      const page = this.page

      this.$router.replace({ 
        query: {
          take: this.take,
          page: page,
          search: search,
          date_field: this.dateField.field,
          start: start,
          end: end,
          sort_field: this.sortField.field,
          sort_option: this.sortOption.field
        } 
      }).catch(() => {})
    },
    searchFocus(event) {
      if (event.keyCode === 191) {
        setTimeout(() => {
          this.$refs.search.focus()
        }, 5)
      }
    },
    prevPage() {
      this.page = this.currentPage - 1
      this.updateQueryString()
      this.fetchData()
    },
    nextPage() {
      this.page = this.currentPage + 1
      this.updateQueryString()
      this.fetchData()
    },
    updateTake() {
      this.page = 1
      this.updateQueryString()
      this.fetchData()      
    },
    runSearch: _.debounce(function() {
      if (!this.awaitingSearch) {
        this.page = 1
        this.updateQueryString()
        this.fetchData()
        this.awaitingSearch = false
      }
    }, 1000),
    nameWithId ({ nama_akun, kode_akun }) {
      return `${kode_akun} ??? ${nama_akun}`
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
    toggleNew() {
      this.isEdit = false
      this.error = []
      this.showModal = true
      this.modalTitle = 'Tambah Pembelian'
      this.clearHeader()
    },
    toggleEdit(id) {
      this.isEdit = true
      this.error = []
      this.showModal = true
      this.modalTitle = 'Edit Pembelian'
      this.clearHeader()
      this.pembelianId = id
      this.fetchDataById(id)
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }

      this.createImage(files[0])
    },
    createImage(file) {
      let reader = new FileReader()
      let vm = this

      reader.onload = (e) => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
      this.pembelianImage = this.$refs.gambar.files[0]
    },
    removeImage() {
      this.image = ''
    },
  },
  created() {
    this.fetchData()
    this.fetchAkunOptions()
    document.addEventListener("keydown", this.searchFocus);
  },
  unmounted() {
    document.removeEventListener("keydown", this.searchFocus);
  },
  watch: {
    '$route.query.take': {
      handler: function(take) {
        if (take) {
          this.take = take
        }
      },
      immediate: true
    },    
    '$route.query.page': {
      handler: function(page) {
        this.page = page
      },
      immediate: true
    },
    '$route.query.search': {
      handler: function(search) {
        this.search = search
      },
      immediate: true
    },
    '$route.query.date_field': {
      handler: function(date_field) {
        try {
          const option = this.dateFields.filter(item => date_field.includes(item.field))
          this.dateField = { field: option[0].field, name: option[0].name }          
        } catch (error) {
          this.dateField = { field: 'created_at', name: 'Tanggal Dibuat' }        
        }
      },
      immediate: true
    },
    '$route.query.start': {
      handler: function(start) {
        if (this.filterDate) {
          this.filterDate.start = start
        } else {
          this.filterDate = {
            'start': start
          }          
        }
      },
      immediate: true
    },
    '$route.query.end': {
      handler: function(end) {
        if (this.filterDate) {
          this.filterDate.end = end
        } else {
          this.filterDate = {
            'end': end
          }          
        }
      },
      immediate: true
    },
    '$route.query.sort_field': {
      handler: function(sort_field) {
        try {
        const option = this.sortFields.filter(item => sort_field.includes(item.field))
        this.sortField = { field: option[0].field, name: option[0].name }          
        } catch (error) {
          this.sortField = { field: 'tanggal', name: 'Tanggal' }
        }
      },
      immediate: true
    },
    '$route.query.sort_option': {
      handler: function(sort_option) {
        try {
          const option = this.sortOptions.filter(item => sort_option.includes(item.field))
          this.sortOption = { field: option[0].field, name: option[0].name }          
        } catch (error) {
          this.sortOption = { field: 'asc', name: 'Ascending' }
        }
      },
      immediate: true
    }                   
  }
}
</script>