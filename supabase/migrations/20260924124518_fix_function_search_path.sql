/*
# Fix search_path on update_updated_at function

Security: sets an explicit search_path on the trigger function to prevent search_path injection.
*/

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;