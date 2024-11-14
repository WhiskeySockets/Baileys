import { Store } from 'cache-manager';
import { AuthenticationCreds } from '../Types';
declare const makeCacheManagerAuthState: (store: Store, sessionKey: string) => Promise<{
    clearState: () => Promise<void>;
    saveCreds: () => Promise<void>;
    state: {
        creds: AuthenticationCreds;
        keys: {
            get: (type: string, ids: string[]) => Promise<{}>;
            set: (data: any) => Promise<void>;
        };
    };
}>;
export default makeCacheManagerAuthState;
