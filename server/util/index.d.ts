
/**机器人的返回参数接口 */
export interface robotRes {
    "code": number,
    "data": {
        "body": {
            "content": string
        },
        "chat_id": string,
        "create_time": string,
        "deleted": boolean,
        "message_id": string,
        "msg_type": string,
        "sender": {
            "id": string,
            "id_type": string,
            "sender_type": string,
            "tenant_key": string
        },
        "update_time": string,
        "updated": boolean
    },
    "msg": string
}

/**返回参数统一的结构类型  */
export interface resType<T> {
    code: number
    success: boolean
    message: string
    data?: T
}
/**抛出错误通用格式类型 */
export interface errThrowType {
    code: number
    message: string
}