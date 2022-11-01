<template>
  <div id="sidebar" class="fixed z-40 inset-0 flex-none h-full bg-gray-800 bg-opacity-25 w-full lg:bg-white lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-52 xl:w-60 lg:block" :class="{ 'hidden': isHidden }">
    <div id="navWrapper" class="h-full overflow-y-auto lg:h-auto lg:block lg:sticky lg:bg-transparent overflow-hidden bg-white mr-24 lg:mr-0">
      <div class="p-4 bg-blue-600">
        <div><img class="block w-20 h-20 mx-auto rounded-full object-cover" src="../../../assets/images/user-circle.png" alt="User"></div>
        <div class="text-center text-white">
          <span class="block text-lg capitalize">{{ userData ? userData.nama : 'User' }}</span>
          <span class="block text-xs uppercase">{{ userData ? userData.hak_akses : 'Hak Akses' }}</span>
        </div>
      </div>
      <SidebarNav />      
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarNav from './SidebarNav.vue'

export default {
  components: {
    SidebarNav
  },
  computed: {
    ...mapGetters({
      isHidden: 'isHidden',
      userData: 'user'
    })
  }
}
</script>