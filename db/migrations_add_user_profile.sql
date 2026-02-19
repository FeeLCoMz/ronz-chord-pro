-- Migration: Add user profile fields to users table
ALTER TABLE users ADD COLUMN displayName TEXT;
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN profilePicture TEXT;
ALTER TABLE users ADD COLUMN instrument TEXT;
ALTER TABLE users ADD COLUMN experience TEXT;
ALTER TABLE users ADD COLUMN genres TEXT;
ALTER TABLE users ADD COLUMN location TEXT;
