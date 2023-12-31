<template>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
        <div class="md:grid md:grid-cols-3 md:gap-4">
            <div class="col-span-1">
                <upload-file ref="upload" @add-song="addSong"></upload-file>
            </div>
            <div class="col-span-2">
                <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                        <span class="card-title">My Songs</span>
                        <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
                    </div>
                    <div class="p-6">
                        <!-- Composition Items -->
                        <composition-item
                            v-for="(song, index) in songs"
                            :key="song.docID"
                            :song="song"
                            :update-song="updateSong"
                            :remove-song="removeSong"
                            @update-unsaved-flag="updateUnsavedFlag"
                            :index="index"
                        ></composition-item>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import UploadFile from '@/components/UploadFile.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { auth, db } from '@/includes/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default {
    components: {
        UploadFile,
        CompositionItem
    },
    data() {
        return {
            songs: [],
            unsavedFlag: false
        }
    },
    async created() {
        const querySongs = query(collection(db, 'songs'), where('uid', '==', auth.currentUser.uid))
        const snapshotSongs = await getDocs(querySongs)
        snapshotSongs.forEach(this.addSong)
    },
    methods: {
        updateSong(i, values) {
            this.songs[i].modified_name = values.modified_name
            this.songs[i].genre = values.genre
        },
        removeSong(i) {
            this.songs.splice(i, 1)
        },
        addSong(document) {
            const song = {
                ...document.data(),
                docID: document.id
            }
            this.songs.push(song)
        },
        updateUnsavedFlag(value) {
            this.unsavedFlag = value
        }
    },
    beforeRouteLeave(to, from, next) {
        let toCancel = true
        if (this.unsavedFlag) {
            const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
            toCancel = leave
        }
        if (toCancel) {
            this.$refs.upload.cancelUploads()
            next()
        }
    }
}
</script>

<style lang="scss" scoped></style>
