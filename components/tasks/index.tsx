import BuyAsset from './BuyAsset';

export {default as BuyAsset} from './BuyAsset';

export const Tasks = [{
    id: 'buy-asset',
    name: 'Buy Asset',
    component: (props: any) => <BuyAsset {...props} />
}];