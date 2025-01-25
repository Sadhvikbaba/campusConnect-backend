class ApiError{
    constructor(
        statusCode , message = "SomeThing went wrong" 
    ){
        this.statusCode = statusCode
        this.message = message
        this.success = false
    }
}

export {ApiError}