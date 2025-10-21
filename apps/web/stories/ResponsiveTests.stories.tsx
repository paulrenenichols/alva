import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const meta: Meta = {
  title: 'Design System/Responsive Tests',
  parameters: {
    docs: {
      description: {
        component:
          'Comprehensive responsive design testing across different screen sizes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ButtonResponsiveTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Button Responsive Behavior</h2>
        <p className="text-text-secondary mb-4">
          Test button behavior across different screen sizes. Resize your
          browser window to test responsive behavior.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Button Sizes</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Full Width Buttons</h3>
            <div className="space-y-2 max-w-md">
              <Button variant="primary" className="w-full">
                Full Width Primary
              </Button>
              <Button variant="secondary" className="w-full">
                Full Width Secondary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CardResponsiveTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Card Responsive Layout</h2>
        <p className="text-text-secondary mb-4">
          Test card layouts across different screen sizes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                Card 1
              </h3>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">
                This card adapts to different screen sizes.
              </p>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                Card 2
              </h3>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">Responsive grid layout.</p>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                Card 3
              </h3>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">Mobile-first design.</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const FormResponsiveTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Form Responsive Behavior</h2>
        <p className="text-text-secondary mb-4">
          Test form layouts across different screen sizes.
        </p>

        <div className="max-w-2xl">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Enter first name" />
              <Input label="Last Name" placeholder="Enter last name" />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
            />

            <Input label="Message" placeholder="Enter your message" />

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="primary" className="flex-1">
                Submit
              </Button>
              <Button variant="secondary" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ),
};

export const NavigationResponsiveTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          Navigation Responsive Behavior
        </h2>
        <p className="text-text-secondary mb-4">
          Test navigation components across different screen sizes.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Horizontal Navigation
            </h3>
            <nav className="flex flex-wrap gap-4 p-4 bg-bg-secondary rounded-lg">
              <a href="#" className="text-text-primary hover:text-primary">
                Home
              </a>
              <a href="#" className="text-text-primary hover:text-primary">
                About
              </a>
              <a href="#" className="text-text-primary hover:text-primary">
                Services
              </a>
              <a href="#" className="text-text-primary hover:text-primary">
                Contact
              </a>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Mobile Navigation</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="ghost" className="w-full sm:w-auto">
                Menu Item 1
              </Button>
              <Button variant="ghost" className="w-full sm:w-auto">
                Menu Item 2
              </Button>
              <Button variant="ghost" className="w-full sm:w-auto">
                Menu Item 3
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TypographyResponsiveTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          Typography Responsive Behavior
        </h2>
        <p className="text-text-secondary mb-4">
          Test typography scaling across different screen sizes.
        </p>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
              Responsive Heading
            </h1>
            <p className="text-text-secondary mt-2">
              This heading scales with screen size
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-text-primary">
              Subheading
            </h2>
            <p className="text-base md:text-lg text-text-secondary mt-2">
              This subheading also scales appropriately
            </p>
          </div>

          <div className="max-w-2xl">
            <p className="text-sm md:text-base lg:text-lg text-text-secondary leading-relaxed">
              This paragraph demonstrates responsive typography. The text size
              adjusts based on the screen size, ensuring optimal readability
              across all devices. On mobile devices, the text is smaller and
              more compact, while on larger screens, it becomes more spacious
              and easier to read.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const BreakpointTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Breakpoint Testing</h2>
        <p className="text-text-secondary mb-4">
          Test components at different breakpoints by resizing your browser
          window.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-bg-secondary rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Current Viewport</h3>
            <p className="text-text-secondary">
              Resize your browser window to test different screen sizes:
            </p>
            <ul className="list-disc list-inside text-text-secondary mt-2 space-y-1">
              <li>Mobile: 375px width</li>
              <li>Tablet: 768px width</li>
              <li>Desktop: 1440px width</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-primary text-text-inverse rounded text-center">
              <div className="text-sm font-medium">Mobile</div>
              <div className="text-xs opacity-90">1 column</div>
            </div>
            <div className="p-4 bg-secondary text-text-inverse rounded text-center">
              <div className="text-sm font-medium">Small</div>
              <div className="text-xs opacity-90">2 columns</div>
            </div>
            <div className="p-4 bg-success text-text-inverse rounded text-center">
              <div className="text-sm font-medium">Large</div>
              <div className="text-xs opacity-90">4 columns</div>
            </div>
            <div className="p-4 bg-info text-text-inverse rounded text-center">
              <div className="text-sm font-medium">Extra Large</div>
              <div className="text-xs opacity-90">4 columns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
