import AesUtil from "./AesUtil"

const CLIENT_TOKEN = "GxQMygNMQtYcjAWsroMjt7E5pPuCh2tf123Hju&*"

export default date => {
  const data = {
    date
  }
  return AesUtil.encrypt(JSON.stringify(data), date + CLIENT_TOKEN)
}
