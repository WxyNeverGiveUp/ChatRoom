function add0(m) { return m < 10 ? '0' + m : m }
export function timeFormat(timestamp, isFull = true) {
    const time = new Date(timestamp)
    const y = time.getFullYear()
    const m = time.getMonth() + 1
    const d = time.getDate()
    const h = time.getHours()
    const mm = time.getMinutes()
    const s = time.getSeconds()
    if (isFull) {
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
    } else {
        return y + '-' + add0(m) + '-' + add0(d)
    }
}

export function booleanCompare(property) {
    return function(a, b) {
        let value1 = a[property] || false
        let value2 = b[property] || false
        return Number(value2) - Number(value1)
    }
}