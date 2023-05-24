// waves data service

import axios from "axios";
import qs from "querystring";

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
    payment?: {
        amount: number;
        assetId: string;
    }[];
    stateChanges?: {
        transfers: {
            address: string;
            amount: number;
            asset: string|null;
        }[]
    };
}

export function leaseTxs(
    senders: string[],
    after: string|void,
    sort: string = 'desc',
    limit: number = 100
) {
    return axios.get<IDataServiceResponse>(`${API_URL}transactions/lease`, {
        params: {
            senders,
            sort,
            limit,
            after
        },
        paramsSerializer: params => qs.stringify(params)
    }).then((res) => res.data);
}

export function leaseCancelTxs(
    senders: string[],
    after: string|void,
    sort: string = 'desc',
    limit: number = 100
) {
    return axios.get<IDataServiceResponse>(`${API_URL}transactions/lease-cancel`, {
        params: {
            senders,
            sort,
            limit,
            after
        },
        paramsSerializer: params => qs.stringify(params)
    }).then((res) => res.data);
}

export function invokeScriptTxs(
    senders: string[],
    dapp: string,
    fn: string,
    after: string|void,
    sort: string = 'desc',
    limit: number = 100
) {
    return axios.get<IDataServiceResponse>(`${API_URL}transactions/invoke-script`, {
        params: {
            senders,
            sort,
            limit,
            after,
            dapp,
            function: fn
        },
        paramsSerializer: params => qs.stringify(params)
    }).then((res) => res.data);
}

export function getTxInfo(txId: string) {
    return axios.get<IDataTransaction>(`${API_NODE_URL}transactions/info/${txId}`).then((res) => res.data);
}