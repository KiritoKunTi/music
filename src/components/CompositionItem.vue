<template>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <div v-show="!showForm">
            <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
            <button
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                @click.prevent="deleteSong"
            >
                <i class="fa fa-times"></i>
            </button>
            <button
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click.prevent="showForm = !showForm"
            >
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
        <div v-show="showForm">
            <div
                class="text-white text-center font-bold p-4 mb-4"
                :class="alert_variant"
                v-if="show_alert"
            >
                {{ alert_message }}
            </div>
            <vee-form :validation-schema="schema" @submit="editSong" :initial-values="song">
                <div class="mb-3">
                    <label class="inline-block mb-2">{{}}</label>
                    <vee-field
                        type="text"
                        name="modified_name"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title"
                        @input="$emit('updateUnsavedFlag', true)"
                    />
                    <error-message class="text-red-400" name="modified_name"></error-message>
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2">{{ song.genre }}</label>
                    <vee-field
                        type="text"
                        name="genre"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre"
                        @input="$emit('updateUnsavedFlag', true)"
                    />
                    <error-message class="text-red-400" name="genre"></error-message>
                </div>
                <button
                    type="submit"
                    class="py-1.5 px-3 rounded text-white bg-green-600"
                    :disabled="in_submission"
                >
                    Submit
                </button>
                <button
                    type="button"
                    class="py-1.5 px-3 rounded text-white bg-gray-600"
                    @click.prevent="showForm = false"
                    :disabled="in_submission"
                >
                    Go Back
                </button>
            </vee-form>
        </div>
    </div>
</template>

<script>
import { db, storage } from '@/includes/firebase'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

export default {
    props: {
        song: {
            type: Object,
            required: true
        },
        updateSong: {
            type: Function,
            required: true
        },
        removeSong: {
            type: Function,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    emits: ['updateUnsavedFlag'],
    data() {
        return {
            showForm: false,
            schema: {
                modified_name: 'required',
                genre: 'alphaSpaces'
            },
            in_submission: false,
            show_alert: false,
            alert_variant: 'bg-blud-500',
            alert_message: 'Please wait! Updating song info.'
        }
    },
    methods: {
        async editSong(values) {
            this.in_submission = true
            this.show_alert = true
            this.alert_variant = 'bg-blue-500'
            this.alert_message = 'Please wait! Updating song info.'

            try {
                await updateDoc(doc(db, 'songs', values.docID), values)
            } catch (error) {
                this.in_submission = false
                this.alert_variant = 'bg-red-500'
                this.alert_message = 'Something went wrong! Try again later!'
                return
            }
            this.updateSong(this.index, values)
            this.$emit('updateUnsavedFlag', false)

            this.in_submission = false
            this.alert_variant = 'bg-green-500'
            this.alert_messag = 'Song information updated succesfully!'
        },
        async deleteSong() {
            await deleteObject(ref(storage, `songs/${this.song.orignial_name}`))
            await deleteDoc(doc(db, 'songs', this.song.docID))
            this.removeSong(this.index)
        }
    }
}
</script>
