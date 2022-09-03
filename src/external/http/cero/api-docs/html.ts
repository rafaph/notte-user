export const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="/api-docs/static/swagger-ui.css" />
    <link rel="stylesheet" type="text/css" href="/api-docs/static/index.css" />
    <link rel="icon" type="image/png" href="/api-docs/static/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="/api-docs/static/favicon-16x16.png" sizes="16x16" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="/api-docs/static/swagger-ui-bundle.js" charset="UTF-8"> </script>
    <script src="/api-docs/static/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
    <script>
      window.onload = function() {
        window.ui = SwaggerUIBundle({
          url: "/api-docs/docs.json",
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          validatorUrl: null
        });
      };
    </script>
  </body>
</html>
`.trim();
