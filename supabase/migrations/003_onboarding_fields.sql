-- Add onboarding fields to members table
-- Run this in the Supabase SQL Editor

-- Personal info
alter table members add column if not exists age_range text;
alter table members add column if not exists birthday date;
alter table members add column if not exists gender text;
alter table members add column if not exists nationality text;
alter table members add column if not exists city_district text;
alter table members add column if not exists phone_whatsapp text;
alter table members add column if not exists profession text;

-- Discovery
alter table members add column if not exists heard_from text;
alter table members add column if not exists attended_events_before boolean;
alter table members add column if not exists attended_which_events text;

-- Languages & identity
alter table members add column if not exists languages text[];
alter table members add column if not exists member_type text;

-- Interests
alter table members add column if not exists activity_interests text[];
alter table members add column if not exists event_frequency text;
alter table members add column if not exists looking_for text[];

-- Community agreements
alter table members add column if not exists agrees_community_values boolean default false;
alter table members add column if not exists agrees_no_unsolicited_dms boolean default false;
alter table members add column if not exists agrees_kindness boolean default false;
alter table members add column if not exists agrees_mixed_environments boolean default false;

-- Free text
alter table members add column if not exists why_join text;
alter table members add column if not exists social_profile text;
alter table members add column if not exists friends_in_community text;

-- Photo
alter table members add column if not exists photo_verification_url text;

-- Confirmations
alter table members add column if not exists confirms_rules boolean default false;
alter table members add column if not exists confirms_positive_behavior boolean default false;
alter table members add column if not exists confirms_admin_removal boolean default false;
alter table members add column if not exists confirms_not_dating_app boolean default false;

-- Preferences
alter table members add column if not exists atmosphere_preferences text[];
alter table members add column if not exists contribution_preferences text[];
alter table members add column if not exists disagreement_handling text[];
alter table members add column if not exists real_name_on_whatsapp boolean;
alter table members add column if not exists understands_rsvp_policy boolean;
alter table members add column if not exists agrees_payment_policy boolean;
alter table members add column if not exists agrees_no_misuse text[];

-- Onboarding status
alter table members add column if not exists onboarding_completed boolean default false;
alter table members add column if not exists onboarding_completed_at timestamptz;
