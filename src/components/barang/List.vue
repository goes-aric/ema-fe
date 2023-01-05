<template>
  <div>
    <div class="breadcrumb flex justify-between">
      <div class="w-full md:w-1/2 flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">DATA BARANG</h1>
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
              <th scope="col" class="text-left">Kode Barang</th>
              <th scope="col" class="text-left">Nama Barang</th>
              <th scope="col" class="text-left">Satuan</th>
              <th scope="col" class="text-center">Harga Jual</th>
              <th scope="col" class="text-center">Status</th>
              <th scope="col" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="barang.length == 0"><td class="text-center" colspan="6">Tidak ada data yang dapat ditampilkan</td></tr>
            <tr v-else-if="totalFiltered == 0"><td class="text-center" colspan="6">Tidak ada catatan yang cocok ditemukan</td></tr>
            <tr v-for="(barang, index) in barang" :key="barang.id">
              <td class="text-left">{{ barang.kode_barang }}</td>
              <td class="text-left">{{ barang.nama_barang }}</td>
              <td class="text-left">{{ barang.satuan }}</td>
              <td class="text-right">{{ formatNumber(toFixed(barang.harga_jual, 0)) }}</td>
              <td class="text-center">
                <span class="badge " :class="barang.status ? 'badge--success' : 'badge--danger'">{{ barang.status_text }}</span>
              </td>
              <td class="text-center">
                <div class="flex item-center justify-center">
                  <button @click="toggleEdit( barang.id )" type="button" class="btn-edit" alt="Edit" title="Edit">
                    <IconEdit />
                  </button>                  
                  <button @click="confirmDialog( barang.id )" type="button" class="btn-delete" alt="Hapus" title="Hapus">
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
    <modal :show="showModal" @close="showModal = false" addClass="modal-sm" modalOrientation="pt-20 md:pt-6">
      <template v-slot:header><h3>{{ modalTitle }}</h3></template>
      <template v-slot:body>
        <Form id="modalForm" @submit="saveConfirmDialog()">
          <div class="flex gap-4">
            <div class="w-1/2 mb-4">
              <label for="kode_barang" class="label-control">Kode Barang <span class="text-red-600">*</span></label>
              <Field id="kode_barang" name="kode_barang" type="text" v-model="kodeBarang" label="Kode Barang" maxlength="255" rules="required" class="form-control" />
              <ErrorMessage name="kode_barang" class="capitalize text-sm text-red-600" />
              <div v-if="error.kode_barang" class="capitalize text-sm text-red-600"><span>{{ error.kode_barang[0] }}</span></div>
            </div>        
            <div class="w-1/2 mb-4"></div>            
          </div>
          <div class="w-full mb-4">
            <label for="nama_barang" class="label-control">Nama Barang <span class="text-red-600">*</span></label>
            <Field id="nama_barang" name="nama_barang" type="text" v-model="namaBarang" label="Nama Barang" maxlength="255" rules="required" class="form-control" />
            <ErrorMessage name="nama_barang" class="capitalize text-sm text-red-600" />
            <div v-if="error.nama_barang" class="capitalize text-sm text-red-600"><span>{{ error.nama_barang[0] }}</span></div>          
          </div>          
          <div class="flex gap-4">
            <div class="w-1/2 mb-4">
              <label for="satuan" class="label-control">Satuan <span class="text-red-600">*</span></label>
              <Field id="satuan" name="satuan" type="text" v-model="satuan" label="Satuan" maxlength="255" rules="" class="form-control" />
              <ErrorMessage name="satuan" class="capitalize text-sm text-red-600" />
              <div v-if="error.satuan" class="capitalize text-sm text-red-600"><span>{{ error.satuan[0] }}</span></div>
            </div>
            <div class="w-1/2 mb-4">
              <label for="harga_jual" class="label-control">Harga Jual <span class="text-red-600">*</span></label>
              <Field id="harga_jual" name="harga_jual" type="text" v-model.lazy="hargaJual" v-number="number" label="Harga Jual" maxlength="255" rules="" class="form-control text-right" />
              <ErrorMessage name="harga_jual" class="capitalize text-sm text-red-600" />
              <div v-if="error.harga_jual" class="capitalize text-sm text-red-600"><span>{{ error.harga_jual[0] }}</span></div>              
            </div>
          </div>          
          <div class="flex gap-4">
            <div class="w-1/2 mb-4">
              <label for="status" class="label-control">Status <span class="text-red-600">*</span></label>
              <VueMultiselect id="status" name="status" ref="status" v-model="status" track-by="id" label="name" :options="statusOptions" :showLabels="false" placeholder="Pilih Status">
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
              <ErrorMessage name="status" class="capitalize text-sm text-red-600" />
              <div v-if="error.status" class="capitalize text-sm text-red-600"><span>{{ error.status[0] }}</span></div>
            </div>
            <div class="w-1/2 mb-4"></div>            
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
import barangServices from '@/services/barang/barangServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import Modal from '../widgets/Modal.vue'

export default {
  name: 'HalamanBarang',
  components: {
    Field,
    Form,
    ErrorMessage,    
    IconPlus,
    IconTrash,
    IconEdit,
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
        { field: 'kode_barang', name: 'Kode Barang' },
        { field: 'nama_barang', name: 'Nama Barang' },
        { field: 'satuan', name: 'Satuan' },
        { field: 'harga_jual', name: 'Harga Jual' },
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
      barang: [],
      error: [],
      modalTitle: '',     
      showModal: false,      
      isEdit: false,
      barangId: '',
      kodeBarang: '',
      namaBarang: '',
      satuan: '',
      hargaJual: '',
      status: '',
      statusOptions: [
        { id: 1, name: 'AKTIF' },
        { id: 0, name: 'DISCONTINUE' }        
      ],
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
        const response = await barangServices.fetchLimit(params)
        if (response.data.status === 'success') {
          this.isLoading =false

          const records = response.data.data
          this.totalRecords = records.total
          this.totalFiltered = records.total_filter
          this.fromRecord = records.from
          this.toRecord = records.to
          this.currentPage = records.current_page
          this.lastPage = records.last_page
          this.barang = records.data
        } else {
          this.isLoading =false

          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)          
        }
      } catch (error) {
        this.isLoading = false
        console.log(error.message)
      }
    },
    async delete(id) {
      try {
        const response = await barangServices.delete(id)
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
          /* CALL CREATE FUNCTION */
          this.save()
        }
      })
    },
    async fetchDataById(id){
      try {
        this.isLoading = true
        const response = await barangServices.fetchById(id)
        if (response.data.status === 'success') {
          this.isLoading = false
          this.record = response.data.data

          this.kodeBarang = this.record.kode_barang
          this.namaBarang = this.record.nama_barang
          this.satuan = this.record.satuan
          this.hargaJual = this.record.harga_jual
          this.status = { id: this.record.status, name: this.record.status_text }
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
        const payload = {
          kode_barang: this.kodeBarang,
          nama_barang: this.namaBarang,
          satuan: this.satuan,
          harga_jual: this.unformatNumber(this.hargaJual),
          status: this.status ? this.status.id : ''
        }
        let response = ''
        if (this.isEdit) {
          response = await barangServices.update(this.barangId, payload)
        } else {
          response = await barangServices.create(payload)
        }
        
        if (response.data.status === 'success') {
          /* SET IS EDIT STATE TO FALSE */
          this.isEdit = false

          /* SET LOADING STATE IS FALSE */
          this.isLoading = false

          if (this.barangId) {
            this.showModal = false
          }

          /* CLEAR INPUT FORM */
          this.clearForm()

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
          if (responseReturn.kode_barang || responseReturn.nama_barang || responseReturn.satuan || responseReturn.harga_jual || responseReturn.status) {
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
    clearForm(){
      this.barangId = ''
      this.kodeBarang = ''
      this.namaBarang = ''
      this.satuan = ''
      this.hargaJual = ''  
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
      this.modalTitle = 'Tambah Barang'
      this.clearForm()
      this.$refs.namaBarang.$el.focus()
    },
    toggleEdit(id) {
      this.isEdit = true
      this.error = []
      this.showModal = true
      this.modalTitle = 'Edit Barang'
      this.clearForm()
      this.barangId = id
      this.fetchDataById(id)
    },
    nameWithId ({ name, id }) {
      return `${id} — ${name}`
    },
  },
  created() {
    this.fetchData()
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
          this.sortField = { field: 'id', name: 'ID (Bawaan)' }
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