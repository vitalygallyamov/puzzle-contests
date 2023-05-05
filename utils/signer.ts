import {InvokeArgs, Signer} from '@waves/signer';
import {ProviderWeb} from '@waves.exchange/provider-web';
import {waitForTx} from '@waves/waves-transactions';
import { ApiBase } from '@/data/common';

export const getSigner = (provider: 'web' = 'web'): Signer => {
    const signer = new Signer();
    switch (provider) {
        case 'web':
            signer.setProvider(new ProviderWeb());
    }

    return signer;
}

export const invoke = async (signer: Signer, args: InvokeArgs) => {
    const tx:any = await signer.invoke(args).broadcast();

    const txStatus = await waitForTx(tx.id, {apiBase: ApiBase});
    console.log(txStatus);
    return txStatus;
}