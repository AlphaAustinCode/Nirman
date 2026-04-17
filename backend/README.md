# AgniMitra Backend

This backend implements a MongoDB-first registration and login system for Eendhan-Bhandu using:

- MongoDB for agencies, consumers, and app users
- Supabase Auth for phone OTP generation and verification
- Twilio for SMS delivery
- Supabase Edge Functions and Send SMS Hook for custom SMS workflows
- Node.js + Express for application APIs

## API endpoints

- `GET /api/health`
- `POST /api/validate-agency`
- `POST /api/send-otp`
- `POST /api/verify-otp`
- `GET /api/consumer-details`
- `POST /api/register`
- `POST /api/login`
- `GET /api/user/profile`
- `GET /api/listings`
- `POST /api/listings`
- `GET /api/listings/mine`
- `DELETE /api/listings/:id`
- `GET /api/requests`
- `POST /api/requests`
- `POST /api/requests/:id/respond`
- `POST /api/requests/:id/complete`
- `GET /api/notifications`
- `POST /api/notifications/:id/read`
- `GET /api/history`

## Registration flow

1. `POST /api/validate-agency`
   Validate `agency_code` and `passbook_number` against MongoDB.
2. `POST /api/send-otp`
   Re-validates the consumer and triggers Supabase phone OTP to the MongoDB-registered phone.
3. `POST /api/verify-otp`
   Verifies OTP through Supabase and returns a short-lived backend `registration_token`.
4. `GET /api/consumer-details`
   Send `Authorization: Bearer <registration_token>` to fetch the non-editable consumer profile.
5. `POST /api/register`
   Send `Authorization: Bearer <registration_token>` plus `email`, `password`, and optional `secondary_phone` to create the user.

## Login flow

- `POST /api/login`
  Validate `phone` and `password` against the `users` collection and return a backend JWT access token.

## Seed data

Run:

```bash
npm install
npm run seed
```

This inserts:

- 3 agencies
- 30 preloaded consumers
- 3 pre-registered user accounts for login demos

## Supabase + Twilio setup

1. In Supabase Dashboard, enable Phone Auth.
2. Configure Twilio as the SMS provider with Account SID, Auth Token, and either a Twilio number or Messaging Service SID.
3. Keep OTP requests server-side through this Express backend so only validated LPG consumers can trigger OTP sends.
4. Optionally replace Supabase's built-in SMS sender with the provided Send SMS Hook in `supabase/hooks/send_sms_hook.sql` and the Edge Function in `supabase/functions/send-auth-sms/index.ts`.
5. Deploy the custom notification Edge Function from `supabase/functions/send-custom-sms/index.ts` for registration success messages and alerts.

## Notes

- Supabase currently rate-limits OTP sends by default and documents a default OTP lifetime of 1 hour and resend cooldown of 60 seconds.
- For Indian traffic, complete the required Twilio and operator regulatory setup before production SMS delivery.
- Demo-ready sample records are documented in `docs/mock-demo-data.md`.

## Demo OTP fallback

If Supabase Phone Auth or Twilio is not ready yet, you can temporarily bypass real OTP delivery:

```bash
DEMO_OTP_BYPASS=true
DEMO_OTP_CODE=123456
```

When enabled:

- `POST /api/send-otp` succeeds without calling Supabase
- `POST /api/verify-otp` accepts the configured demo OTP
- the rest of the registration flow remains unchanged

This is intended only for demos and should be disabled once your real SMS provider is configured.
