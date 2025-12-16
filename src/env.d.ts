/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    runtime: {
      env: Env;
    };
  }
}

interface Env {
  TURNSTILE_SECRET_KEY: string;
  PUBLIC_TURNSTILE_SITE_KEY: string;
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
}
