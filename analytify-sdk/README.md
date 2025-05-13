 # Analytify SDK
 
 Analytify SDK for embedding dashboards and sheets via iframe.
 
 ## Installation

 Using npm:
 ```
 npm install analytify-sdk
 ```
 Using Yarn:
 ```
 yarn add analytify-sdk
 ```
 
 ## Build (for contributors)

 ```bash
 cd analytify-sdk
 npm install
 npm run build
 ```
 
 ## Usage
 
 ### ES Module

 ```js
 import AnalytifySDK from 'analytify-sdk';
 
 // Initialize SDK
 AnalytifySDK.init({
   clientId: 'your-client-id',
   clientSecret: 'your-client-secret',
   apiBaseUrl: 'https://your.api.base.url'
 });
 
 // Embed a dashboard
 AnalytifySDK.loadDashboard({
   dashboardToken: 'dashboard-token',
   container: '#dashboard',
   filters: { key: 'value' },
   width: '800px',
   height: '600px'
 });
 
 // Embed a sheet
 AnalytifySDK.embedSheet({
   sheetToken: 'sheet-token',
   container: document.getElementById('sheet-container'),
   width: '100%',
   height: '500px'
 });
 ```
 
 ### CommonJS

 ```js
 const { init, loadDashboard, embedSheet } = require('analytify-sdk');
 ```
 
 ### UMD / Browser

 Include via a script tag:

 ```html
 <script src="https://unpkg.com/analytify-sdk/dist/analytify-sdk.umd.js"></script>
 <script>
   AnalytifySDK.init({
     clientId: 'your-client-id',
     clientSecret: 'your-client-secret',
     apiBaseUrl: 'https://your.api.base.url'
   });
   // ...
 </script>
 ```