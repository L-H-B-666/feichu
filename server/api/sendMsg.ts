import { resSend, judegParams, errThrow, judegMethod, jwtToken } from '../util'
import { robotSendMsg, robotSendCard } from '../util/robot'
export default defineEventHandler(async (event) => {
    try {
        const method = getMethod(event).toUpperCase()
        await judegMethod(method, 'POST')
        await jwtToken.verifyToken((getHeader(event, 'Authorization') as string))
        const { type } = getQuery(event)//判断是要发送文本还是消息卡片
        await judegParams({ type })
        const body = await readBody(event)//body参数
        let res: {}
        switch ((type as string)) {
            case '0'://文本
                const { message }: { [key: string]: string } = body
                await judegParams({ message })
                res = await robotSendMsg((message as string))
                break;
            case '1'://卡片
                const { text, title }: { [key: string]: string } = body
                await judegParams({ text, title })
                res = await robotSendCard(new Date(), text, title)
                break;
            default:
                throw errThrow.errorData('type类型不存在')
                return;
        }
        return resSend.success(res)
    } catch (error: any) {
        console.log('出现错误', error);
        return resSend.error(error?.code || 500, error?.message || '系统错误')
    }
}) 