import {Signer} from '@waves/signer';
import {ProviderWeb} from '@waves.exchange/provider-web';
// import {libs} from '@waves/waves-transactions';

export const getSigner = (provider: 'web' = 'web'): Signer => {
    const signer = new Signer();
    switch (provider) {
        case 'web':
            signer.setProvider(new ProviderWeb());
    }

    return signer;
}