# muni-portal-frontend

Frontend to the Cape Agulhas Municipality Progressive Web App.

ES6 and Webflow.

[Import webflow exports](https://www.npmjs.com/package/import-webflow-export) as follows when there are updates.

    yarn run import-webflow zipfile.zip

## Development environment

1. Install dependencies by running `yarn`
2. Start a development server by running `yarn dev`

The above does not include the service worker so, if you are working on a piece of functionality that requires the service worker, the workflow is a bit different.

With the dependencies installed, ensure that you have a `.env` file in the root of your project with the following entry:

```
NODE_ENV="production"
```

Now run the following:

```
yarn start
```

> NOTE: The downside of the above is that hot module reloading is not supported in this mode. This means that when you make a change to your code, you will have to stop the above process(by pressing ctrl + c), and then run the above command again.

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

| Variable                | Default                              | Description                                                                                                                                                      |
| ----------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CONTEXT                 | unset                                | Configured by Netlify: Name of the build’s deploy context. It can be production, deploy-preview or branch-deploy. Sentry is only enabled if set to `production`. |
| NODE_ENV                | `production` if using `parcel build` |                                                                                                                                                                  |
| SENTRY_DSN              | unset                                | only required in production environment                                                                                                                          |
| SENTRY_PERF_SAMPLE_RATE | unset                                | only required in production environment                                                                                                                          |
| GOOGLE_TAG_MANAGER_ID   | unset                                | only required in production environment                                                                                                                          |

## Running Lighthouse Tests Locally

As part of our CI we run Lighthouse tests against the progressive web app category of tests to ensure we meet the `minScore` of 1 and do not regress between pull requests. If your pull request build failed due to the Lighthouse tests, it's often easier to diagnose if you run the tests locally.

To do so, run the following in your terminal:

```
npx lhci autorun
```
