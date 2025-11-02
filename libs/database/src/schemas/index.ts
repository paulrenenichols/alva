/**
 * @fileoverview Central export file for all database schemas
 */

// Export legacy auth schemas (to be deprecated)
export * from './auth/users';
export * from './auth/refresh-tokens';
export * from './auth/verification-tokens';
export * from './auth/invites';
export * from './auth/roles';
export * from './auth/user-roles';
export * from './auth/password-reset-tokens';
export * from './app/client-profiles';
export * from './app/marketing-plans';

// Export admin schemas
export * from './admin';
// Export web schemas
export * from './web';
