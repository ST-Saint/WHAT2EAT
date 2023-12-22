interface errorResponseInterface {
    code: number;
    message: string;
}

export class ErrorResponse implements errorResponseInterface {
    code: number;
    message: string;
    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}
