<template>
  <div>
    <div class="breadcrumb flex justify-between">
      <div class="w-full md:w-1/2 flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">DATA USER</h1>
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
            <option v-for="show in shows" :key="show.number" :value="show.number" :selected="show.number === take ? 'selected' : ''">{{ show.name }}</option>
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
            <input type="text" ref="search" v-model="search" @input="runSearch()" aria-label="Search" placeholder="Pencarian" class="search-form-control">
          </div>        
        </div>
      </div>      
      <!-- TABLE SECTION -->
      <div class="bg-white rounded-sm overflow-y-auto">
        <table>
          <thead>
            <tr>
              <th scope="col" class="text-left">Kode</th>
              <th scope="col" class="text-left">Nama</th>
              <th scope="col" class="text-left">Alamat</th>
              <th scope="col" class="text-left">Email</th>
              <th scope="col" class="text-left">No Telp</th>
              <th scope="col" class="text-left">Hak Akses</th>
              <th scope="col" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length == 0" class="border-b border-gray-200"><td class="text-center" colspan="7">Tidak ada data yang dapat ditampilkan</td></tr>
            <tr v-else-if="totalFiltered == 0" class="border-b border-gray-200"><td class="text-center" colspan="7">Tidak ada catatan yang cocok ditemukan</td></tr>
            <tr v-for="(user, index) in users" :key="user.id" class="border-b">
              <td class="text-left">{{ user.kode_user }}</td>
              <td class="text-left">{{ user.nama }}</td>
              <td class="text-left">{{ user.alamat }}</td>
              <td class="text-left">{{ user.email }}</td>
              <td class="text-left">{{ user.no_telp }}</td>
              <td class="text-left">{{ user.hak_akses }}</td>
              <td class="text-center">
                <div class="flex justify-center">
                  <button @click="toggleEdit( user.id )" type="button" class="btn-edit" alt="Edit" title="Edit">
                    <IconEdit />
                  </button>                  
                  <button @click="confirmDialog( user.id )" type="button" class="btn-delete" alt="Delete">
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
              <span class="text-sm">Sebelumnya</span>
            </button>
            <button type="button" :disabled="currentPage === lastPage || currentPage > lastPage" @click="nextPage" class="page-item">
              <span class="text-sm">Berikutnya</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Dialog -->
    <modal :show="showModal" @close="showModal = false" addClass="modal-sm" modalOrientation="py-20 md:py-6">
      <template v-slot:header><h3>{{ modalTitle }}</h3></template>
      <template v-slot:body>
        <Form id="modalForm" @submit="saveConfirmDialog()">
          <div class="flex w-full gap-2">
            <div class="w-2/6 mb-2">
              <label for="kode_user" class="label-control">Kode <span class="text-red-600">*</span></label>
              <Field id="kode_user" name="kode_user" type="text" ref="kodeUser" v-model="kodeUser" label="Kode User" rules="required" class="form-control" disabled />
              <ErrorMessage name="kode_user" class="capitalize text-sm text-red-600" />
              <div v-if="error.kode_user" class="capitalize text-sm text-red-600"><span>{{ error.kode_user[0] }}</span></div>              
            </div>
            <div class="w-4/6 mb-2">
              <label for="nama" class="label-control">Nama <span class="text-red-600">*</span></label>
              <Field id="nama" name="nama" type="text" ref="namaUser" v-model="namaUser" label="Nama" rules="required" class="form-control" autocomplete="off" />
              <ErrorMessage name="nama" class="capitalize text-sm text-red-600" />
              <div v-if="error.nama" class="capitalize text-sm text-red-600"><span>{{ error.nama[0] }}</span></div>
            </div>
          </div>  
          <div class="w-full mb-2">
            <label for="alamat" class="label-control">Alamat <span class="text-red-600">*</span></label>
            <Field id="alamat" name="alamat" type="text" ref="alamat" v-model="alamat" label="Alamat" rules="required" class="form-control" autocomplete="off" />
            <ErrorMessage name="alamat" class="capitalize text-sm text-red-600" />
            <div v-if="error.alamat" class="capitalize text-sm text-red-600"><span>{{ error.alamat[0] }}</span></div>        
          </div>  
          <div class="flex w-full gap-4">
            <div class="w-1/2 mb-2">
              <label for="hak_akses" class="label-control">Hak Akses <span class="text-red-600">*</span></label>
              <VueMultiselect id="hak_akses" name="hak_akses" ref="hak_akses" v-model="hakAkses" :options="hakAksesOptions" :showLabels="false" placeholder="Pilih Hak Akses">
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
              <ErrorMessage name="hak_akses" class="capitalize text-sm text-red-600" />
              <div v-if="error.hak_akses" class="capitalize text-sm text-red-600"><span>{{ error.hak_akses[0] }}</span></div>              
            </div>
            <div class="w-1/2 mb-2">
              <label for="no_telp" class="label-control">No Telp <span class="text-red-600">*</span></label>
              <Field id="no_telp" name="no_telp" type="text" v-model="noTelp" label="No Telp" maxlength="255" rules="required" class="form-control" />
              <ErrorMessage name="no_telp" class="capitalize text-sm text-red-600" />
              <div v-if="error.no_telp" class="capitalize text-sm text-red-600"><span>{{ error.no_telp[0] }}</span></div>              
            </div>
          </div>
          <div class="w-full mb-2">
            <label for="email" class="label-control">Email <span class="text-red-600">*</span></label>
            <Field id="email" name="email" type="text" v-model="email" label="Email" maxlength="255" rules="required" class="form-control" />
            <ErrorMessage name="email" class="capitalize text-sm text-red-600" />
            <div v-if="error.email" class="capitalize text-sm text-red-600"><span>{{ error.email[0] }}</span></div>
          </div>          
          <div class="w-full mb-2">
            <label for="username" class="label-control">Username <span class="text-red-600">*</span></label>
            <Field id="username" name="username" type="text" v-model="username" label="Username" maxlength="255" rules="required" class="form-control" />
            <ErrorMessage name="username" class="capitalize text-sm text-red-600" />
            <div v-if="error.username" class="capitalize text-sm text-red-600"><span>{{ error.username[0] }}</span></div>
          </div>
          <div class="flex w-full gap-4">
            <div class="w-1/2 mb-2">
              <label for="password" class="label-control">Password <span class="text-red-600">*</span></label>
              <div class="relative flex justify-between items-center">
                <Field id="password" name="password" :type="inputType" v-model="password" label="Password" maxlength="255" rules="" class="form-control" />
                <span class="h-full absolute cursor-pointer right-0">
                  <IconHide v-if="!visibility" @click="togglePassword()" class="m-3.5" />
                  <IconView v-if="visibility" @click="togglePassword()" class="m-3.5" />
                </span>                      
              </div>
              <ErrorMessage name="password" class="capitalize text-sm text-red-600" />
              <div v-if="error.password" class="capitalize text-sm text-red-600"><span>{{ error.password[0] }}</span></div>              
            </div>
            <div class="w-1/2 mb-2">
              <label for="password_confirmation" class="label-control">Konfirmasi Password <span class="text-red-600">*</span></label>
              <div class="relative flex justify-between items-center">
                <Field id="password_confirmation" name="password_confirmation" :type="inputTypeConfirmation" v-model="passwordConfirmation" label="Konfirmasi password" rules="" class="form-control" />
                <span class="h-full absolute cursor-pointer right-0">
                  <IconHide v-if="!visibilityConfirmation" @click="togglePasswordConfirmation()" class="m-3.5" />
                  <IconView v-if="visibilityConfirmation" @click="togglePasswordConfirmation()" class="m-3.5" />
                </span>                      
              </div>              
              <ErrorMessage name="password_confirmation" class="capitalize text-sm text-red-600" />
              <div v-if="error.password_confirmation" class="capitalize text-sm text-red-600"><span>{{ error.password_confirmation[0] }}</span></div>              
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
import { Field, Form, ErrorMessage } from "vee-validate"
import userServices from '@/services/user/userServices'
import { createToastInterface } from 'vue-toastification'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconView from '../icons/IconView.vue'
import IconHide from '../icons/IconHide.vue'
import Modal from '../widgets/Modal.vue'

export default {
  name: 'HalamanUser',
  components: {
    Field,
    Form,
    ErrorMessage,    
    IconPlus,
    IconTrash,
    IconEdit,
    IconView,
    IconHide,    
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
        { field: 'nama', name: 'Nama User' },
        { field: 'email', name: 'Email' },
        { field: 'status', name: 'Status' },
        { field: 'updated_at', name: 'Diedit' },
        { field: 'id', name: 'ID (Bawaan)' }
      ],        
      sortOption: { field: 'desc', name: 'Descending' },
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
      shows: [],
      users: [],
      error: [],
      modalTitle: '',     
      showModal: false,      
      isEdit: false,
      userId: '',
      kodeUser: '',
      namaUser: '',
      alamat: '',
      hakAkses: '',
      hakAksesOptions: ['Admin', 'Keuangan'],
      noTelp: '',
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      visibility: false,
      visibilityConfirmation: false,
      inputType: 'password',
      inputTypeConfirmation: 'password',

      isLoading: false,
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
        const response = await userServices.fetchLimit(params)
        if (response.data.status === 'success') {
          this.isLoading =false

          const records = response.data.data
          this.totalRecords = records.total
          this.totalFiltered = records.total_filter
          this.fromRecord = records.from
          this.toRecord = records.to
          this.currentPage = records.current_page
          this.lastPage = records.last_page
          this.shows = records.show
          this.users = records.data
        } else {
          this.isLoading =false

          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)          
        }
      } catch (error) {
        this.isLoading =false
        console.log(error)
      }
    },
    toggleNew() {
      this.isEdit = false
      this.error = []
      this.showModal = true
      this.modalTitle = 'Tambah User'
      this.clearForm()
      this.$refs.namaUser.$el.focus()
    },
    toggleEdit(id) {
      this.isEdit = true
      this.error = []
      this.showModal = true
      this.modalTitle = 'Edit User'
      this.clearForm()
      this.userId = id
      this.fetchDataById(id)
    },
    async delete(id) {
      try {
        const response = await userServices.delete(id)
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
        const response = await userServices.fetchById(id)
        if (response.data.status === 'success') {
          this.isLoading = false
          this.record = response.data.data

          this.kodeUser = this.record.kode_user
          this.namaUser = this.record.nama
          this.alamat = this.record.alamat
          this.hakAkses = this.record.hak_akses
          this.noTelp = this.record.no_telp
          this.email = this.record.email
          this.username = this.record.username
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
          nama: this.namaUser,
          alamat: this.alamat,
          hak_akses: this.hakAkses,
          no_telp: this.noTelp,
          email: this.email,
          username: this.username,
          password: this.password,
          password_confirmation: this.passwordConfirmation
        }
        let response = ''
        if (this.isEdit) {
          response = await userServices.update(this.userId, payload)
        } else {
          response = await userServices.create(payload)
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
          if (responseReturn.nama || responseReturn.alamat || responseReturn.hak_akses || responseReturn.no_telp || responseReturn.email || responseReturn.username || responseReturn.password) {
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
      this.userId = ''
      this.kodeUser = !this.isEdit ? 'OTOMATIS' : ''
      this.namaUser = ''
      this.alamat = ''
      this.hakAkses = ''
      this.noTelp = ''
      this.email = '' 
      this.username = ''
      this.password = ''      
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
    runSearch() {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.page = 1
          this.updateQueryString()
          this.fetchData()
          this.awaitingSearch = false
        }, 1500)
      }
      this.awaitingSearch = true
    },
    togglePassword(){
      this.visibility = !this.visibility
      this.inputType = this.visibility == false ? 'password' : 'text'
    },
    togglePasswordConfirmation(){
      this.visibilityConfirmation = !this.visibilityConfirmation
      this.inputTypeConfirmation = this.visibilityConfirmation == false ? 'password' : 'text'
    }          
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
          this.sortOption = { field: 'desc', name: 'Descending' }
        }
      },
      immediate: true
    }                   
  }
}
</script>