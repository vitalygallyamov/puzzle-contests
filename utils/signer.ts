import {InvokeArgs, Signer} from '@waves/signer';

import {waitForTx} from '@waves/waves-transactions';
import {ApiBase} from '@/data/common';

export const getSigner = async (provider: 'web' | 'email' | 'keeper'): Promise<Signer> => {
    const signer = new Signer();
    switch (provider) {
        case 'web':
            const {ProviderWeb} = await import('@waves.exchange/provider-web');
            signer.setProvider(new ProviderWeb());
            break;
        case 'email':
            const {ProviderCloud} = await import('@waves.exchange/provider-cloud');
            signer.setProvider(new ProviderCloud());
            break;
        case 'keeper':
            const {ProviderKeeper} = await import('@waves/provider-keeper');
            signer.setProvider(new ProviderKeeper());
            break;
    }

    return signer;
}

export const invoke = async (signer: Signer, args: InvokeArgs, beforeWaitCb?: () => void) => {
    const tx:any = await signer.invoke(args).broadcast();
    beforeWaitCb?.();
    const txStatus = await waitForTx(tx.length ? tx[0].id : tx.id, {apiBase: ApiBase});
    return txStatus;
}