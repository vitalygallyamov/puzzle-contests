import { FunctionComponentElement, ReactElement, createElement } from 'react';
import BuyAsset from './BuyAsset';
import StakePuzzle from './StakePuzzle';
import StakeWaves from './StakeWaves';

export interface ITaskProps {
    name: string;
    onClickX(): void;
}

export {default as BuyAsset} from './BuyAsset';

export const Tasks = [{
    id: 'buy-asset',
    name: 'Buy Asset'
}, {
    id: 'stake-puzzle',
    name: 'Stake Puzzle'
}, {
    id: 'stake-waves',
    name: 'Stake Waves'
}];

export const getTask = (id: string, props: ITaskProps): ReactElement => {
    switch (id) {
        case 'buy-asset':
            return <BuyAsset {...props}/>
        case 'stake-puzzle':
            return <StakePuzzle {...props}/>
        case 'stake-waves':
            return <StakeWaves {...props}/>
    }

    return <></>;
}