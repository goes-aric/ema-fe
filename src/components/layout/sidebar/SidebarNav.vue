<template>
  <nav class="px-1 pt-6 overflow-y-auto font-medium text-base sm:px-3 xl:px-5 lg:text-sm pb-10 lg:pt-10 lg:pb-14 h-screen">
    <ul>
      <li class="mt-6">
        <span @click="toggleSidebar">
          <router-link :to="{ name: 'dashboard' }" class="nav-item">
            <IconDashboard />
            <span class="ml-2 relative">Dashboard</span>
          </router-link>
        </span>
        <span v-if="userData.hak_akses == 'Admin'" @click="toggleSidebar">
          <router-link :to="{ name: 'user' }" class="nav-item">
            <IconUser />
            <span class="ml-2 relative">User</span>
          </router-link>
        </span> 
        <ul v-if="userData.hak_akses == 'Admin'">
          <li v-if="userData.hak_akses == 'Admin'" @click="toggleSidebar">
            <router-link :to="{ name: 'akun' }" class="nav-item">
              <IconBook />
              <span class="ml-2 relative">Akun</span>
            </router-link>
          </li>
          <li v-if="userData.hak_akses == 'Admin'" @click="toggleSidebar">
            <router-link :to="{ name: 'pembelian' }" class="nav-item">
              <IconCard />
              <span class="ml-2 relative">Pembelian</span>
            </router-link>
          </li>          
          <li @click="toggleSidebar">
            <router-link :to="{ name: 'penjualan' }" class="nav-item">
              <IconKeyboard />
              <span class="ml-2 relative">Penjualan</span>
            </router-link>
          </li>
          <li @click="toggleSidebar">
            <router-link :to="{ name: 'jurnal' }" class="nav-item">
              <IconPoll />
              <span class="ml-2 relative">Jurnal Umum</span>
            </router-link>
          </li>
        </ul>
        <ul>
          <li v-if="userData.hak_akses == 'Admin'" @click="toggleSidebar">
            <router-link :to="{ name: 'laporan' }" class="nav-item">
              <IconAssignment />
              <span class="ml-2 relative">Laporan</span>
            </router-link>
          </li>
          <li @click="toggleSidebar">
            <a @click="logoutUser()" class="flex items-center px-3 py-2 hover:bg-gray-50 hover:text-gray-700 cursor-pointer">
              <IconLogout />
              <span class="ml-2">Logout</span>
            </a>            
          </li>
        </ul>        
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import authServices from '@/services/user/authServices'
import { createToastInterface } from 'vue-toastification'
import IconLogout from '../../icons/IconLogout.vue'
import IconDashboard from '../../icons/IconDashboard.vue'
import IconUser from '../../icons/IconUser.vue'
import IconBook from '../../icons/IconBook.vue'
import IconKeyboard from '../../icons/IconKeyboard.vue'
import IconPoll from '../../icons/IconPoll.vue'
import IconAssignment from '../../icons/IconAssignment.vue'
import IconCard from '../../icons/IconCard.vue'

export default {
  name: 'SidebarNav',
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
    IconLogout,
    IconDashboard,
    IconUser,
    IconBook,
    IconKeyboard,
    IconPoll,
    IconAssignment,
    IconCard
},  
  methods: {
    toggleSidebar(){
      this.$store.dispatch('toggleSidebar', !this.isHidden)
    },
    async logoutUser(){
      try {
        const response = await authServices.logout()
        if (response.data.status === 'success') {
          /* REMOVE DATA TO LOCAL STORAGE */
          localStorage.setItem('accessToken', null)

          this.$store.dispatch('setAuthentication', null)
          this.$store.dispatch('setUser', null)
          
          /* SUCCESS MESSAGE */
          this.toast.success(response.data.message)

          /* REDIRECT TO LOGIN PAGE */
          this.$router.push('/auth/login')          
        } else {
          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)
        }
      } catch (error) {
        console.log(error)
        /* THROW ERROR MESSAGES */
        this.toast.error(error.message)        
      }
    }     
  },
  computed: {
    ...mapGetters({
      userData: 'user'
    })
  },  
}
</script>