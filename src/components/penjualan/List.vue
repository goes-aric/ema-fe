<template>
  <div>
    <div class="breadcrumb flex justify-between">
      <div class="w-full md:w-1/2 flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">DATA PENJUALAN</h1>
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
              <th scope="col" class="text-left">No Transaksi</th>
              <th scope="col" class="text-left">Tanggal</th>
              <th scope="col" class="text-center">Total</th>
              <th scope="col" class="text-center">Diskon</th>
              <th scope="col" class="text-center">Grand Total</th>
              <th scope="col" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="penjualan.length == 0"><td class="text-center" colspan="6">Tidak ada data yang dapat ditampilkan</td></tr>
            <tr v-else-if="totalFiltered == 0"><td class="text-center" colspan="6">Tidak ada catatan yang cocok ditemukan</td></tr>
            <tr v-for="(item, index) in penjualan" :key="item.id">
              <td class="text-left">{{ item.no_transaksi }}</td>
              <td class="text-left">{{ item.tanggal }}</td>
              <td class="text-right">{{ formatNumber(toFixed(item.total, 0)) }}</td>
              <td class="text-right">{{ formatNumber(toFixed(item.diskon, 0)) }}</td>
              <td class="text-right">{{ formatNumber(toFixed(item.grand_total, 0)) }}</td>
              <td class="text-center">
                <div class="flex item-center justify-center">
                  <button @click="toggleShow( item.id )" type="button" class="btn-show" alt="Detail" title="Detail">
                    <IconShow />
                  </button>                  
                  <button @click="toggleEdit( item.id )" type="button" class="btn-edit" alt="Edit" title="Edit" :disabled="item.sumber">
                    <IconEdit />
                  </button>
                  <button @click="confirmDialog( item.id )" type="button" class="btn-delete" alt="Hapus" title="Hapus" :disabled="item.sumber">
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
    <modal :show="showModal" @close="showModal = false" addClass="modal-xl" modalOrientation="py-20 lg:py-6">
      <template v-slot:header><h3>{{ modalTitle }}</h3></template>
      <template v-slot:body>
        <Form id="modalForm" @submit="saveConfirmDialog()">
          <div class="md:flex w-full gap-12 mb-2">
            <div class="w-full md:w-2/5 mb-4">
              <div class="flex w-full gap-2">
                <div class="w-full md:w-2/5 mb-2">
                  <label for="no_transaksi" class="label-control md:py-3">No Transaksi <span class="text-red-600">*</span></label>
                </div>
                <div class="w-full md:w-3/5 mb-2">
                  <Field id="no_transaksi" name="no_transaksi" v-model="noTransaksi" label="No Transaksi" type="text" rules="" class="form-control" disabled />
                  <ErrorMessage name="no_transaksi" class="capitalize text-sm text-red-600" />
                  <div v-if="error.no_transaksi" class="capitalize text-sm text-red-600"><span>{{ error.no_transaksi[0] }}</span></div>
                </div>
              </div>
              <div class="flex w-full gap-2">
                <div class="w-full md:w-2/5 mb-2">
                  <label for="tanggal" class="label-control md:py-3">Tanggal <span class="text-red-600">*</span></label>
                </div>
                <div class="w-full md:w-3/5 mb-2">
                  <template v-if="isShow">
                    <div class="md:flex gap-6">
                      <div class="w-full">
                        <div class="relative flex justify-between items-center">
                          <input id="tanggal" type="text" class="form-control" :value="tanggal" readonly>
                          <span class="h-full absolute pointer-events-none right-0">
                            <IconDateRange class="m-3" />
                          </span>                      
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <v-date-picker v-model="tanggal" mode="date" :masks="masks" color="purple" title-position="left" :attributes="attrs">
                      <template v-slot="{ inputValue, inputEvents }">
                        <div class="md:flex gap-6">
                          <div class="w-full">
                            <div class="relative flex justify-between items-center">
                              <input id="tanggal" type="text" class="form-control" :value="inputValue" v-on="inputEvents" readonly>
                              <span class="h-full absolute pointer-events-none right-0">
                                <IconDateRange class="m-3" />
                              </span>                      
                            </div>
                            <div v-if="error.tanggal" class="capitalize text-sm text-red-600"><span>{{ error.tanggal[0] }}</span></div>
                          </div>
                        </div>
                      </template>
                    </v-date-picker>
                  </template>
                </div>                
              </div>
            </div>
            <div class="w-full md:w-3/5 mb-4">
              <!-- <div class="flex w-full gap-2">
                <div class="w-full md:w-1/4 mb-2">
                  <label for="gambar" class="label-control md:py-3">Bukti Transaksi<span class="text-red-600">*</span></label>
                </div>
                <div class="w-full md:w-3/4 mb-2">
                  <div class="h-32 border border-dashed border-gray-400 items-center justify-center p-1 rounded-sm mb-2">
                    <img class="h-full" :src="image" />
                  </div>
                  <input v-if="!isShow" id="gambar" name="gambar" type="file" ref="gambar" @change="onFileChange" rules="image|ext:jpg,png" label="Gambar" />
                  <ErrorMessage name="gambar" class="capitalize text-sm text-red-600" />
                  <div v-if="error.gambar" class="capitalize text-sm text-red-600"><span>{{ error.gambar[0] }}</span></div>
                </div>                
              </div> -->
            </div>
          </div>
          <div class="w-full mb-4">
            <div class="flex gap-2" v-if="!isShow">
              <div class="w-full md:w-7/12 mb-2">
                <label for="barang" class="label-control">Barang <span class="text-red-600">*</span></label>
                <VueMultiselect id="barang" name="barang" ref="barang" v-model="barang" :options="barangOptions" :showLabels="false" label="nama_barang" track-by="id" :custom-label="nameWithId" placeholder="Pilih Barang">
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
                <ErrorMessage name="barang" class="capitalize text-sm text-red-600" />
                <div v-if="error.barang" class="capitalize text-sm text-red-600"><span>{{ error.barang[0] }}</span></div>
              </div>
              <div class="w-2/5 md:w-2/12 mb-2">
                <label for="satuan" class="label-control">Satuan<span class="text-red-600">*</span></label>
                <Field id="satuan" name="satuan" v-model.lazy="satuan" label="Satuan" type="text" rules="" class="form-control" readonly />
                <ErrorMessage name="satuan" class="capitalize text-sm text-red-600" />
                <div v-if="error.satuan" class="capitalize text-sm text-red-600"><span>{{ error.satuan[0] }}</span></div>
              </div>              
              <div class="w-2/5 md:w-2/12 mb-2">
                <label for="harga" class="label-control">Harga<span class="text-red-600">*</span></label>
                <Field id="harga" name="harga" ref="harga" v-model.lazy="harga" v-number="number" label="Harga" type="text" rules="" @keyup="calculateTotal()" class="form-control text-right" readonly />
                <ErrorMessage name="harga" class="capitalize text-sm text-red-600" />
                <div v-if="error.harga" class="capitalize text-sm text-red-600"><span>{{ error.harga[0] }}</span></div>
              </div>
              <div class="w-2/5 md:w-2/12 mb-2">
                <label for="qty" class="label-control">Qty <span class="text-red-600">*</span></label>
                <Field id="qty" name="qty" ref="qty" v-model.lazy="qty" v-number="number" label="Qty" type="text" rules="" @keyup="calculateTotal()" class="form-control text-right" />
                <ErrorMessage name="qty" class="capitalize text-sm text-red-600" />
                <div v-if="error.qty" class="capitalize text-sm text-red-600"><span>{{ error.qty[0] }}</span></div>                
              </div>
              <div class="w-2/5 md:w-2/12 mb-2">
                <label for="total" class="label-control">Total <span class="text-red-600">*</span></label>
                <Field id="total" name="total" v-model.lazy="total" v-number="number" label="Total" type="text" rules="" class="form-control text-right" readonly />
                <ErrorMessage name="total" class="capitalize text-sm text-red-600" />
                <div v-if="error.total" class="capitalize text-sm text-red-600"><span>{{ error.total[0] }}</span></div>                
              </div>              
              <div class="w-1/5 md:w-1/12 mb-2">
                <button type="button" class="btn btn--success mt-6 flex" @click="addDetail()">
                  <IconPlus />
                </button>
              </div>
            </div>            
            <table class="min-w-max w-full table-auto mb-4">
              <thead>
                <tr>
                  <th scope="col" class="text-left">Kode</th>
                  <th scope="col" class="text-left">Nama Barang</th>
                  <th scope="col" class="text-center">Satuan</th>
                  <th scope="col" class="text-center">Harga</th>
                  <th scope="col" class="text-center">Qty</th>
                  <th scope="col" class="text-center">Total</th>
                  <th scope="col" class="px-3 text-center" v-if="!isShow">Aksi</th>
                </tr>                                                         
              </thead>
              <tbody class="text-gray-600 font-light">
                <tr v-if="transaksiDetail.length == 0" class="border-b"><td class="py-3 px-6 text-sm text-center" colspan="7">Tidak ada data yang dapat ditampilkan</td></tr>
                <tr v-for="(item, index) in transaksiDetail" :key="index" class="border-b">
                  <td class="text-left">{{ item.kode_barang }}</td>
                  <td class="text-left">{{ item.nama_barang }}</td>
                  <td class="text-left">{{ item.satuan }}</td>
                  <td class="text-right">{{ formatNumber(toFixed(item.harga, 0)) }}</td>
                  <td class="text-right">{{ formatNumber(toFixed(item.qty, 0)) }}</td>
                  <td class="text-right">{{ formatNumber(toFixed(item.total, 0)) }}</td>
                  <td class="px-3 text-center" v-if="!isShow">
                    <div class="flex item-center justify-center">
                      <button @click="removeDetail( index )" type="button" class="btn-delete" alt="Hapus">
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="flex gap-32">
              <div class="w-1/2 md:w-1/2 mb-4">
                <label for="catatan" class="label-control">Catatan<span class="text-red-600">*</span></label>
                <Field id="catatan" name="catatan" v-model="catatan" label="Catatan" as="textarea" rows="4" rules="" class="form-control" />
                <ErrorMessage name="catatan" class="capitalize text-sm text-red-600" />
                <div v-if="error.catatan" class="capitalize text-sm text-red-600"><span>{{ error.catatan[0] }}</span></div>                
              </div>
              <div class="w-1/2 md:w-1/2 mb-4">
                <div class="flex w-full gap-2">
                  <div class="w-full md:w-2/5 mb-1">
                    <label for="ssub_total" class="label-control md:py-3">Sub Total <span class="text-red-600">*</span></label>
                  </div>
                  <div class="w-full md:w-3/5 mb-1">
                    <Field id="ssub_total" name="ssub_total" v-model="subTotal" label="Sub Total" type="text" rules="" class="form-control text-right" disabled />
                    <ErrorMessage name="ssub_total" class="capitalize text-sm text-red-600" />
                    <div v-if="error.ssub_total" class="capitalize text-sm text-red-600"><span>{{ error.ssub_total[0] }}</span></div>
                  </div>
                </div>
                <div class="flex w-full gap-2">
                  <div class="w-full md:w-2/5 mb-1">
                    <label for="diskon" class="label-control md:py-3">Diskon <span class="text-red-600">*</span></label>
                  </div>
                  <div class="w-full md:w-3/5 mb-1">
                    <Field id="diskon" name="diskon" v-model.lazy="diskon" v-number="number" label="Diskon" type="text" rules="" @keyup="calculateGrandTotal()" class="form-control text-right" />
                    <ErrorMessage name="diskon" class="capitalize text-sm text-red-600" />
                    <div v-if="error.diskon" class="capitalize text-sm text-red-600"><span>{{ error.diskon[0] }}</span></div>
                  </div>
                </div>
                <div class="flex w-full gap-2">
                  <div class="w-full md:w-2/5 mb-1">
                    <label for="grand_total" class="label-control md:py-3">Grand Total <span class="text-red-600">*</span></label>
                  </div>
                  <div class="w-full md:w-3/5 mb-1">
                    <Field id="grand_total" name="grand_total" v-model="grandTotal" label="Grand Total" type="text" rules="" class="form-control text-right" disabled />
                    <ErrorMessage name="grand_total" class="capitalize text-sm text-red-600" />
                    <div v-if="error.grand_total" class="capitalize text-sm text-red-600"><span>{{ error.grand_total[0] }}</span></div>
                  </div>
                </div>                                
              </div>              
            </div>
          </div>
        </Form>     
      </template>
      <template v-slot:footer>
        <button v-if="!isShow" :disabled="isLoading" type="submit" form="modalForm" class="btn btn--success" alt="Simpan" title="Simpan">
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
import barangServices from '@/services/barang/barangServices'
import penjualanServices from '@/services/penjualan/penjualanServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconShow from '../icons/IconShow.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'

export default {
  name: 'HalamanPenjualan',
  components: {
    Field,
    Form,
    ErrorMessage,    
    IconPlus,
    IconTrash,
    IconEdit,
    IconShow,
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
        { field: 'no_transaksi', name: 'No Transaksi' },
        { field: 'tanggal', name: 'Tanggal' },
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
      penjualan: [],
      error: [],
      modalTitle: '',     
      showModal: false,      
      isEdit: false,
      isShow: false,
      penjualanId: '',
      noTransaksi: '',
      tanggal: '',
      image: '',
      penjualanImage: '',
      barang: '',
      barangOptions: [],
      satuan: '',
      harga: '',
      qty: '',
      total: '',
      subTotal: 0,
      diskon: 0,
      grandTotal: 0,
      catatan: '',
      transaksiDetail: [],
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
    async fetchBarangOptions() {
      try {
        const response = await barangServices.fetchDataOptions(null)
        if (response.data.status === 'success') {
          const records = response.data.data
          this.barangOptions = []
          records.forEach(element => {
            this.barangOptions.push({
              'id': element.id,
              'kode_barang': element.kode_barang,
              'nama_barang': element.nama_barang,
              'satuan': element.satuan,
              'harga_jual': element.harga_jual,              
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
    async fetchInvoiceNumber(){
      try {
        this.isLoading = true
        const response = await penjualanServices.fetchInvoiceNumber()
        if (response.data.status === 'success') {
          this.isLoading = false
          this.noTransaksi = response.data.data
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
        const response = await penjualanServices.fetchLimit(params)
        if (response.data.status === 'success') {
          this.isLoading =false

          const records = response.data.data
          this.totalRecords = records.total
          this.totalFiltered = records.total_filter
          this.fromRecord = records.from
          this.toRecord = records.to
          this.currentPage = records.current_page
          this.lastPage = records.last_page
          this.penjualan = records.data
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
        const response = await penjualanServices.delete(id)
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
        const response = await penjualanServices.fetchById(id)
        if (response.data.status === 'success') {
          this.isLoading = false
          this.record = response.data.data

          this.noTransaksi = this.record.no_transaksi
          this.tanggal = this.record.tanggal
          this.image = this.record.gambar
          this.subTotal = this.formatNumber(this.record.total)
          this.diskon = this.formatNumber(this.record.diskon)
          this.grandTotal = this.formatNumber(this.record.grand_total)          
          this.catatan = this.record.catatan

          this.record.details.forEach(element => {
            this.transaksiDetail.push({
              id_barang: element.id_barang,
              kode_barang: element.kode_barang,
              nama_barang: element.nama_barang,
              satuan: element.satuan,
              harga: element.harga,
              qty: element.qty,
              total: element.total,
            })
          })
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
        payload.append('no_transaksi', this.noTransaksi)
        payload.append('tanggal', dayjs(this.tanggal).format('YYYY/MM/DD'))
        payload.append('total', this.unformatNumber(this.subTotal))
        payload.append('diskon', this.unformatNumber(this.diskon))
        payload.append('grand_total', this.unformatNumber(this.grandTotal))
        payload.append('catatan', this.catatan)
        payload.append('gambar', this.penjualanImage)
        payload.append('details', JSON.stringify(this.transaksiDetail))

        let response = ''
        if (this.isEdit) {
          payload.append('_method', 'PUT')
          response = await penjualanServices.update(this.penjualanId, payload)
        } else {
          response = await penjualanServices.create(payload)
        }
        
        if (response.data.status === 'success') {
          /* SET IS EDIT STATE TO FALSE */
          this.isEdit = false
          this.penjualanId = ''

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
          if (responseReturn.no_transaksi || responseReturn.tanggal || responseReturn.catatan || responseReturn.gambar) {
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
      this.noTransaksi = ''
      this.tanggal = new Date()
      this.transaksiDetail = []
      this.subTotal = 0
      this.diskon = 0
      this.grandTotal = 0
      this.image = ''
      this.catatan = ''
    },
    clearForm(){
      this.barang = ''
      this.satuan = ''
      this.harga = ''
      this.qty = ''
      this.total = ''
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
    nameWithId ({ nama_barang, kode_barang }) {
      return `${kode_barang} — ${nama_barang}`
    },
    nameWithAddress ({ nama_supplier, alamat }) {
      return `${nama_supplier} - ${alamat}`
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
      this.isShow = false
      this.isEdit = false
      this.error = []
      this.showModal = true
      this.modalTitle = 'Tambah Penjualan'
      this.clearHeader()
      this.clearForm()
      this.fetchInvoiceNumber()
    },
    toggleEdit(id) {
      this.isShow = false
      this.isEdit = true
      this.error = []
      this.showModal = true
      this.modalTitle = 'Edit Penjualan'
      this.clearHeader()    
      this.clearForm()
      this.penjualanId = id
      this.fetchDataById(id)
    },
    toggleShow(id) {
      this.isShow = true
      this.isEdit = false
      this.error = []
      this.showModal = true
      this.modalTitle = 'Detail Penjualan'
      this.clearHeader()    
      this.clearForm()
      this.penjualanId = id
      this.fetchDataById(id)
    },    
    addDetail() {
      if (this.barang && this.harga && this.qty) {
        const find = this.transaksiDetail.filter(data => data.kode_barang == this.barang.kode_barang)
        const index = this.transaksiDetail.findIndex(data => data.kode_barang == this.barang.kode_barang)
        if (find.length == 0) {
          this.transaksiDetail.push({
            id_barang: this.barang.id,
            kode_barang: this.barang.kode_barang,
            nama_barang: this.barang.nama_barang,
            satuan: this.barang.satuan,
            harga: this.unformatNumber(this.harga),
            qty: this.unformatNumber(this.qty),
            total: this.unformatNumber(this.total)
          })

          /* TOTAL */
          let tempTotal = this.total ? parseFloat(this.unformatNumber(this.total)) : 0
          let subTotal = this.subTotal ? parseFloat(this.unformatNumber(this.subTotal)) : 0
          let tempSubTotal = tempTotal + subTotal
          this.subTotal = this.formatNumber(this.toFixed(tempSubTotal, 0))

          /* GRAND TOTAL */
          let tempDiskon = this.diskon ? parseFloat(this.unformatNumber(this.diskon)) : 0
          let tempGrandTotal = tempSubTotal + tempDiskon
          this.grandTotal = this.formatNumber(this.toFixed(tempGrandTotal, 0))          

          this.clearForm()
        } else {
          const price = this.unformatNumber(this.transaksiDetail[index].harga)
          const qty = this.unformatNumber(this.transaksiDetail[index].qty)
          const addQty = this.unformatNumber(this.qty)
          const newQty = parseFloat(qty) + parseFloat(addQty)
          const newTotal = parseFloat(price) * parseFloat(newQty)

          this.transaksiDetail[index].qty = newQty
          this.transaksiDetail[index].total = newTotal

          /* TOTAL */
          let tempTotal = this.total ? parseFloat(this.unformatNumber(this.total)) : 0
          let subTotal = this.subTotal ? parseFloat(this.unformatNumber(this.subTotal)) : 0
          let tempSubTotal = tempTotal + subTotal
          this.subTotal = this.formatNumber(this.toFixed(tempSubTotal, 0))

          /* GRAND TOTAL */
          let tempDiskon = this.diskon ? parseFloat(this.unformatNumber(this.diskon)) : 0
          let tempGrandTotal = tempSubTotal + tempDiskon
          this.grandTotal = this.formatNumber(this.toFixed(tempGrandTotal, 0))

          this.clearForm()
        }
      } else {
        this.toast.error('Silakan lengkapi masukan data terlebih dahulu!')
      }
    },
    removeDetail(index) {
      let item = this.transaksiDetail[index]
      this.subTotal = this.unformatNumber(this.subTotal) - item.total
      this.grandTotal = this.unformatNumber(this.grandTotal) - item.total

      this.transaksiDetail.splice(index, 1)
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
      this.penjualanImage = this.$refs.gambar.files[0]
    },
    removeImage() {
      this.image = ''
    },
    calculateTotal() {
      const harga = this.unformatNumber(this.harga)
      const qty = this.unformatNumber(this.qty)
      const total = harga * qty

      this.total = this.formatNumber(this.toFixed(total, 0))
    },
    calculateGrandTotal() {
      const subTotal = this.unformatNumber(this.subTotal)
      const diskon = this.unformatNumber(this.diskon)
      const grandTotal = subTotal - diskon

      this.grandTotal = this.formatNumber(this.toFixed(grandTotal, 0))
    }
  },
  created() {
    this.fetchData()
    this.fetchBarangOptions()
    document.addEventListener("keydown", this.searchFocus);
  },
  unmounted() {
    document.removeEventListener("keydown", this.searchFocus);
  },
  watch: {
    barang: function() {
      this.satuan = this.barang ? this.barang.satuan : ''
      this.harga = this.barang ? this.barang.harga_jual : ''
      this.$refs.qty.$el.focus()
    },
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
          this.sortField = { field: 'tanggal', name: 'Tanggal Transaksi' }
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