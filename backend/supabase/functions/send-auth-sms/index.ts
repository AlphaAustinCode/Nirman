import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const payload = await req.json();
    const otp = payload?.sms?.otp;
    const phone = payload?.user?.phone;

    if (!otp || !phone) {
      return new Response(JSON.stringify({ error: "Invalid hook payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const from = Deno.env.get("TWILIO_PHONE_NUMBER");
    const messagingServiceSid = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");

    if (!accountSid || !authToken || (!from && !messagingServiceSid)) {
      return new Response(JSON.stringify({ error: "Twilio secrets are missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = `Hey, your AgniMitra verification code is ${otp}. It expires soon. Do not share this code.`;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: phone,
          Body: body,
          ...(messagingServiceSid
            ? { MessagingServiceSid: messagingServiceSid }
            : { From: String(from) }),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error: "Twilio send failed", details: error }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
