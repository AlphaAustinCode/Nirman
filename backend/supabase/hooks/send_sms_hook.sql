create or replace function public.send_sms(event jsonb)
returns jsonb
language plpgsql
as $$
declare
  hook_url text := current_setting('app.settings.send_sms_hook_url', true);
  hook_secret text := current_setting('app.settings.send_sms_hook_secret', true);
  request_id bigint;
begin
  if hook_url is null then
    raise exception 'send_sms hook url is not configured';
  end if;

  select net.http_post(
    url := hook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(hook_secret, '')
    ),
    body := event
  )
  into request_id;

  return jsonb_build_object('queued', true, 'request_id', request_id);
end;
$$;

grant execute on function public.send_sms(jsonb) to supabase_auth_admin;
grant usage on schema public to supabase_auth_admin;
revoke execute on function public.send_sms(jsonb) from anon, authenticated, public;

-- Configure in Supabase Auth Hooks:
-- Hook: Send SMS
-- Type: Postgres Function
-- Function name: public.send_sms
--
-- Required extension:
-- create extension if not exists pg_net;
--
-- Example secret wiring:
-- alter database postgres set app.settings.send_sms_hook_url = 'https://<project-ref>.supabase.co/functions/v1/send-auth-sms';
-- alter database postgres set app.settings.send_sms_hook_secret = '<edge-function-secret>';
