import { useState, useEffect } from 'react'

//Set document title if focussed conditional is set.
export function useDocumentTitle(focussed) {
    const [ windowFocussed, setWindowFocussed ] = useState(document.hasFocus())
    useEffect(() => {
        window.addEventListener('focus', setWindowFocussed(true))
        window.addEventListener('blur', setWindowFocussed(false))
        return () => {
            window.removeEventListener('focus', setWindowFocussed(true))
            window.removeEventListener('blur', setWindowFocussed(false))
        }
    })
    return title => {
        if(windowFocussed === focussed || focussed === undefined) {
            document.title = title
        }
    }
}