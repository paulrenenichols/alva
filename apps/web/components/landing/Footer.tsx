'use client';

import { BodyDefault, BodySmall } from '@/components/ui/Typography';

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

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <BodySmall className="text-text-secondary">Features</BodySmall>
              </li>
              <li>
                <BodySmall className="text-text-secondary">Pricing</BodySmall>
              </li>
              <li>
                <BodySmall className="text-text-secondary">API</BodySmall>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <BodySmall className="text-text-secondary">
                  Help Center
                </BodySmall>
              </li>
              <li>
                <BodySmall className="text-text-secondary">
                  Contact Us
                </BodySmall>
              </li>
              <li>
                <BodySmall className="text-text-secondary">
                  Privacy Policy
                </BodySmall>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-8 pt-8">
          <BodySmall className="text-text-secondary text-center">
            © 2024 Alva. All rights reserved.
          </BodySmall>
        </div>
      </div>
    </footer>
  );
}
