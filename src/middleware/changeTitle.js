import {usePageTitleStore} from "@/stores/pageTitle";

/**
 *
 * @param title {string | null }
 */
export default function changeTitleMiddleware(t) {
    const ps = usePageTitleStore()
    const {setTitle} = ps
    const title = t || 'Bookworm'
    setTitle(title)

}