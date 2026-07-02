-- Migration: support multiple devices per user for push notifications
-- Run this in the Supabase SQL editor before deploying the notifications.js change

-- Drop the old single-device constraint
ALTER TABLE push_subscriptions DROP CONSTRAINT IF EXISTS push_subscriptions_user_id_key;

-- Add unique constraint on endpoint (each browser/device has a unique push endpoint)
ALTER TABLE push_subscriptions ADD CONSTRAINT push_subscriptions_endpoint_key UNIQUE (endpoint);
