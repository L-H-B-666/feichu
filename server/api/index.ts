import { resSend } from '../util'
export default defineEventHandler(async (event) => {
    return resSend.error(404, '根路径无内容')
}) 
