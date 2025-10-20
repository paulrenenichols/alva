import type { Meta, StoryObj } from '@storybook/react';
import TasksPage from '@/app/dashboard/tasks/page';

const meta: Meta<typeof TasksPage> = {
  title: 'Pages/Tasks',
  component: TasksPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Tasks and to-do page for managing marketing tasks and tracking progress.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default tasks page with all tasks visible.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Tasks page optimized for mobile devices.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tasks page layout for tablet devices.',
      },
    },
  },
};

export const NoTasks: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tasks page when no tasks are available.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Mock the API client to return no plans
      const originalGetUserPlans =
        require('@alva/api-client').apiClient.getUserPlans;
      require('@alva/api-client').apiClient.getUserPlans = async () => [];

      return <Story />;
    },
  ],
};
