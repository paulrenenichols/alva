/**
 * @fileoverview Button test page for component development and testing
 */

import { Button } from '@/components/ui/Button';

export default function ButtonTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Button Design System Test
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Button Variants
          </h2>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">
                Small Primary
              </Button>
              <Button variant="primary" size="md">
                Medium Primary
              </Button>
              <Button variant="primary" size="lg">
                Large Primary
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" disabled>
                Disabled Primary
              </Button>
              <Button variant="secondary" disabled>
                Disabled Secondary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
