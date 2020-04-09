/**
 * @description 保存本地缓存的值
 * @param {any} key 本地缓存的键
 * @param {*} value 本地缓存的值
 */
export const setLocal = (key, value) => {
    let keyValue = value;
    if (typeof value === 'Object') {
        keyValue = JSON.stringify(value);
    }
    sessionStorage.setItem(key, keyValue);
}

/**
 * @description 获取用户信息
 */
export const getLocal = (key) => {
    return sessionStorage.getItem(key);
}

/**
 * @description 清除用户信息
 */
export const clearLocal = (key) => {
    sessionStorage.removeItem(key);
}
