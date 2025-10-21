import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Design System/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A textarea component for multi-line text input with semantic styling and validation states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is disabled',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is in error state',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue:
      'This is a sample textarea with some content. It demonstrates how the textarea looks with text.',
    placeholder: 'Enter your message...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: 'This textarea has an error',
    error: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Default
        </label>
        <Textarea placeholder="Default textarea" />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          With Value
        </label>
        <Textarea defaultValue="This textarea has content" />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Disabled
        </label>
        <Textarea placeholder="Disabled textarea" disabled />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Error State
        </label>
        <Textarea placeholder="Error textarea" error />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Small (2 rows)
        </label>
        <Textarea placeholder="Small textarea" rows={2} />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Medium (4 rows)
        </label>
        <Textarea placeholder="Medium textarea" rows={4} />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Large (6 rows)
        </label>
        <Textarea placeholder="Large textarea" rows={6} />
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-96">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Message <span className="text-danger">*</span>
        </label>
        <Textarea placeholder="Enter your message here..." rows={4} required />
        <p className="text-sm text-text-secondary mt-1">
          Please provide a detailed message.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Additional Notes
        </label>
        <Textarea placeholder="Any additional information..." rows={3} />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-text-inverse rounded-md hover:bg-primary-hover font-medium"
      >
        Submit
      </button>
    </form>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-text-primary">
          Light Mode
        </h3>
        <div className="w-96">
          <Textarea placeholder="Light mode textarea" rows={3} />
        </div>
      </div>

      <div className="dark">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">
          Dark Mode
        </h3>
        <div className="w-96">
          <Textarea placeholder="Dark mode textarea" rows={3} />
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityTest: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-text-primary">
          Accessibility Features
        </h3>
        <ul className="text-text-secondary space-y-1 mb-4">
          <li>• Proper label association</li>
          <li>• Keyboard navigation support</li>
          <li>• Screen reader friendly</li>
          <li>• Focus indicators</li>
          <li>• Error state announcements</li>
        </ul>
      </div>

      <div>
        <label
          htmlFor="accessible-textarea"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Accessible Textarea
        </label>
        <Textarea
          id="accessible-textarea"
          placeholder="This textarea has proper accessibility features"
          rows={3}
          aria-describedby="textarea-help"
        />
        <p id="textarea-help" className="text-sm text-text-secondary mt-1">
          This textarea is properly labeled and accessible.
        </p>
      </div>
    </div>
  ),
};
