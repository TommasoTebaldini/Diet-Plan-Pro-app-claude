-- Funzione per eliminare l'account dell'utente autenticato (GDPR Art. 17)
-- Eseguire in Supabase SQL Editor
--
-- FIX 2026-09-04: rimossa `DELETE FROM shopping_list_items` — quella tabella
-- non esiste sul progetto Supabase live (ShoppingListPage.jsx non salva la
-- lista spesa lì). La funzione live falliva quindi SEMPRE con
-- 'relation "shopping_list_items" does not exist', bloccando in toto
-- l'eliminazione account per ogni utente — nessuna riga veniva cancellata
-- (funzione plpgsql, l'intera funzione è transazionale: fallisce tutto o
-- niente). Scoperto testando manualmente l'eliminazione account.
CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  DELETE FROM food_logs WHERE user_id = auth.uid();
  DELETE FROM water_logs WHERE user_id = auth.uid();
  DELETE FROM weight_logs WHERE user_id = auth.uid();
  DELETE FROM daily_wellness WHERE user_id = auth.uid();
  DELETE FROM activity_logs WHERE user_id = auth.uid();
  DELETE FROM meal_completions WHERE user_id = auth.uid();
  DELETE FROM progress_photos WHERE user_id = auth.uid();
  DELETE FROM body_measurements WHERE user_id = auth.uid();
  DELETE FROM daily_logs WHERE user_id = auth.uid();
  DELETE FROM custom_foods WHERE user_id = auth.uid();
  DELETE FROM custom_meals WHERE user_id = auth.uid();
  DELETE FROM ricette WHERE user_id = auth.uid();
  DELETE FROM push_subscriptions WHERE user_id = auth.uid();
  DELETE FROM user_achievements WHERE user_id = auth.uid();
  DELETE FROM meal_plan_items WHERE plan_id IN (SELECT id FROM meal_plans WHERE user_id = auth.uid());
  DELETE FROM meal_plans WHERE user_id = auth.uid();
  DELETE FROM profiles WHERE id = auth.uid();
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
