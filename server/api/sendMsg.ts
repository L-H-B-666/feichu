import { resSend, judegParams } from '../util'
import { robotSendMsg } from '../util/robot'
export default defineEventHandler(async (event) => {
    try {
        const method = getMethod(event).toUpperCase()
        const query = getQuery(event)//query参数 
        const { message } = query
        // if (method !== 'POST') {
        //     throw errThrow.errorRequest()
        // }
        // const body = await readBody(event)//body参数
        // const { message }: { [key: string]: string } = body
        await judegParams({ message })
        const res = await robotSendMsg((message as string))
        let data = { ...res }
        return resSend.success(data)
    } catch (error: any) {
        console.log(error?.data || error || '未返回错误信息');
        return resSend.error(error?.code || 500, error?.message || '系统错误')
    }
}) 