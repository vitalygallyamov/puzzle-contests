import { createContext } from 'react';

import {Signer, UserData} from '@waves/signer';

export interface IAuthData {
    userData?: UserData | void;
    signer?: Signer|void;
    isLogin: boolean;
}

export interface ISignerContext {
    authData: IAuthData,
    setAuthData?: (value: IAuthData) => void;
}

export const SignerContext = createContext<ISignerContext>({authData: {isLogin: false}});