<template>
    <main>
        <div class="song-page" v-if="song"> 
            <!-- Music Header -->
            <section class="w-full mb-8 py-14 text-center text-white relative" >
                <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg" style="background-image: url(/assets/img/song-header.png)" ></div>
                <div class="container mx-auto flex items-center">
                    <!-- Play/Pause Button -->
                    <button @click.prevent="newSong(song)" type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none" > 
                        <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
                    </button>
                    <div class="z-50 text-left ml-8">
                        <!-- Song Info -->
                        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
                        <div>{{ song.genre }}</div>
                        <div class="song-price">{{ $n(1, 'currency') }}</div>
                    </div>
                </div>
            </section>
            <!-- Form -->
            <section class="container mx-auto mt-6" id="comments">
                <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                        <!-- Comment Count -->
                        <span class="card-title">{{ $tc('song.comment_count', song.comment_count, { count: song.comment_count }) }}</span>
                        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
                    </div>
                    <div class="p-6">
                        <div class="text-white text-center font-bold p-4 mb-4" :class="comment_alert_varialt" v-if="comment_show_alert">
                            {{ comment_alert_message }}
                        </div>
                        <vee-form :validation-schema="schema" @submit='addComment' v-if="userLoggedIn">
                            <vee-field name="comment" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4" placeholder="Your comment here..." ></vee-field>
                            <error-message class="text-red-400" name="comment"></error-message>
                            <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block" :disabled="comment_in_submission">
                                Submit
                            </button>
                        </vee-form>
                        <!-- Sort Comments -->
                        <select class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" v-model="sort">
                            <option value="1">Latest</option>
                            <option value="2">Oldest</option>
                        </select>
                    </div>
                </div>
            </section>
            <!-- Comments -->
            <ul class="container mx-auto">
                <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments" :key="comment.docID">
                    <!-- Comment Author -->
                    <div class="mb-5">
                        <div class="font-bold">{{ comment.name }}</div>
                        <time>{{ comment.datePosted }}</time>
                    </div>
                    <p>{{ comment.content }}</p>
                </li>
            </ul>
        </div>
    </main>
</template>

<script>
import { db, auth, commentsCollection } from '@/includes/firebase'
import { doc, getDoc, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

export default {
    data() {
        return {
            song: null,
            comments: [],
            schema: {
                comment: 'required|min:3',
            },
            sort: '1',
            comment_in_submission: false,
            comment_show_alert: false,
            comment_alert_varialt: 'bg-blue-500',
            comment_alert_message: 'Please wait! Your comment is being submitted',
        }
    },
    computed: {
        ...mapState(useUserStore, ['userLoggedIn']),
        ...mapState(usePlayerStore, ['playing']),
        sortedComments() {
            return this.comments.slice().sort((a, b) => {
                if(this.sort === '1') {
                    return new Date(b.datePosted) - new Date(a.datePosted);
                }
                return new Date(a.datePosted) - new Date(b.datePosted);
            })
        }
    },
    watch: {
        sort(newVal) {
            if(newVal == this.$route.query.sort) {
                return;
            }
            this.$router.push({
                query: {
                    sort: newVal,
                }
            })
        }
    },
    async created() {
        const { sort } = this.$route.query.sort || '1';
        this.sort = sort === '1' || sort === '2' ? sort : '1';
        this.getSong();
        this.getComments();
    },
    methods: {
        ...mapActions(usePlayerStore, ['newSong']),
        async getSong() {
            const songSnapshot = await getDoc(doc(db, 'songs', this.$route.params.id))
 
            if(!songSnapshot.exists) {
                this.$router.push({ name: 'home' });
                return;
            }

            this.song = songSnapshot.data();
        },
        async getComments() {
            const commentsOfSongQuery = query(commentsCollection, where('sid', '==', this.$route.params.id))
            const commentsSnapshot = await getDocs(commentsOfSongQuery);
            this.comments = [];
            commentsSnapshot.forEach((document) => {
                this.comments.push({
                    docID: document.id,
                    ...document.data(),
                });
            })
        },
        async addComment(values, { resetForm }) {
            this.comment_in_submission = true;
            this.comment_show_alert = true;
            this.comment_alert_varialt = 'bg-blue-500';
            this.comment_alert_message = 'Please wait! Your comment is being submitted';

            const comment = {
                content: values.comment,
                datePosted: new Date().toString(),
                sid: this.$route.params.id,
                name: auth.currentUser.displayName,
                uid: auth.currentUser.uid,
            }
            await addDoc(commentsCollection, comment);

            this.song.comment_count += 1;
            await updateDoc(doc(db, 'songs', this.$route.params.id), {
                comment_count: this.song.comment_count,
            })

            this.getComments();

            this.comment_in_submission = false;
            this.comment_alert_varialt = 'bg-green-500';
            this.comment_alert_message = 'Comment added!';

            resetForm();
        }
    }
}
</script>

<style lang="scss" scoped></style>
