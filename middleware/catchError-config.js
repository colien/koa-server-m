module.exports = ()=>{
	return async function(ctx, next) {
		try{
            await next()
        } catch(error){
            if(error.errorCode){
                console.log('捕获到错误',error.msg);
                return ctx.body = error.msg
            }
        }
	}
}
