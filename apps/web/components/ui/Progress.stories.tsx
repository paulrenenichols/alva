import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar, ProgressDots, Spinner } from '@/components/ui/Progress';

const meta: Meta = {
  title: 'UI/Progress',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgressBarDefault: Story = {
  render: () => (
    <div className="space-y-6">
      <ProgressBar total={6} current={3} label="Brand Clarity • 3 of 6" />
      <ProgressBar total={10} current={7} label="Onboarding Progress" />
      <ProgressBar total={4} current={4} label="Complete" />
    </div>
  ),
};

export const ProgressBarWithoutLabel: Story = {
  render: () => (
    <div className="space-y-4">
      <ProgressBar total={100} current={25} />
      <ProgressBar total={100} current={50} />
      <ProgressBar total={100} current={75} />
      <ProgressBar total={100} current={100} />
    </div>
  ),
};

export const ProgressDotsDefault: Story = {
  render: () => (
    <div className="space-y-6">
      <ProgressDots steps={5} current={0} />
      <ProgressDots steps={5} current={1} />
      <ProgressDots steps={5} current={2} />
      <ProgressDots steps={5} current={3} />
      <ProgressDots steps={5} current={4} />
      <ProgressDots steps={5} current={5} />
    </div>
  ),
};

export const ProgressDotsVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary mb-2">3 Steps</p>
        <ProgressDots steps={3} current={1} />
      </div>
      <div>
        <p className="text-sm text-text-secondary mb-2">7 Steps</p>
        <ProgressDots steps={7} current={4} />
      </div>
      <div>
        <p className="text-sm text-text-secondary mb-2">10 Steps</p>
        <ProgressDots steps={10} current={6} />
      </div>
    </div>
  ),
};

export const SpinnerVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Spinner size="sm" color="gold" />
        <span className="text-sm">Small gold spinner</span>
      </div>
      <div className="flex items-center gap-4">
        <Spinner size="md" color="blue" />
        <span className="text-sm">Medium blue spinner</span>
      </div>
      <div className="flex items-center gap-4">
        <Spinner size="lg" color="gray" />
        <span className="text-sm">Large gray spinner</span>
      </div>
    </div>
  ),
};

export const SpinnerSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <Spinner size="sm" />
        <p className="text-xs text-text-secondary mt-2">Small (16px)</p>
      </div>
      <div className="text-center">
        <Spinner size="md" />
        <p className="text-xs text-text-secondary mt-2">Medium (24px)</p>
      </div>
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary mt-2">Large (48px)</p>
      </div>
    </div>
  ),
};

export const SpinnerColors: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <Spinner color="gold" />
        <p className="text-xs text-text-secondary mt-2">Gold</p>
      </div>
      <div className="text-center">
        <Spinner color="blue" />
        <p className="text-xs text-text-secondary mt-2">Blue</p>
      </div>
      <div className="text-center">
        <Spinner color="gray" />
        <p className="text-xs text-text-secondary mt-2">Gray</p>
      </div>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="p-4 border border-border-subtle rounded-lg">
        <div className="flex items-center gap-3">
          <Spinner size="sm" color="gold" />
          <span className="text-sm text-text-secondary">
            Generating your marketing plan...
          </span>
        </div>
      </div>
      <div className="p-4 border border-border-subtle rounded-lg">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Processing your answers</span>
            <Spinner size="sm" color="blue" />
          </div>
          <ProgressBar total={100} current={65} />
        </div>
      </div>
    </div>
  ),
};
