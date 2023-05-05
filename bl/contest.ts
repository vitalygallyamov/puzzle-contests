import { ApiBase, ContestAddress } from '@/data/common';
import { invoke } from '@/utils/signer';
import {Signer, InvokeArgs} from '@waves/signer';
import { nodeInteraction } from '@waves/waves-transactions';

/**
 * Call contact fn for create contest 
 * @param signer 
 * @param name 
 * @param desc 
 * @param endDate 
 * @param prizeFound 
 */
export async function create(signer: Signer, name: string, desc: string, endDate: Date, prizeFound: InvokeArgs['payment']) {
    const curHeight = await nodeInteraction.currentHeight(ApiBase);
    const curDate = new Date();
    return invoke(signer, {
        dApp: ContestAddress,
        call: {
            function: 'create',
            args: [{
                type: 'string',
                value: name
            }, {
                type: 'string',
                value: desc
            }, {
                type: 'integer',
                value: curHeight + Math.floor((endDate.getTime() - curDate.getTime()) / 60000)
            }]
        },
        payment: prizeFound
    });
}