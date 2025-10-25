/**
 * @fileoverview Storybook stories for Input component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/Input';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible input component with built-in label, error states, and helper text support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: { type: 'boolean' },
      description: 'Whether the input is in an error state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
    label: {
      control: { type: 'text' },
      description: 'Label text for the input',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Helper text to display below the input',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    helperText: 'Must be at least 8 characters long',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    error: true,
    helperText: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <Input label="Default State" placeholder="Enter text..." />
      <Input
        label="With Helper Text"
        placeholder="Enter text..."
        helperText="This is helpful information"
      />
      <Input
        label="Error State"
        placeholder="Enter text..."
        error
        helperText="This field has an error"
      />
      <Input label="Disabled State" placeholder="This is disabled" disabled />
    </div>
  ),
};

export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Input label="Text Input" type="text" placeholder="Enter text..." />
      <Input label="Email Input" type="email" placeholder="Enter email..." />
      <Input
        label="Password Input"
        type="password"
        placeholder="Enter password..."
      />
      <Input label="Number Input" type="number" placeholder="Enter number..." />
      <Input label="Search Input" type="search" placeholder="Search..." />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-full max-w-md">
      <Input label="Full Name" placeholder="Enter your full name" required />
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        helperText="We'll never share your email"
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        helperText="Must be at least 8 characters"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        required
      />
    </form>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Light Mode</h3>
        <div className="space-y-4 w-full max-w-md">
          <Input
            label="Light Mode Input"
            placeholder="Enter text..."
            helperText="Light mode styling"
          />
          <Input
            label="Error State"
            placeholder="Enter text..."
            error
            helperText="Error in light mode"
          />
        </div>
      </div>
      <div className="dark">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">
          Dark Mode
        </h3>
        <div className="space-y-4 w-full max-w-md">
          <Input
            label="Dark Mode Input"
            placeholder="Enter text..."
            helperText="Dark mode styling"
          />
          <Input
            label="Error State"
            placeholder="Enter text..."
            error
            helperText="Error in dark mode"
          />
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityTest: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
        <p className="text-text-secondary mb-4">
          Use Tab to navigate between inputs
        </p>
        <div className="space-y-2">
          <Input label="First Input" placeholder="Tab to this input" />
          <Input label="Second Input" placeholder="Then to this one" />
          <Input label="Third Input" placeholder="And finally this one" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Screen Reader Support</h3>
        <Input
          label="Accessible Input"
          placeholder="Screen reader friendly"
          helperText="This input has proper labels and descriptions"
          aria-describedby="helper-text"
        />
      </div>
    </div>
  ),
};
