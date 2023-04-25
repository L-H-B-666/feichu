
import jwt from 'jsonwebtoken'
import { resType, errThrowType } from './index.d'
/**抛出错误通用格式 */
export const errThrow = {
    /**请求方法不对时 405 */
    errorRequest(message: string = '非法请求'): errThrowType {
        return { code: 405, message }
    },
    /**参数为空或者数据不正确时 400 */
    errorData(message: string = '操作失败'): errThrowType {
        return { code: 400, message }
    },
    /**无权限时 403 */
    noPermissions(message: string = '请先登录') {
        return { code: 403, message }
    },
}
/**返回res通用格式 */
export const resSend = {
    /**不对外 返回一个统一的api的res对象 
     * @param code 返回code
     * @param success 是否成功
     * @param message 操作提示
     * @param data 如果成功，数据放在这
     * @returns 
     */
    send<T>(code: number, success: boolean, message: string, data?: T): resType<T> {
        let res = { code, success, message, data }
        if (!data) delete res.data
        console.log(`——请求结束，时间为 ${new Date()}\n`, res);
        return res
    },
    /**成功情况 */
    success<T>(data: T): resType<T> {
        return this.send(200, true, '操作成功', data)
    },
    /**失败情况 */
    error(code: number, message: string): resType<void> {
        return this.send(code, false, message)
    },
}

/**判断参数是否为空 */
export const judegParams = (paramObj: { [key: string]: any }): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            for (const key in paramObj) {
                if (Object.prototype.hasOwnProperty.call(paramObj, key)) {
                    const element = paramObj[key];
                    if (element == undefined || element === '') {
                        console.log(`————参数${key}为空`);
                        reject(errThrow.errorData('参数不能为空'))
                    }
                }
            }
            resolve()
        } catch (error: any) {
            reject(error.message || error)
        }
    })
}
/**判断请求类型是否正确 
 * @param method 请求的方法
 * @param type 想要的类型 
 */
export const judegMethod = (method: string, type: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (method === type) {
                resolve()
            } else {
                reject(errThrow.errorRequest())
            }
        } catch (error: any) {
            reject(errThrow.errorRequest())
        }
    })
}
/**token获取与校验 */
export const jwtToken = {
    /**token校验的配置 */
    jwtConfig: {
        secret: 'As阿三哥发公交**',//盐，乱填的
        time: 60 * 60,//有效时间 单位s
    },
    /**生成token 
     * @param account 账号
     * @param password 密码
     * @returns token
     */
    getToken(account: string, password: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let token = jwt.sign({ account, password }, this.jwtConfig.secret, { expiresIn: this.jwtConfig.time })//Token有效时间 单位s
                resolve(token)
            } catch (error: any) {
                reject(error.message || error)
            }
        })
    },
    /**验证Toke 
     * @param {string} token  
     * @returns {Promise<any>}
     */
    verifyToken(token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                jwt.verify(token, this.jwtConfig.secret, async (error: any, result: any) => {
                    if (error) {
                        console.log(`token验证失败, ${error}`);
                        reject(errThrow.noPermissions())
                    } else {
                        console.log('token验证成功');
                        resolve(result)
                    }
                })
            } catch (error: any) {
                reject(error.message || error)
            }
        })
    },
}