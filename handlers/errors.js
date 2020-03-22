module.exports = async (ctx, next) => {
    // await next()
    try {
        await next()
    } catch(e) {
        ctx.status = e.status || 500
        ctx.body = { error: e.message || 'Internal server error' }
    }
}