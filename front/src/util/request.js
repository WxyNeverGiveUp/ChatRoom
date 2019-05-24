import { Message, Loading } from 'element-ui'
import axios from 'axios'

const loadingOptions = {
    lock: true,
    text: "拼命爬取数据中",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
}
class AjaxRequest {
    constructor() {}

    /**
     * get请求
     * @param {string} url 请求地址
     * @param {hashMap} params 参数
     * @param {boolean} isLoading 是否需要加载
     */
    async get(url, params, isLoading = false) {
        let loading
        if (isLoading) {
            loading = Loading.service(loadingOptions)
        }
        return new Promise((resolve, reject) => {
            axios.get(url, {
                    params
                })
                .then(function(response) {
                    if (isLoading) {
                        loading.close()
                    }
                    resolve(response.data)
                })
                .catch(function(err) {
                    if (isLoading) {
                        loading.close()
                    }
                    reject(err)
                    Message({
                        message: err.message,
                        type: "error",
                        duration: 2500,
                        showClose: true
                    })
                })
        })
    }

    /**
     * post请求
     * @param {string} url 请求地址
     * @param {hashMap} params 参数
     * @param {boolean} isLoading 是否需要加载
     */
    async post(url, params, isLoading = false) {
        let loading
        if (isLoading) {
            loading = Loading.service(loadingOptions)
        }
        return new Promise((resolve, reject) => {
            axios.post(url, params).then(function(response) {
                    if (isLoading) {
                        loading.close()
                    }
                    resolve(response.data)
                })
                .catch(function(err) {
                    if (isLoading) {
                        loading.close()
                    }
                    reject(err)
                    Message({
                        message: err.message,
                        type: "error",
                        duration: 2500,
                        showClose: true
                    })
                })
        })
    }
}

export const ajaxRequest = new AjaxRequest()