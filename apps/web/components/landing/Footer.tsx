/**
 * @fileoverview Footer component with company information and navigation links
 */

'use client';

import { BodyDefault, BodySmall } from '@/components/ui/Typography';

interface FooterLink {
  label: string;
  href?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features' },
      { label: 'Pricing' },
      { label: 'API' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center' },
      { label: 'Contact Us' },
      { label: 'Privacy Policy' },
    ],
  },
];

const CURRENT_YEAR = new Date().getFullYear();

/**
 * @description Renders footer with company information and navigation links
 */
export function Footer() {
  return (
    <footer className="bg-bg-tertiary py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-text-primary mb-4">Alva</h3>
            <BodyDefault className="text-text-secondary mb-4">
              Your AI-powered marketing director, working 24/7 to grow your
              business.
            </BodyDefault>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-text-primary mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <BodySmall className="text-text-secondary">
                      {link.label}
                    </BodySmall>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border-subtle mt-8 pt-8">
          <BodySmall className="text-text-secondary text-center">
            © {CURRENT_YEAR} Alva. All rights reserved.
          </BodySmall>
        </div>
      </div>
    </footer>
  );
}
