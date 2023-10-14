import { Config } from '../config';
import { v4 as UUID } from 'uuid';

export const JRPCBody = (method: string, params?: any) => {
    return {
        jsonrpc: '2.0',
        method: method,
        params: params ? params : {},
        id: UUID(),
    };
};

export const JRPCRequest = async (jsonRPCBody: any) => {
    let response = await fetch(Config.serverIP, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(jsonRPCBody),
        headers: {
            'Content-Type':
                'application/json; charset=UTF-8',
        },
    });
    return await response.json();
};
