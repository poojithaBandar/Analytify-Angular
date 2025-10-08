# Qualys Remediation Playbook

This playbook implements the controls required to clear all findings reported in the Qualys WAS scan executed on 7 Oct 2025 against `qa.insightapps.ai`.

## Summary of fixes

| QID | Title | Remediation owner | Implementation artifact |
| --- | ----- | ----------------- | ----------------------- |
| 150622 | Suspected Path Manipulation / Directory Listing | Web server config | [`src/.htaccess`](../src/.htaccess) disables directory indexing. |
| 152103 | Apache HTTP Server Prior to 2.4.60 | Platform/DevOps | Upgrade Apache to 2.4.60 or later using the procedure below. |
| 150124 | Clickjacking – Framable Page | Application & Web server | Security headers added in [`src/.htaccess`](../src/.htaccess). |
| 150150 | Password Form Served over HTTP | Web server config | HTTPS redirect and HSTS in [`src/.htaccess`](../src/.htaccess). |
| 150263 | Insecure Transport | Web server config | HTTPS redirect and HSTS in [`src/.htaccess`](../src/.htaccess). |
| 150520 | Web Server Information Disclosure | Platform/DevOps | Header hardening steps below. |

## Deployment instructions

1. **Deploy the updated Single Page Application**
   ```bash
   npm ci
   npm run build
   rsync -avz dist/InsightApps-Angular/browser/ <apache_user>@<server>:/var/www/qa.insightapps.ai/
   ```
   The build output now contains the hardened [`src/.htaccess`](../src/.htaccess) which must reside in the web root so Apache honours the new rules.

2. **Upgrade Apache HTTP Server to 2.4.60 or later (QID 152103)**
   ```bash
   sudo apt update
   sudo apt install --only-upgrade apache2
   apache2 -v   # confirm Server version: Apache/2.4.60 or newer
   ```
   For systems using the `ppa:ondrej/apache2` repository ensure it is enabled before running the upgrade. After upgrading, restart the service and confirm successful start-up:
   ```bash
   sudo systemctl restart apache2
   sudo systemctl status apache2
   ```
   If UNC paths are required, configure the new [`UNCList`](https://httpd.apache.org/docs/2.4/mod/core.html#unclist) directive inside the relevant `<Directory>` blocks.

3. **Harden Apache response headers (QID 150520)**
   Append the following to `/etc/apache2/conf-available/security.conf` and reload Apache:
   ```apache
   ServerTokens Prod
   ServerSignature Off
   Header always unset X-Powered-By
   Header edit Set-Cookie ^(.*)$ $1;Secure;HttpOnly;SameSite=Lax
   ```
   Enable `mod_headers` if it is not already active:
   ```bash
   sudo a2enmod headers
   sudo systemctl reload apache2
   ```

4. **Enforce HTTPS and HSTS (QIDs 150150 & 150263)**
   The `.htaccess` shipped with the SPA introduces a permanent redirect from HTTP to HTTPS and emits an HSTS policy. Ensure port 80 continues to forward traffic to the same Apache virtual host so the redirect executes. After deployment, run:
   ```bash
   curl -I http://qa.insightapps.ai/authentication/login
   curl -I https://qa.insightapps.ai/authentication/login
   ```
   Confirm the HTTP response is `301` to `https://…` and the HTTPS response includes `Strict-Transport-Security`.

5. **Confirm clickjacking mitigations (QID 150124)**
   Validate that every login-related endpoint now contains the `X-Frame-Options: DENY` header:
   ```bash
   for path in / /authentication /authentication/login /authentication/register /authentication/forgot-password; do
     curl -Is https://qa.insightapps.ai${path} | grep -i "x-frame-options"
   done
   ```
   The command must output `X-Frame-Options: DENY` for each path.

6. **Verify directory listing is disabled (QID 150622)**
   ```bash
   curl -I https://qa.insightapps.ai/media/internet/
   ```
   Expect a `403 Forbidden` (or application specific response) without any file listing. The `Options -Indexes` directive in `.htaccess` enforces this.

7. **Regression scan**
   After applying the steps above, re-run the Qualys WAS scan profile originally used (`WAS Scan Report 7 Oct 2025`) and confirm it returns `0` open findings.

## Change log

- 2025-03-XX: Initial remediation plan authored after Qualys ticket 133008861.
