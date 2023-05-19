import { ReactElement } from 'react';
import BuyAsset from './BuyAsset';
import BuyAndStakePuzzle from './BuyAndStakePuzzle';
import LeaseWaves from './LeaseWaves';
import { IDataTransaction } from '@/utils/wdsApi';

export interface ITaskProps {
    name: string;
    hint?: string;
    viewProps?: {[x: string]: string};
    userActions?: {[x: string]: IDataTransaction[]};
    onClickX?(): void;
    onDataChange?(value: string): void;
}

export {default as BuyAsset} from './BuyAsset';

export const Tasks = [{
    id: 'buy-asset-puzzle-swap',
    name: 'Buy Asset',
    hint: 'Buy the specified number of tokens on Puzzle Swap and keep them until the end of the contest'
}, {
    id: 'buy-and-stake-puzzle',
    name: 'Stake Puzzle',
    hint: 'Buy and staker the specified number of tokens on Puzzle Swap and keep them until the end of the contest'
}, {
    id: 'lease-waves',
    name: 'Lease Waves',
    hint: 'Lease tokens to the specified node address'
}];

export const getTask = (id: string, props: ITaskProps): ReactElement => {
    switch (id) {
        case 'buy-asset-puzzle-swap':
            return <BuyAsset {...props}/>
        case 'buy-and-stake-puzzle':
            return <BuyAndStakePuzzle {...props}/>
        case 'lease-waves':
            return <LeaseWaves {...props}/>
    }

    return <></>;
}