<template>
    <li
        class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
    >
        <div>
            <router-link
                :to="{ name: 'song', params: { id: song.docID } }"
                class="font-bold block text-gray-600"
                >{{ song.modified_name }}</router-link
            >
            <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
        </div>

        <div class="text-gray-600 text-lg group">
            <router-link custom :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }" v-slot="{ navigate }"> 
                <span class="comments" @click="navigate">
                    <i class="fa fa-comments text-gray-600 group-hover:text-green-600"></i>
                    <span class="group-hover:text-green-600 ml-1.5"> 
                        {{ song.comment_count }}
                    </span>
                </span>
            </router-link>
            </div>
    </li>
</template>

<script>
export default {
    props: {
        song: {
            type: Object,
            required: true
        }
    }
}
</script>
