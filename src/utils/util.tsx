/**
 * 处理 axios ERROR
 * @param error 
 * @returns 
 */
export function handleErrorMsg(error: any) {
  return error.response && error.response.data.error ? error.response.data.error : error.message
}
