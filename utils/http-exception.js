class HttpException extends Error{
    constroctor(msg = '服务器异常', errorCode = 10000, code = 500){
        super()
        this.msg = msg
        this.code = code
        this.errorCode = errorCode
    }
}
module.export = HttpException
