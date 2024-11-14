import { AuthenticationState } from '../Types/index';
export declare const useSingleFileAuthState: (filepath: string) => Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
}>;
