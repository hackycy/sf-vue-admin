import CryptoJS from 'crypto-js'

const secret = `${process.env.AES_SECRET_CIPHER}`

/**
   * AES加密
   */
export function aesEncrypt(msg) {
  return CryptoJS.AES.encrypt(msg, secret).toString()
}

/**
 * AES解密
 */
export function aesDecrypt(encrypted) {
  return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8)
}
