class AnalytifySDK {
    private static instance: AnalytifySDK;
    private clientId: string = '';
    private apiBaseUrl: string = 'https://api.analytify.com';
  
    private constructor() {}
  
    static init(config: { clientId: string; apiBaseUrl?: string }): AnalytifySDK {
      if (!AnalytifySDK.instance) {
        AnalytifySDK.instance = new AnalytifySDK();
        AnalytifySDK.instance.clientId = config.clientId;
        if (config.apiBaseUrl) {
          AnalytifySDK.instance.apiBaseUrl = config.apiBaseUrl;
        }
      }
      return AnalytifySDK.instance;
    }
  
    loadDashboard(options: {
      dashboardId: string;
      container: string | HTMLElement;
      width?: string;
      height?: string;
    }): void {
      const container = typeof options.container === 'string' 
        ? document.querySelector(options.container) 
        : options.container;
  
      if (!container) {
        throw new Error('Container element not found');
      }
  
      const iframe = document.createElement('iframe');
      const publicDashboardId = btoa(options.dashboardId.toString());
    // this.dashboardUrl = `https://qa.insightapps.ai/public/dashboard/${publicDashboardId}`;
      iframe.src = `https://qa.insightapps.ai:/public/dashboard/MTU4NQ==`;
      iframe.style.border = 'none';
      iframe.style.width = options.width || '100%';
      iframe.style.height = options.height || '100%';
  
      container.innerHTML = '';
      container.appendChild(iframe);
    }
  }
  
  // Global variable for CDN users
  if (typeof window !== 'undefined') {
    (window as any).Analytify = AnalytifySDK;
  }
  
  export default AnalytifySDK;