<template>
    <header id="header" class="bg-gray-700">
        <nav class="container mx-auto flex justify-start items-center py-5 px-4">
            <!-- App Name -->
            <router-link class="text-white font-bold uppercase text-2xl mr-4" :to="{name: 'home'}">Music</router-link>

            <div class="flex flex-grow items-center">
                <!-- Primary Navigation -->
                <ul class="flex flex-row mt-1">
                    <!-- Navigation Links -->
                    <li>
                        <router-link class="px-2 text-white" :to="{name: 'about'}">About</router-link>
                    </li>
                    <template v-if="!userStore.userLoggedIn">
                        <li>
                            <a class="px-2 text-white" @click.prevent="toggleAuthModal" href="#">
                                Login / Register
                            </a>
                        </li>
                    </template>
                    <template v-else>
                        <li>
                            <router-link class="px-2 text-white" :to="{name: 'manage'}">Manage</router-link>
                        </li>
                        <li>
                            <a class="px-2 text-white" href="#" @click.prevent="signOut()">Log out</a>
                        </li>
                    </template>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
import { mapStores, mapWritableState } from 'pinia'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'

export default {
    data() {
        return {}
    },
    computed: {
        ...mapStores(useModalStore, useUserStore),
        ...mapWritableState(useModalStore, {
            modalVisibility: 'isOpen'
        })
    },
    methods: {
        toggleAuthModal() {
            this.modalVisibility = !this.modalVisibility
        },
        signOut() {
            this.userStore.signOut();
            if(this.$route.meta.requiresAuth) {
                this.$router.push({ name: 'home' })
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>
