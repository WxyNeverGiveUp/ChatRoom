export function fetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(response => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}