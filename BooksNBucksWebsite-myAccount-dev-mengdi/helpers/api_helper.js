import axios from "axios"

//apply base url for axios
const API_URL = process.env.backend_url + "api"

const axiosApi = axios.create({
  baseURL: API_URL,
  validateStatus: function (status) {
    return status >= 200 && status < 600 // default
  },
})

axiosApi.interceptors.response.use(
    response => response,
    error => Promise.reject(error)
)

export async function get(url, data, config = {}) {
  axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
  return await axiosApi.get(url, {...config, params: data}).then(response => response.data)
}

export async function post(url, data, config = {}) {
  axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
  return axiosApi
      .post(url, data, {...config})
      .then(response => response.data)
}

export async function put(url, data, config = {}) {
  axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
  return axiosApi
      .put(url, {...data}, {...config})
      .then(response => response.data)
}

export async function del(url, data, config = {}) {
  axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
  return await axiosApi
      .delete(url, {...config, params: data})
      .then(response => response.data)
}


export const convertObjectToFormData = (object) => {
  axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
  let form_data = new FormData()
  for (let key in object) {
    if (object[key] !== null) {
      form_data.append(key, object[key])
    }
  }
  return form_data
}