import type { Meta, StoryObj } from '@storybook/react';
import {
  FormField,
  Label,
  ErrorText,
  HelperText,
} from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';

const meta: Meta = {
  title: 'UI/FormField',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <FormField
        label="Business Name"
        helperText="This will appear on your marketing plan"
      >
        <Input placeholder="e.g., Acme Inc." />
      </FormField>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <FormField
        label="Email Address"
        required
        helperText="We'll use this to send you updates"
      >
        <Input type="email" placeholder="you@company.com" />
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <FormField label="Website URL" error="Please enter a valid URL">
        <Input placeholder="https://yourwebsite.com" />
      </FormField>
    </div>
  ),
};

export const MultipleFields: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <FormField label="First Name" required>
        <Input placeholder="John" />
      </FormField>
      <FormField label="Last Name" required>
        <Input placeholder="Doe" />
      </FormField>
      <FormField
        label="Email Address"
        required
        helperText="We'll use this to send you updates"
      >
        <Input type="email" placeholder="john@company.com" />
      </FormField>
      <FormField label="Company Name" helperText="Optional">
        <Input placeholder="Acme Inc." />
      </FormField>
    </div>
  ),
};

export const IndividualComponents: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <Label>Label Component</Label>
        <Input placeholder="Input with label" />
        <HelperText>Helper text component</HelperText>
      </div>
      <div className="space-y-2">
        <Label>Label with Error</Label>
        <Input placeholder="Input with error" />
        <ErrorText>Error text component</ErrorText>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="max-w-md space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Contact Information
        </h3>
        <FormField label="Full Name" required>
          <Input placeholder="Enter your full name" />
        </FormField>
        <FormField
          label="Email Address"
          required
          helperText="We'll use this to send you updates"
        >
          <Input type="email" placeholder="you@company.com" />
        </FormField>
        <FormField label="Phone Number" helperText="Optional">
          <Input type="tel" placeholder="(555) 123-4567" />
        </FormField>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Business Information
        </h3>
        <FormField label="Company Name" required>
          <Input placeholder="Your company name" />
        </FormField>
        <FormField label="Website URL" helperText="Include https://">
          <Input placeholder="https://yourwebsite.com" />
        </FormField>
        <FormField label="Industry" required>
          <Input placeholder="e.g., Technology, Healthcare, Retail" />
        </FormField>
      </div>
    </form>
  ),
};
