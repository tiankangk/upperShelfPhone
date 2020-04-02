import axios from 'axios'

if (process.env.NODE_ENV === 'development') {
    var baseURL = `http://localhost:3001/`;
    var outURL = `http://mqs-api.tst.yaojushi.com/mgmt/v1/`;

} else {
    var baseURL = `http://192.168.0.38:3001/`;
    var outURL = `http://mqs-api.yaojushi.com/mgmt/v1/`;
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
//登录

export const pickGoodsLogin = params => {
    return axios.post(baseURL + 'pickGoodsLogin', params).then(res => res.data);
}

//检查拣货篮有没有被占用

export const isUsedCarNum = params => {
    return axios.post(baseURL + 'isUsedCarNum', params).then(res => res.data);
}


//获取要处理的消息模块

export const getHandleMessage = params => {
    return axios.get(`${outURL}notification/paged/1242095274848772001`, {params}).then(res => res.data);
}


