-- Migration: Add deletedAt column to bands table if missing
ALTER TABLE bands ADD COLUMN deletedAt TEXT;
