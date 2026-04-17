import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, template = "registration_success", variables = {} } = await req.json();

    if (!to) {
      return new Response(JSON.stringify({ error: "Missing recipient phone number" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const from = Deno.env.get("TWILIO_PHONE_NUMBER");
    const messagingServiceSid = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");

    if (!accountSid || !authToken || (!from && !messagingServiceSid)) {
      return new Response(JSON.stringify({ error: "Twilio secrets are not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const templates: Record<string, string> = {
      registration_success: `Welcome to AgniMitra! Your LPG account is now active, ${variables.name || "customer"}.`,
      alert: `AgniMitra alert: ${variables.message || "There is an update on your LPG account."}`,
      notification: `AgniMitra notification: ${variables.message || "A new update is available."}`,
    };

    const body = templates[template] || templates.notification;
    const twilioPayload = new URLSearchParams({
      To: to,
      Body: body,
      ...(messagingServiceSid
        ? { MessagingServiceSid: messagingServiceSid }
        : { From: String(from) }),
    });

    const authHeader = "Basic " + btoa(`${accountSid}:${authToken}`);
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: twilioPayload,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Twilio send failed", details: result }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        sid: result.sid,
        status: result.status,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
