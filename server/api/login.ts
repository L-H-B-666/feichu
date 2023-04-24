import { resSend, errThrow, judegParams, jwtToken } from '../util'
export default defineEventHandler(async (event) => {
    try {
        const method = getMethod(event).toUpperCase()
        const query = getQuery(event)//query参数 
        const { account, password } = query
        // if (method !== 'POST') {
        //     throw errThrow.errorRequest()
        // }
        // const body = await readBody(event)//body参数
        // const { account, password }: { [key: string]: string } = body
        await judegParams({ account, password })
        let data
        if (account === '123456' && password === 'aa123') {
            let token = await jwtToken.getToken(account, password)
            data = { token }
        } else {
            throw errThrow.errorData('账号或密码错误')
        }
        return resSend.success(data)
    } catch (error: any) {
        return resSend.error(error.code || 500, error.message || '系统错误')
    }
}) 