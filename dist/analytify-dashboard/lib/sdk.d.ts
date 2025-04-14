declare class AnalytifySDK {
    private static instance;
    private clientId;
    private apiBaseUrl;
    private constructor();
    static init(config: {
        clientId: string;
        apiBaseUrl?: string;
    }): AnalytifySDK;
    loadDashboard(options: {
        dashboardId: string;
        container: string | HTMLElement;
        width?: string;
        height?: string;
    }): void;
}
export default AnalytifySDK;
