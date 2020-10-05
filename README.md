# muni-portal-frontend

Frontend to the Cape Agulhas Municipality app


## Development environment

1. Install dependencies by running `yarn`
2. Build the static assets by running `yarn build`
3. Start a development server by running `yarn serve`

`parcel-plugin-sw-cache` does not support hot reloading so you have to `yarn build` each time you want to see code changes reflected in the locally-served site.


### HTTPS in Dev

You need a CA and server certificate to serve the site over https in your
development environment.

This is needed e.g. for Lighthouse to pass when things like Google Fonts
does remote requests using the same scheme as the app itself.

You can set this up easily using the [mkcert](https://mkcert.org/) utility.

1. Ensure `mkcert` is installed
2. Install the CA cert with `mkcert -install`
3. Create the server certificate
4. Run the dev server with TLS enabled with `yarn serve-https`

Keep your computer safe - ensure no one can access your CA certificate - if they
can, they are much closer to performing a man-in-the-middle attack on you.
