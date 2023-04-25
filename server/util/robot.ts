import axios from 'axios'//这个页面不能用useFetch，只能用第三方请求库实现了
import { robotRes } from './index.d'
/**本页面的变量配置 */
const config = {
    /**应用id与密匙 */
    app: {
        appid: 'cli_a4cc1e836cb9900d',
        appSecret: 'JZ6sv' + '11S2ehU' + 'B9a3uLQ85e5A' + 'SEeYp4jh'
    },
    /** accessToken 最大有效期两小时*/
    accessToken: {
        /**token值 */
        value: '',
        /**到期时间，单位ms，这个时间 - 当前时间戳 > minTime 时重新获取 */
        expire: 0,
        /**我设置的最短时间，单位ms，目前为5分钟 */
        minTime: 300 * 1000
    },
    /**群聊id */
    chatId: 'oc_3d1ba27d507fdcf11dbe9ad80ee648b9',//测试群 oc_973fe47376f550f352f9280621f49e0d ，考核群为 oc_3d1ba27d507fdcf11dbe9ad80ee648b9
}
/** 如果即将过期了，就自动获取 AccessToken */
const getAccessToken = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (config.accessToken.expire - (new Date()).getTime() < config.accessToken.minTime) {//如果目标时间 - 当前时间 小于最短时间了
                const { data } = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
                    app_id: config.app.appid,
                    app_secret: config.app.appSecret
                }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
                console.log('需要重新获取AccessToken', data);
                config.accessToken.value = data.tenant_access_token
                config.accessToken.expire = (new Date()).getTime() + data.expire * 1000//得到是是“剩余有效秒数”，转为目标时间戳存储 
            }
            resolve()
        } catch (error: any) {
            reject(error.message || error)
        }
    })
}

/** 发送文本消息 */
export const robotSendMsg = (message: string): Promise<robotRes> => {
    return new Promise(async (resolve, reject) => {
        try {
            await getAccessToken()
            const body = {
                receive_id: config.chatId,//群聊id
                msg_type: 'text',
                content: JSON.stringify({ text: message })
            }
            const headers = {
                'Authorization': 'Bearer ' + config.accessToken.value,
                'Content-Type': 'application/json; charset=utf-8'
            }
            const { data } = await axios.post('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id', body, ({ headers } as any))
            resolve(data)
        } catch (error: any) {
            reject(error)
        }
    })
}
/**发送卡片消息 */
export const robotSendCard = (time: Date, text: string, title: string): Promise<robotRes> => {
    return new Promise(async (resolve, reject) => {
        try {//
            await getAccessToken()
            const body = {
                receive_id: config.chatId,//群聊id
                msg_type: 'interactive',
                content: JSON.stringify({
                    type: "template",
                    data: {
                        template_id: 'ctp_AArTBNtgjBjk',
                        template_variable: {
                            title, time, text
                        }
                    }
                })
            }
            const headers = {
                'Authorization': 'Bearer ' + config.accessToken.value,
                'Content-Type': 'application/json; charset=utf-8'
            }
            const { data } = await axios.post('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id', body, ({ headers } as any))
            resolve(data)
        } catch (error: any) {
            reject(error.message || error)
        }
    })
}
