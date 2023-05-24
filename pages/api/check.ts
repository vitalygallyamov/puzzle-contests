import { IContestData, getById } from '@/bl/contest';
import { PUZZLE_ASSET, PUZZLE_ASSET_ID } from '@/data/assets';
import { PuzzleStakeDapp, PuzzleSwapDapp, PuzzleSwapDapp2 } from '@/data/common';
import { IDataServiceResponse, IDataTransaction, getTxInfo, invokeScriptTxs, leaseCancelTxs, leaseTxs } from '@/utils/wdsApi';
import type { NextApiRequest, NextApiResponse } from 'next';

function compareHeight(a: any, b: any) {
    if (a.height < b.height) {
        return -1;
    }
    if (a.height > b.height) {
        return 1;
    }
    return 0;
}

async function checkTask(contest: IContestData, task: string, addresses: string[]) {
    const {startHeight, endHeight} = contest;
    const taskInfo: {[x: string]: string} = {};
    task.split('|').map(s => {
        const [field, value] = s.split(':');
        taskInfo[field] = value;
    });

    const res: {[x: string]: IDataTransaction[]} = {};

    switch(taskInfo.id) {
        case 'lease-waves':
            if (addresses.length) {
                let isLastPage = false;
                let lastCursor;
                let data = [];
                let stopChecking = false;
                while(!stopChecking && !isLastPage) {
                    ({data, isLastPage, lastCursor} = await leaseTxs(addresses, lastCursor));
                    for (let j = 0; j < data.length; j++) {
                        const {height, recipient, type, sender} = data[j].data;
                        if (height >= startHeight && height <= endHeight && type === 8) {
                            if (recipient === taskInfo.nodeAddress) {
                                if (!res[sender]) {
                                    res[sender] = [];
                                }
                                res[sender].push(data[j].data);
                            }
                        } else {
                            stopChecking = true;
                            break;
                        }
                    }
                }

                isLastPage = false;
                lastCursor = undefined;
                data = [];
                stopChecking = false;
                while(!stopChecking && !isLastPage) {
                    ({data, isLastPage, lastCursor} = await leaseCancelTxs(addresses, lastCursor));
                    for (let j = 0; j < data.length; j++) {
                        const {height, type, leaseId, sender} = data[j].data;
                        if (height >= startHeight && height <= endHeight && leaseId && type === 9) {
                            res[sender] = [...res[sender].filter(item => item.id !== leaseId)];
                        } else {
                            stopChecking = true;
                            break;
                        }
                    }
                }
            }
            break;
        case 'buy-asset-puzzle-swap':
            if (addresses.length) {
                let isLastPage = false;
                let lastCursor;
                let data: IDataServiceResponse['data'] = [];
                let stopChecking = false;
                while(!stopChecking && !isLastPage) {
                    ({data, isLastPage, lastCursor} = await invokeScriptTxs(addresses, PuzzleSwapDapp, 'swap', lastCursor));
                    for (let j = 0; j < data.length; j++) {
                        const {height, type, id, sender} = data[j].data;
                        if (height >= startHeight && height <= endHeight && type === 16) {
                            let assetExist = false;
                            data[j].data.call?.args.forEach(arg => {
                                if (typeof arg.value === 'string' && arg.value.endsWith(taskInfo.assetId)) {
                                    assetExist = true;
                                }
                            });
                            if (assetExist) {
                                const txInfo = await getTxInfo(id);
                                txInfo.stateChanges?.transfers?.forEach((transfer) => {
                                    if (
                                        transfer.address === sender &&
                                        transfer.amount >= parseInt(taskInfo.amount, 10) &&
                                        transfer.asset === PUZZLE_ASSET_ID
                                    ) {
                                        if (!res[sender]) {
                                            res[sender] = [];
                                        }
                                        res[sender].push({...data[j].data, stateChanges: txInfo.stateChanges});
                                    }
                                });
                            }
                        } else {
                            stopChecking = true;
                            break;
                        }
                    }
                }

                isLastPage = false;
                lastCursor = undefined;
                data = [];
                stopChecking = false;
                while(!stopChecking && !isLastPage) {
                    ({data, isLastPage, lastCursor} = await invokeScriptTxs(addresses, PuzzleSwapDapp2, 'swap', lastCursor));
                    for (let j = 0; j < data.length; j++) {
                        const {height, type, id, sender} = data[j].data;
                        if (height >= startHeight && height <= endHeight && type === 16) {
                            let assetExist = false;
                            data[j].data.call?.args.forEach(arg => {
                                if (typeof arg.value === 'string' && arg.value.endsWith(taskInfo.assetId)) {
                                    assetExist = true;
                                }
                            });
                            if (assetExist) {
                                const txInfo = await getTxInfo(id);
                                txInfo.stateChanges?.transfers?.forEach((transfer) => {
                                    if (
                                        transfer.address === sender &&
                                        transfer.amount >= parseInt(taskInfo.amount, 10) &&
                                        transfer.asset === PUZZLE_ASSET_ID
                                    ) {
                                        if (!res[sender]) {
                                            res[sender] = [];
                                        }
                                        res[sender].push({...data[j].data, stateChanges: txInfo.stateChanges});
                                    }
                                });
                            }
                        } else {
                            stopChecking = true;
                            break;
                        }
                    }
                }
            }
            break;
        case 'buy-and-stake-puzzle':
        case 'stake-puzzle':
            if (addresses.length) {
                let isLastPage = false;
                let lastCursor;
                let data: IDataServiceResponse['data'] = [];
                let stopChecking = false;
                while(!stopChecking && !isLastPage) {
                    ({data, isLastPage, lastCursor} = await invokeScriptTxs(addresses, PuzzleStakeDapp, 'stake', lastCursor));
                    for (let j = 0; j < data.length; j++) {
                        const {height, type, sender} = data[j].data;
                        if (height >= startHeight && height <= endHeight && type === 16) {
                            data[j].data.payment?.forEach(p => {
                                if ((p.amount * Math.pow(10, PUZZLE_ASSET.precision)) >= parseInt(taskInfo.amount, 10) && p.assetId === PUZZLE_ASSET.id) {
                                    if (!res[sender]) {
                                        res[sender] = [];
                                    }
                                    res[sender].push(data[j].data);
                                }
                            });
                        } else {
                            stopChecking = true;
                            break;
                        }
                    }
                }

                isLastPage = false;
                lastCursor = undefined;
                data = [];
                stopChecking = false;
                while(!stopChecking && !isLastPage) {
                    ({data, isLastPage, lastCursor} = await invokeScriptTxs(addresses, PuzzleStakeDapp, 'unStake', lastCursor));
                    for (let j = 0; j < data.length; j++) {
                        const {height, type, sender} = data[j].data;
                        if (height >= startHeight && height <= endHeight && type === 16) {
                            if (res[sender]) {
                                res[sender].push(data[j].data);
                            }
                        } else {
                            stopChecking = true;
                            break;
                        }
                    }
                }
            }
            break; 
    }

    // sort
    Object.keys(res).forEach(address => {
        res[address].sort(compareHeight);
    });

    return res;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if (typeof req.query?.id === 'string' && req.query?.id) {
        const contest = await getById(req.query?.id)
        const {status, tasks, participants} = contest;
        const result: {[x: string]: {}} = {};
        if (status === 'active' && tasks.length && participants?.length) {
            for (let i = 0; i < tasks.length; i++) {
                const data = await checkTask(contest, tasks[i], participants);
                if (data) {
                    result[tasks[i]] = data;
                }
            }
        }
        res.status(200).json(result)
    } else {
        res.status(404).json({})
    }
}
