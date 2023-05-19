// waves data service

import axios from "axios";

const API_NODE_URL = 'https://nodes.wavesnodes.com/';
const API_URL = 'https://api.wavesplatform.com/v0/';

export interface IDataServiceResponse {
    data: {
        data: IDataTransaction;
    }[];
    isLastPage: boolean;
    lastCursor: string;
}

export interface IDataTransaction {
    id: string;
    recipient: string;
    amount: number;
    leaseId: string;
    height: number;
    type: number;
    sender: string;
    call?: {
        function: string;
        args: {value: string|number}[];
    }
    stateChanges?: {
        transfers: {
            address: string;
            amount: number;
            asset: string|null;
        }[]
    };
}

export function leaseTxs(
    sender: string,
    after: string|void,
    sort: string = 'desc',
    limit: number = 100
) {
    return axios.get<IDataServiceResponse>(`${API_URL}transactions/lease`, {
        params: {
            sender,
            sort,
            limit,
            after
        }
    }).then((res) => res.data);
}

export function leaseCancelTxs(
    sender: string,
    after: string|void,
    sort: string = 'desc',
    limit: number = 100
) {
    return axios.get<IDataServiceResponse>(`${API_URL}transactions/lease-cancel`, {
        params: {
            sender,
            sort,
            limit,
            after
        }
    }).then((res) => res.data);
}

export function invokeScriptTxs(
    sender: string,
    dapp: string,
    fn: string,
    after: string|void,
    sort: string = 'desc',
    limit: number = 100
) {
    return axios.get<IDataServiceResponse>(`${API_URL}transactions/invoke-script`, {
        params: {
            sender,
            sort,
            limit,
            after,
            dapp,
            function: fn
        }
    }).then((res) => res.data);
}

export function getTxInfo(txId: string) {
    return axios.get<IDataTransaction>(`${API_NODE_URL}transactions/info/${txId}`).then((res) => res.data);
}