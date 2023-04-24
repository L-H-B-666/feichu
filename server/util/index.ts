
import jwt from 'jsonwebtoken'

/**抛出错误通用格式类型 */
export interface errThrowType {
    code: number
    message: string
}
/**抛出错误通用格式 */
export const errThrow = {
    /**请求方法不对时 */
    errorRequest(message: string = '非法请求'): errThrowType {
        return { code: 405, message }
    },
    /**参数为空或者数据不正确时 */
    errorData(message: string = '操作失败'): errThrowType {
        return { code: 400, message }
    },
}

/**返回参数统一的结构类型  */
export interface resType {
    code: number
    success: boolean
    message: string
    data?: any
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
    send(code: number, success: boolean, message: string, data?: any): resType {
        let res = { code, success, message, data }
        if (!data) delete res.data
        return res
    },
    /**成功情况 */
    success(data: any) {
        return this.send(200, true, '操作成功', data)
    },
    /**失败情况 */
    error(code: number, message: string) {
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
                    if (element == undefined) {
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
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.jwtConfig.secret, async (error: any, result: any) => {
                if (error) {
                    console.log(`token验证失败, ${error}`);
                    reject(error)
                } else {
                    console.log('token验证成功');
                    resolve(result)
                }
            })

        })
    },
}