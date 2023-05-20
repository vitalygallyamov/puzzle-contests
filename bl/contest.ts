import { ApiBase, ContestAddress } from '@/data/common';
import { invoke } from '@/utils/signer';
import {Signer, InvokeArgs} from '@waves/signer';
import { nodeInteraction } from '@waves/waves-transactions';

export interface IContestData {
    id: string;
    name: string;
    desc: string;
    endHeight: number;
    startHeight: number;
    endDate: number;
    prizeFund: string[];
    owner: string;
    tasks: string[];
    status: string;
    participantsCount: number;
    participants?: string[];
}

/**
 * Call contact fn for create contest 
 * @param signer 
 * @param name 
 * @param desc 
 * @param endDate 
 * @param prizeFund 
 */
export async function create(
        signer: Signer,
        name: string,
        desc: string,
        endDate: Date,
        tasks: string[],
        prizeFund: InvokeArgs['payment']
    ) {
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
            }, {
                type: 'list',
                value: tasks.map((t) => {
                    return {type: 'string', value: t};
                })
            }]
        },
        payment: prizeFund
    });
}

export async function participate(
    signer: Signer,
    id: string
) {
    return invoke(signer, {
        dApp: ContestAddress,
        call: {
            function: 'participate',
            args: [{
                type: 'string',
                value: id
            }]
        }
    });
}

export async function unparticipate(
    signer: Signer,
    id: string
) {
    return invoke(signer, {
        dApp: ContestAddress,
        call: {
            function: 'unparticipate',
            args: [{
                type: 'string',
                value: id
            }]
        }
    });
}

export async function chooseWinner(
    signer: Signer,
    id: string,
    addresses: string[]
) {
    return invoke(signer, {
        dApp: ContestAddress,
        call: {
            function: 'chooseWinner',
            args: [{
                type: 'string',
                value: id
            }, {
                type: 'list',
                value: addresses.map((t) => {
                    return {type: 'string', value: t};
                })
            }]
        }
    });
}

/**
 * Get all contests data
 */
export async function getAll() {
    const data = await nodeInteraction.accountData({
        address: ContestAddress,
        match: new RegExp('contest_(.*)')
    }, ApiBase);

    const curHeight = await nodeInteraction.currentHeight(ApiBase);
    const curDate = new Date();

    const contests: {[x: string]: IContestData} = {};  

    Object.keys(data).forEach((key) => {
        const [, id, field] = key.split('_');
        if (!contests[id]) {
            contests[id] = {
                id,
                name: '',
                desc: '',
                startHeight: 0,
                endHeight: 0,
                endDate: 0,
                prizeFund: [],
                owner: '',
                tasks: [],
                participantsCount: 0,
                participants: [],
                status: ''
            };
        }
        if (data[key].value !== undefined && id && contests[id]) {
            if (field === 'name') contests[id][field] = data[key].value as string;
            else if (field === 'desc') contests[id][field] = data[key].value as string;
            else if (field === 'owner') contests[id][field] = data[key].value as string;
            else if (field === 'status') contests[id][field] = data[key].value as string;
            else if (field === 'participantsCount') contests[id][field] = data[key].value as number;
            else if (field === 'startHeight') contests[id][field] = data[key].value as number;
            else if (field === 'prizeFund') {
                const list = (data[key].value as string).split('|');
                contests[id][field] = list;
            }
            else if (field === 'tasks') {
                const list = (data[key].value as string).split(';');
                contests[id][field] = list;
            }
            else if (field === 'endHeight') {
                const endH = data[key].value as number;
                contests[id][field] = endH;
                contests[id].endDate = curDate.getTime() + ((endH - curHeight) * 60000);
            }
        }
    });
    
    return Object.keys(contests).map(id => contests[id]);
};

/**
 * Get contest data by ID
 */
export async function getById(contestId: string) {
    const data = await nodeInteraction.accountData({
        address: ContestAddress,
        match: new RegExp(`contest_${contestId}_(.*)`)
    }, ApiBase);

    const curHeight = await nodeInteraction.currentHeight(ApiBase);
    const curDate = new Date();

    const contest: IContestData = {
        id: contestId,
        name: '',
        desc: '',
        startHeight: 0,
        endHeight: 0,
        endDate: 0,
        prizeFund: [],
        owner: '',
        tasks: [],
        participantsCount: 0,
        participants: [],
        status: ''
    };  

    Object.keys(data).forEach((key) => {
        const [, id, field] = key.split('_');
        if (data[key].value !== undefined && id) {
            if (field === 'name') contest[field] = data[key].value as string;
            else if (field === 'desc') contest[field] = data[key].value as string;
            else if (field === 'owner') contest[field] = data[key].value as string;
            else if (field === 'status') contest[field] = data[key].value as string;
            else if (field === 'participantsCount') contest[field] = data[key].value as number;
            else if (field === 'startHeight') contest[field] = data[key].value as number;
            else if (field === 'prizeFund') {
                const list = (data[key].value as string).split('|');
                contest[field] = list;
            }
            else if (field === 'tasks') {
                const list = (data[key].value as string).split(';');
                contest[field] = list;
            }
            else if (field === 'endHeight') {
                const endH = data[key].value as number;
                contest[field] = endH;
                contest.endDate = curDate.getTime() + ((endH - curHeight) * 60000);
            }
            else if (field === 'participant') {
                const [, , , account, accField] = key.split('_');
                if (accField === 'address') {
                    contest.participants?.push(data[key].value as string);
                }
            }
        }
    });
    
    return contest;
};