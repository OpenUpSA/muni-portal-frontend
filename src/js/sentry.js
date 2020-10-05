import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

export function initSentry() {
  Sentry.init({
    dsn: 'https://f8db721b56d14cf899346857a8cb7f45@o242378.ingest.sentry.io/5453189',
    integrations: [
      new Integrations.BrowserTracing(),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}
