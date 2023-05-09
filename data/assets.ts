export const PUZZLE_ASSET_ID = 'HEB8Qaw9xrWpWs8tHsiATYGBWDBtP2S7kcPALrMu43AS';
export const USDT_PPT_ID = '9wc3LXNA4TEBsXyKtoLE9mrbDD7WMHXvXrCjZvabLAsi';
export const WAVES_ID = 'WAVES';

export const PUZZLE_NAME = 'Puzzle';
export const USD_PPT_NAME = 'USDT PPT';
export const WAVES_NAME = 'Waves';

export type AssetId = typeof PUZZLE_ASSET_ID | typeof USDT_PPT_ID | typeof WAVES_ID;
export type AssetName = typeof PUZZLE_NAME | typeof USD_PPT_NAME | typeof WAVES_NAME;

export type AssetInfo = {
    id: AssetId;
    name: AssetName;
    decimals: number;
}

export const PUZZLE_ASSET: AssetInfo = {
    id: PUZZLE_ASSET_ID,
    name: PUZZLE_NAME,
    decimals: 8
};

export const USDT_PPT_ASSET: AssetInfo = {
    id: USDT_PPT_ID,
    name: USD_PPT_NAME,
    decimals: 6
};

export const WAVES_ASSET: AssetInfo = {
    id: WAVES_ID,
    name: WAVES_NAME,
    decimals: 8
};

export const ASSETS: AssetInfo[] = [
    PUZZLE_ASSET,
    USDT_PPT_ASSET,
    WAVES_ASSET
];

export const ASSETS_MAP: {[x: string]: AssetInfo} = {
    [PUZZLE_ASSET_ID]: PUZZLE_ASSET,
    [USDT_PPT_ID]: USDT_PPT_ASSET,
    [WAVES_ID]: WAVES_ASSET,
};
