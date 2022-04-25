# muni-portal-frontend

Frontend to the Cape Agulhas Municipality Progressive Web App.

Production: https://app.capeagulhas.gov.za
Sandbox: https://sandbox--cape-agulhas-app.netlify.app
Staging: https://staging--cape-agulhas-app.netlify.app

ES6 and Webflow.

[Webflow Export Changelog](https://app.gitbook.com/@openup/s/cape-agulhas-app/design-system/webflow-exports)
[Import webflow exports](https://www.npmjs.com/package/import-webflow-export) as follows when there are updates.

    yarn run import-webflow zipfile.zip

[Webflow interactions on cloned components](https://openup.gitbook.io/handbook/tech/webflow-best-practice/custom-dom-manipulation-in-webflow-sites#webflow-interactions-on-cloned-components)

## Development environment

1. Install dependencies by running `yarn`
2. Start a development server by running `yarn dev`

> NOTE: If you want to use Pushpad in development, set the environment variable `PUSHPAD_PROJECT_ID` to `7571` (development project id)

### Service Worker in development environment

The above does not include the service worker so, if you are working on a piece of functionality that requires the service worker, the workflow is a bit different.

With the dependencies installed, run the following:

```
yarn start
```

> NOTE: The downside of the above is that hot module reloading is not supported in this mode. This means that when you make a change to your code, you will have to stop the above process (by pressing ctrl + c), and then run the above command again.

Please use the [airbnb styleguide](https://github.com/airbnb/javascript) and lint with

```
yarn lint`
```

## HTTPS in Dev

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

## Configuration

The build is configured using environment variables.

| Variable                | Default                              | Description                                                                                                       |
| ----------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| CONTEXT                 | unset                                | Configured by Netlify: Name of the build’s deploy context. It can be production, deploy-preview or branch-deploy. |
| NODE_ENV                | `production` if using `parcel build` |                                                                                                                   |
| SENTRY_DSN              | unset                                | Required in production, staging and sandbox environment                                                           |
| SENTRY_PERF_SAMPLE_RATE | unset                                | Sentry performance sampling rate. Only required in production                                                     |
| GOOGLE_TAG_MANAGER_ID   | unset                                | ID for Google Tag Manager. Only required in production environment                                                |
| DEFAULT_API_URL         | unset                                | The default backend API URL. Can be overridden by adding `?promptapi` in the address bar                          |
| ENVIRONMENT             | unset                                | E.g. `production`, `staging`, `sandbox`                                                                           |
| PUSHPAD_PROJECT_ID      | unset                                | The project ID for Pushpad. For development, use `7571`. If not set, pushpad will not initialise.                 |
| MAPBOX_TOKEN      | unset                                | The token used by the map on service requests. If not set, the map will not load.                 |

## Running Lighthouse Tests Locally

As part of our CI we run Lighthouse tests against the progressive web app category of tests to ensure we meet the `minScore` of 1 and do not regress between pull requests. If your pull request build failed due to the Lighthouse tests, it's often easier to diagnose if you run the tests locally.

To do so, run the following in your terminal:

```
npx lhci autorun
```

## Deployment

### Master

All updates to `master` will automatically deploy to the production instance on Netlify.

> NOTE: Do not merge into master if you are not ready for it to be deployed to production!
> If you want to merge a breaking change on the backend and co-ordinate with the frontend deployment,
> merge and deploy the backend changes _before_ merging the frontend changes.

### Staging and Sandbox

There is also a `staging` and `sandbox` branch. Whenever new commits are merged into `master`, `master` must then be
merged into `sandbox` so that the two branches are in identical states.

All new commits pushed to `sandbox` and `staging` will automatically update their respective branch deploys on Netlify.

`sandbox` is a production-like environment where users can experiment, train and interact without affecting production
data.

`staging` allows us to test new features and other changes 'in the wild' before deploying to production.