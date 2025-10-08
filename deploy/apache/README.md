# Apache Hardening Guidance

This configuration complements the Angular fixes by addressing the infrastructure findings that Qualys reported:

- **Redirect HTTP to HTTPS** and enable HSTS to resolve QID 150263.
- **Deny access to `/errors/`** and disable indexing to close QID 150004.
- **Add anti-clickjacking headers** and tighten CSP to mitigate QID 150124.
- **Hide server version tokens** to remediate QID 150520.

## Deployment

1. Copy `security-hardening.conf` to `/etc/apache2/conf-available/security-hardening.conf` (Ubuntu) or the equivalent directory on your platform.
2. Enable the configuration:

   ```bash
   sudo a2enconf security-hardening
   sudo systemctl reload apache2
   ```

3. Ensure `mod_headers` and `mod_rewrite` are enabled:

   ```bash
   sudo a2enmod headers rewrite
   sudo systemctl reload apache2
   ```

4. If the site is behind a load balancer or CDN, verify that HTTPS termination still sets the `HTTPS` environment variable for HSTS.

## Validation

After deployment, re-run the Qualys scan. You should observe:

- HTTP requests are redirected to HTTPS with a `301` status.
- `/errors/` responds with `404`.
- Response headers include `X-Frame-Options: DENY` and `Content-Security-Policy: frame-ancestors 'none'`.
- The `Server` header exposes only `Apache` without the version string.
- `Strict-Transport-Security` header is present.

