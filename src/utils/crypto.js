import CryptoJS from 'crypto-js'

/**
   * AES加密
   */
export function aesEncrypt(msg) {
  return CryptoJS.AES.encrypt(msg, process.env.VUE_APP_AES_SECRET_CIPHER).toString()
}

/**
 * AES解密
 */
export function aesDecrypt(encrypted) {
  return CryptoJS.AES.decrypt(encrypted, process.env.VUE_APP_AES_SECRET_CIPHER).toString(CryptoJS.enc.Utf8)
}
