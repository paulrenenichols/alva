/**
 * @fileoverview Utility functions for class name merging and other common operations
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @description Merges class names using clsx and tailwind-merge for optimal Tailwind CSS class handling
 * @param inputs - Array of class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}