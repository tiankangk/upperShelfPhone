import axios from 'axios'

if (process.env.NODE_ENV === 'development') {
    var baseURL = `http://192.168.0.71:3001/`
    
} else {
    var baseURL = `http://192.168.0.38:3001/`
}

/**
 * 
 * 上架接口
 */
// 获得上架的商品的信息
export const getPhoneUpperShelfShop = params => {
    return axios.post(baseURL + 'getPhoneUpperShelfShop', params).then(res => res.data);
}
// 上架商品
export const upperShelfShop = params => {
    return axios.post(baseURL + 'upperShelfShop', params).then(res => res.data);
}