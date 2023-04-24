export default defineEventHandler(async (event) => {
    const method = getMethod(event).toUpperCase()
    let body
    return { query: getQuery(event), body: readBody(event) }
}) 