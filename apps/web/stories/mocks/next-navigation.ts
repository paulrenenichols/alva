/**
 * @fileoverview Mock for Next.js navigation hooks
 */

// Mock useRouter hook
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  pathname: '/dashboard',
  query: {},
  asPath: '/dashboard',
});

// Mock usePathname hook - ensure it always returns a string
export const usePathname = () => {
  // Return a default pathname that works for most stories
  return '/dashboard';
};

// Mock useSearchParams hook
export const useSearchParams = () => ({
  get: () => null,
  getAll: () => [],
  has: () => false,
  keys: () => [],
  values: () => [],
  entries: () => [],
  forEach: () => {},
  toString: () => '',
});

// Mock useParams hook
export const useParams = () => ({});

// Mock redirect function
export const redirect = () => {};

// Mock notFound function
export const notFound = () => {};