import AssetsList, { IAssetItem } from './allAssetsList';
export const WAVES_ID = 'WAVES';
export const PUZZLE_ASSET_ID = 'HEB8Qaw9xrWpWs8tHsiATYGBWDBtP2S7kcPALrMu43AS';
export const USDT_PPT_ID = '9wc3LXNA4TEBsXyKtoLE9mrbDD7WMHXvXrCjZvabLAsi';
export const EGG_ID = 'C1iWsKGqLwjHUndiQ7iXpdmPum9PeCDFfyXBdJJosDRS';

export const WAVES_NAME = 'Waves';
export const PUZZLE_NAME = 'Puzzle';
export const USD_PPT_NAME = 'USDT';
export const EGG_NAME = 'EGG';

export type AssetId = typeof PUZZLE_ASSET_ID | typeof USDT_PPT_ID | typeof WAVES_ID;
export type AssetName = typeof PUZZLE_NAME | typeof USD_PPT_NAME | typeof WAVES_NAME;

export const PUZZLE_ASSET: IAssetItem = AssetsList.find(item => item.id === PUZZLE_ASSET_ID) as IAssetItem;
export const USDT_PPT_ASSET: IAssetItem = AssetsList.find(item => item.id === USDT_PPT_ID) as IAssetItem;
export const WAVES_ASSET: IAssetItem = AssetsList.find(item => item.id === WAVES_ID) as IAssetItem;
export const EGG_ASSET: IAssetItem = AssetsList.find(item => item.id === EGG_ID) as IAssetItem;

export const ASSETS: IAssetItem[] = AssetsList;

const assetMap: {[x: string]: IAssetItem} = {};
AssetsList.forEach((item) => {
    assetMap[item.id] = item;
})

export const ASSETS_MAP = assetMap;
