interface jsonRPCRequest {
    method: string;
    params: any;
    id: string;
    jsonrpc: '2.0';
}

export class AddReviewRequest implements jsonRPCRequest {
    jsonrpc: '2.0' = '2.0';
    id: string;
    params: any;
    method: string;
}
