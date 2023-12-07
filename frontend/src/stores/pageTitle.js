import {ref} from 'vue'
import {defineStore} from 'pinia'

export const usePageTitleStore = defineStore('pageTitle', () => {
        const title = ref('default')
        function setTitle(newTitle) {
            title.value = newTitle
        }
        return {title, setTitle}
    }
)