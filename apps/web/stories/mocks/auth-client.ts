/**
 * @fileoverview Mock for @alva/auth-client module
 */

import { mockAuthResponses } from '../mocks/pageMocks';

export const authClient = {
  register: mockAuthResponses.register,
  sendMagicLink: mockAuthResponses.sendMagicLink,
  verifyToken: mockAuthResponses.verifyToken,
  logout: mockAuthResponses.logout,
};
