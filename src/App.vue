<template>
    <div>
        <the-header></the-header>
        <router-view></router-view>
        <player-item></player-item>
        <the-auth></the-auth>
    </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'
import TheAuth from '@/components/TheAuth.vue'
import PlayerItem from '@/components/PlayerItem.vue'
import useUserStore from '@/stores/user'
import { mapWritableState } from 'pinia'
import { auth } from '@/includes/firebase'

export default {
    components: {
        TheHeader,
        TheAuth,
        PlayerItem,
    },
    computed: {
        ...mapWritableState(useUserStore, ['userLoggedIn'])
    },
    created() {
        if (auth.currentUser) {
            this.userLoggedIn = true
        }
    }
}
</script>

<style lang="scss" scoped></style>
