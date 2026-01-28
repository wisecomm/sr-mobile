export { };

declare global {
    interface Window {
        AndroidBridge?: {
            logout: () => void;
        };
    }
}
