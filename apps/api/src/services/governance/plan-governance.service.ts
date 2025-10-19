import { ClientProfile } from '@alva/shared-types';

export interface PlanTask {
  id: string;
  title: string;
  description: string;
  estimated_hours: number;
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  status: 'planned' | 'in-progress' | 'completed';
  category:
    | 'setup'
    | 'content'
    | 'ads'
    | 'analytics'
    | 'social'
    | 'email'
    | 'blog';
  dependencies?: string[];
}

export interface MergedPlan {
  plan: {
    client_id: string;
    window_start: string;
    window_end: string;
    weekly_capacity_hours: number;
  };
  tasks: PlanTask[];
  meta: {
    generated_at: string;
    governance_version: string;
    modules_merged: string[];
    conflicts_resolved: number;
  };
}

export class PlanGovernanceService {
  mergePlans(
    basePlan: any,
    blogPlan: any,
    emailPlan: any,
    socialPlan: any,
    profile: ClientProfile
  ): MergedPlan {
    const mergedTasks: PlanTask[] = [];
    const conflicts: string[] = [];

    // Start with base plan tasks
    if (basePlan.tasks) {
      mergedTasks.push(...basePlan.tasks);
    }

    // Merge blog tasks
    if (blogPlan.tasks) {
      const blogTasks = this.adaptBlogTasks(blogPlan.tasks);
      const conflicts_found = this.mergeTasks(mergedTasks, blogTasks, 'blog');
      conflicts.push(...conflicts_found);
    }

    // Merge email tasks
    if (emailPlan.tasks) {
      const emailTasks = this.adaptEmailTasks(emailPlan.tasks);
      const conflicts_found = this.mergeTasks(mergedTasks, emailTasks, 'email');
      conflicts.push(...conflicts_found);
    }

    // Merge social media tasks
    if (socialPlan.tasks) {
      const socialTasks = this.adaptSocialTasks(socialPlan.tasks);
      const conflicts_found = this.mergeTasks(
        mergedTasks,
        socialTasks,
        'social'
      );
      conflicts.push(...conflicts_found);
    }

    // Optimize timeline based on capacity
    this.optimizeTimeline(
      mergedTasks,
      profile.constraints_tools.weekly_time_commitment
    );

    // Resolve conflicts
    this.resolveConflicts(mergedTasks, conflicts);

    return {
      plan: {
        client_id: profile.user_profile.business_name,
        window_start:
          basePlan.plan?.window_start || new Date().toISOString().split('T')[0],
        window_end: basePlan.plan?.window_end || this.getEndDate(),
        weekly_capacity_hours:
          parseInt(profile.constraints_tools.weekly_time_commitment) || 10,
      },
      tasks: mergedTasks,
      meta: {
        generated_at: new Date().toISOString(),
        governance_version: '1.0',
        modules_merged: ['base', 'blog', 'email', 'social'],
        conflicts_resolved: conflicts.length,
      },
    };
  }

  private adaptBlogTasks(blogTasks: any[]): PlanTask[] {
    return blogTasks.map((task) => ({
      id: `blog_${task.id}`,
      title: task.title || 'Blog Content Creation',
      description: task.description || 'Create blog content',
      estimated_hours: task.estimated_hours || 2,
      priority: task.priority || 'medium',
      due_date: task.due_date || this.getDefaultDueDate(),
      status: 'planned' as const,
      category: 'blog' as const,
      dependencies: task.dependencies || [],
    }));
  }

  private adaptEmailTasks(emailTasks: any[]): PlanTask[] {
    return emailTasks.map((task) => ({
      id: `email_${task.id}`,
      title: task.title || 'Email Campaign Setup',
      description: task.description || 'Set up email campaign',
      estimated_hours: task.estimated_hours || 1,
      priority: task.priority || 'medium',
      due_date: task.due_date || this.getDefaultDueDate(),
      status: 'planned' as const,
      category: 'email' as const,
      dependencies: task.dependencies || [],
    }));
  }

  private adaptSocialTasks(socialTasks: any[]): PlanTask[] {
    return socialTasks.map((task) => ({
      id: `social_${task.id}`,
      title: task.title || 'Social Media Content',
      description: task.description || 'Create social media content',
      estimated_hours: task.estimated_hours || 1,
      priority: task.priority || 'low',
      due_date: task.due_date || this.getDefaultDueDate(),
      status: 'planned' as const,
      category: 'social' as const,
      dependencies: task.dependencies || [],
    }));
  }

  private mergeTasks(
    existingTasks: PlanTask[],
    newTasks: PlanTask[],
    module: string
  ): string[] {
    const conflicts: string[] = [];

    newTasks.forEach((newTask) => {
      // Check for conflicts (same title, overlapping dates)
      const conflict = existingTasks.find(
        (existing) =>
          existing.title.toLowerCase() === newTask.title.toLowerCase() ||
          this.datesOverlap(existing.due_date, newTask.due_date)
      );

      if (conflict) {
        conflicts.push(
          `Conflict between ${conflict.title} and ${newTask.title}`
        );
        // Resolve by adjusting the new task
        newTask.due_date = this.getNextAvailableDate(existingTasks);
        newTask.title = `${newTask.title} (${module})`;
      }

      existingTasks.push(newTask);
    });

    return conflicts;
  }

  private optimizeTimeline(tasks: PlanTask[], weeklyCapacity: string) {
    const capacity = parseInt(weeklyCapacity) || 10;
    const sortedTasks = tasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    let currentWeek = 1;
    let currentWeekHours = 0;

    sortedTasks.forEach((task) => {
      if (currentWeekHours + task.estimated_hours > capacity) {
        currentWeek++;
        currentWeekHours = 0;
      }

      task.due_date = this.getDateForWeek(currentWeek);
      currentWeekHours += task.estimated_hours;
    });
  }

  private resolveConflicts(tasks: PlanTask[], conflicts: string[]) {
    // Log conflicts for monitoring
    console.log('Plan conflicts resolved:', conflicts);

    // Additional conflict resolution logic can be added here
    // For now, we've handled conflicts during the merge process
  }

  private datesOverlap(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffDays =
      Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays < 3; // Consider overlapping if within 3 days
  }

  private getNextAvailableDate(tasks: PlanTask[]): string {
    const dates = tasks.map((task) => new Date(task.due_date));
    const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    latestDate.setDate(latestDate.getDate() + 7);
    return latestDate.toISOString().split('T')[0];
  }

  private getDefaultDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  }

  private getDateForWeek(week: number): string {
    const date = new Date();
    date.setDate(date.getDate() + week * 7);
    return date.toISOString().split('T')[0];
  }

  private getEndDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }
}
