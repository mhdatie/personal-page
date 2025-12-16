import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parse request body
    const body = await request.json();
    const { email, turnstileToken } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate Turnstile token
    if (!turnstileToken || typeof turnstileToken !== "string") {
      return new Response(JSON.stringify({ error: "Verification required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify Turnstile token with Cloudflare
    // Access environment variables from Cloudflare runtime
    const env = locals.runtime?.env || import.meta.env;
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;

    if (!turnstileSecret) {
      console.error("TURNSTILE_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({
          error: "Service configuration error: TURNSTILE_SECRET_KEY",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      }
    );

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      console.error("Turnstile verification failed:", turnstileResult);
      return new Response(
        JSON.stringify({ error: "Verification failed. Please try again." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Resend
    const resendApiKey = env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({
          error: "Service configuration error: RESEND_API_KEY",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);

    // Add contact to Resend
    const resendAudienceId = env.RESEND_AUDIENCE_ID;
    if (!resendAudienceId) {
      console.error("RESEND_AUDIENCE_ID is not configured");
      return new Response(
        JSON.stringify({
          error: "Service configuration error: RESEND_AUDIENCE_ID",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await resend.contacts.create({
      email: email,
      audienceId: resendAudienceId,
    });

    if (error) {
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to subscribe. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully subscribed!",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
