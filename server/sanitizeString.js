module.exports = string => {
    if (string && typeof string === 'string') {
        return string
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .trim()
            .toLowerCase()
    }
    return false
}
