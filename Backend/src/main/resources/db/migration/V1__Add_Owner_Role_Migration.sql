-- Migration: Add OWNER role and promote existing users
-- This migration ensures all existing users get OWNER privileges

-- First, drop the existing check constraint that only allows USER and ADMIN
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_roles_check;

-- Add new check constraint that includes OWNER role
ALTER TABLE user_roles ADD CONSTRAINT user_roles_roles_check 
    CHECK (roles IN ('USER', 'ADMIN', 'OWNER'));

-- Add OWNER role to ALL existing users
-- Simple approach: every user that exists gets OWNER role
INSERT INTO user_roles (user_id, roles)
SELECT DISTINCT u.id, 'OWNER'
FROM users u
WHERE u.id NOT IN (
    SELECT DISTINCT user_id 
    FROM user_roles 
    WHERE roles = 'OWNER'
);