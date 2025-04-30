class AnalytifySDK {
    constructor() {
        this.clientId = '';
        this.apiBaseUrl = 'https://api.analytify.com';
    }
    static init(config) {
        if (!AnalytifySDK.instance) {
            AnalytifySDK.instance = new AnalytifySDK();
            AnalytifySDK.instance.clientId = config.clientId;
            if (config.apiBaseUrl) {
                AnalytifySDK.instance.apiBaseUrl = config.apiBaseUrl;
            }
        }
        return AnalytifySDK.instance;
    }
    loadDashboard(options) {
        const container = typeof options.container === 'string'
            ? document.querySelector(options.container)
            : options.container;
        if (!container) {
            throw new Error('Container element not found');
        }
        const iframe = document.createElement('iframe');
        const publicDashboardId = btoa(options.dashboardId.toString());
        // this.dashboardUrl = `https://qa.insightapps.ai/public/dashboard/${publicDashboardId}`;
        iframe.src = `https://qa.insightapps.ai/public/dashboard/${publicDashboardId}`;
        iframe.style.border = 'none';
        iframe.style.width = options.width || '100%';
        iframe.style.height = options.height || '100%';
        container.innerHTML = '';
        container.appendChild(iframe);
    }
}
// Global variable for CDN users
if (typeof window !== 'undefined') {
    window.Analytify = AnalytifySDK;
}

/*
 * Public API Surface of analytify-dashboard
 */
// export * from './lib/analytify-dashboard.service';
// export * from './lib/analytify-dashboard.component';
// export * from './lib/analytify-dashboard.module';
// export * from './lib/dashboard/dashboard/dashboard.component';

/**
 * Generated bundle index. Do not edit.
 */
//# sourceMappingURL=analytify-dashboard.mjs.map
