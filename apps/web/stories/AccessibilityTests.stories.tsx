import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

const meta: Meta = {
  title: 'Design System/Accessibility Tests',
  parameters: {
    docs: {
      description: {
        component:
          'Comprehensive accessibility testing for all components to ensure WCAG compliance.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ColorContrastTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Color Contrast Testing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                Primary Colors
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="p-3 bg-primary text-text-inverse rounded">
                  Primary on Inverse Text
                </div>
                <div className="p-3 bg-danger text-text-inverse rounded">
                  Danger on Inverse Text
                </div>
                <div className="p-3 bg-success text-text-inverse rounded">
                  Success on Inverse Text
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                Text Colors
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <p className="text-text-primary">Primary text color</p>
                <p className="text-text-secondary">Secondary text color</p>
                <p className="text-text-tertiary">Tertiary text color</p>
                <p className="text-danger">Error text color</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const KeyboardNavigationTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Keyboard Navigation Testing</h2>
        <p className="text-text-secondary mb-4">
          Use Tab to navigate between interactive elements. Use Enter/Space to
          activate buttons.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Button Navigation</h3>
            <div className="flex gap-2">
              <Button variant="primary">First Button</Button>
              <Button variant="secondary">Second Button</Button>
              <Button variant="ghost">Third Button</Button>
              <Button variant="destructive">Fourth Button</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Form Navigation</h3>
            <div className="space-y-2 max-w-md">
              <Input label="First Input" placeholder="Tab to this input" />
              <Input label="Second Input" placeholder="Then to this one" />
              <Input label="Third Input" placeholder="And finally this one" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ScreenReaderTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Screen Reader Testing</h2>
        <p className="text-text-secondary mb-4">
          These components have proper ARIA labels and descriptions for screen
          readers.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Buttons with ARIA Labels
            </h3>
            <div className="flex gap-2">
              <Button variant="primary" aria-label="Save document">
                💾
              </Button>
              <Button variant="secondary" aria-label="Delete item">
                🗑️
              </Button>
              <Button variant="ghost" aria-label="Edit content">
                ✏️
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Form with Proper Labels
            </h3>
            <div className="max-w-md space-y-2">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                helperText="We'll never share your email"
                required
                aria-describedby="email-help"
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                helperText="Must be at least 8 characters"
                required
                aria-describedby="password-help"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const FocusManagementTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Focus Management Testing</h2>
        <p className="text-text-secondary mb-4">
          Test focus indicators and focus management across components.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Focus Indicators</h3>
            <div className="flex gap-2">
              <Button variant="primary">Focus Me</Button>
              <Button variant="secondary">Focus Me Too</Button>
              <Button variant="ghost">And Me</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Input Focus</h3>
            <div className="max-w-md space-y-2">
              <Input
                label="Focus Test Input"
                placeholder="Click or tab to focus"
              />
              <Input
                label="Another Input"
                placeholder="Focus moves here next"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const DarkModeAccessibilityTest: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Light Mode Accessibility</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="max-w-md">
            <Input
              label="Test Input"
              placeholder="Light mode input"
              helperText="Check contrast in light mode"
            />
          </div>
        </div>
      </div>

      <div className="dark">
        <h2 className="text-xl font-bold mb-4 text-text-primary">
          Dark Mode Accessibility
        </h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="max-w-md">
            <Input
              label="Test Input"
              placeholder="Dark mode input"
              helperText="Check contrast in dark mode"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
