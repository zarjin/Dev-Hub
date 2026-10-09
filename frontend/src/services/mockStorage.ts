import {
  INITIAL_USERS,
  INITIAL_ORGANIZATIONS,
  INITIAL_ORG_MEMBERS,
  INITIAL_TEAMS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
} from './mockData';
import { User } from '../features/users/user.types';
import { Organization, OrganizationMember } from '../features/organizations/organization.types';
import { Team, TeamMember } from '../features/teams/team.types';
import { Task, TaskActivity, Comment } from '../features/tasks/task.types';
import { Notification } from '../features/notifications/notification.types';

class MockStorageService {
  private users: User[];
  private organizations: Organization[];
  private orgMembers: OrganizationMember[];
  private teams: Team[];
  private teamMembers: TeamMember[];
  private tasks: Task[];
  private activities: TaskActivity[];
  private comments: Comment[];
  private notifications: Notification[];

  constructor() {
    this.users = this.load('devhub_mock_users', INITIAL_USERS);
    this.organizations = this.load('devhub_mock_orgs', INITIAL_ORGANIZATIONS);
    this.orgMembers = this.load('devhub_mock_org_members', INITIAL_ORG_MEMBERS);
    this.teams = this.load('devhub_mock_teams', INITIAL_TEAMS);
    this.teamMembers = this.load('devhub_mock_team_members', INITIAL_TEAM_MEMBERS);
    this.tasks = this.load('devhub_mock_tasks', INITIAL_TASKS);
    this.activities = this.load('devhub_mock_activities', INITIAL_ACTIVITIES);
    this.comments = this.load('devhub_mock_comments', INITIAL_COMMENTS);
    this.notifications = this.load('devhub_mock_notifications', INITIAL_NOTIFICATIONS);
  }

  private load<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`Failed to save ${key} to localStorage`, e);
    }
  }

  // Users
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u._id === id);
  }

  updateUser(id: string, updates: Partial<User>): User {
    const idx = this.users.findIndex((u) => u._id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates, updatedAt: new Date().toISOString() };
      this.save('devhub_mock_users', this.users);
      return this.users[idx];
    }
    throw new Error('User not found');
  }

  // Organizations
  getOrganizations(): Organization[] {
    return this.organizations;
  }

  getOrganizationById(id: string): Organization | undefined {
    return this.organizations.find((o) => o._id === id);
  }

  createOrganization(data: Omit<Organization, '_id' | 'createdAt' | 'updatedAt'>): Organization {
    const newOrg: Organization = {
      _id: `org-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.organizations.unshift(newOrg);
    this.save('devhub_mock_orgs', this.organizations);

    // Add creator as owner member
    const newMember: OrganizationMember = {
      _id: `om-${Date.now()}`,
      organizationId: newOrg._id,
      userId: data.ownerId,
      role: 'owner',
      status: 'active',
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orgMembers.push(newMember);
    this.save('devhub_mock_org_members', this.orgMembers);

    return newOrg;
  }

  updateOrganization(id: string, updates: Partial<Organization>): Organization {
    const idx = this.organizations.findIndex((o) => o._id === id);
    if (idx !== -1) {
      this.organizations[idx] = { ...this.organizations[idx], ...updates, updatedAt: new Date().toISOString() };
      this.save('devhub_mock_orgs', this.organizations);
      return this.organizations[idx];
    }
    throw new Error('Organization not found');
  }

  getOrgMembers(orgId: string): (OrganizationMember & { user?: User })[] {
    return this.orgMembers
      .filter((om) => om.organizationId === orgId)
      .map((om) => ({
        ...om,
        user: this.getUserById(om.userId),
      }));
  }

  addOrgMember(orgId: string, email: string, role: OrganizationMember['role']): OrganizationMember {
    let user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Create new user for demo purposes
      user = {
        _id: `user-${Date.now()}`,
        name: email.split('@')[0],
        username: email.split('@')[0].toLowerCase(),
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.push(user);
      this.save('devhub_mock_users', this.users);
    }

    const member: OrganizationMember = {
      _id: `om-${Date.now()}`,
      organizationId: orgId,
      userId: user._id,
      role,
      status: 'active',
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orgMembers.push(member);
    this.save('devhub_mock_org_members', this.orgMembers);
    return member;
  }

  // Teams
  getTeams(orgId?: string): Team[] {
    if (orgId) {
      return this.teams.filter((t) => t.organizationId === orgId);
    }
    return this.teams;
  }

  getTeamById(id: string): Team | undefined {
    return this.teams.find((t) => t._id === id);
  }

  createTeam(data: Omit<Team, '_id' | 'createdAt' | 'updatedAt'>): Team {
    const newTeam: Team = {
      _id: `team-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.teams.unshift(newTeam);
    this.save('devhub_mock_teams', this.teams);

    // Add creator as team lead
    const member: TeamMember = {
      _id: `tm-${Date.now()}`,
      teamId: newTeam._id,
      userId: data.createdBy,
      role: 'team_lead',
      status: 'active',
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.teamMembers.push(member);
    this.save('devhub_mock_team_members', this.teamMembers);

    return newTeam;
  }

  updateTeam(id: string, updates: Partial<Team>): Team {
    const idx = this.teams.findIndex((t) => t._id === id);
    if (idx !== -1) {
      this.teams[idx] = { ...this.teams[idx], ...updates, updatedAt: new Date().toISOString() };
      this.save('devhub_mock_teams', this.teams);
      return this.teams[idx];
    }
    throw new Error('Team not found');
  }

  getTeamMembers(teamId: string): (TeamMember & { user?: User })[] {
    return this.teamMembers
      .filter((tm) => tm.teamId === teamId)
      .map((tm) => ({
        ...tm,
        user: this.getUserById(tm.userId),
      }));
  }

  addTeamMember(teamId: string, userId: string, role: TeamMember['role']): TeamMember {
    const member: TeamMember = {
      _id: `tm-${Date.now()}`,
      teamId,
      userId,
      role,
      status: 'active',
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.teamMembers.push(member);
    this.save('devhub_mock_team_members', this.teamMembers);
    return member;
  }

  // Tasks
  getTasks(teamId?: string, orgId?: string): (Task & { assignee?: User; creator?: User })[] {
    let filtered = this.tasks;
    if (orgId) {
      filtered = filtered.filter((t) => t.organizationId === orgId);
    }
    if (teamId) {
      filtered = filtered.filter((t) => t.teamId === teamId);
    }
    return filtered.map((task) => ({
      ...task,
      assignee: this.getUserById(task.assignedTo),
      creator: this.getUserById(task.createdBy),
    }));
  }

  getTaskById(id: string): (Task & { assignee?: User; creator?: User }) | undefined {
    const task = this.tasks.find((t) => t._id === id);
    if (!task) return undefined;
    return {
      ...task,
      assignee: this.getUserById(task.assignedTo),
      creator: this.getUserById(task.createdBy),
    };
  }

  createTask(data: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'completedAt' | 'assignee' | 'creator'>): Task {
    const newTask: Task = {
      _id: `task-${Date.now()}`,
      ...data,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.unshift(newTask);
    this.save('devhub_mock_tasks', this.tasks);

    // Record creation activity
    const creatorUser = this.getUserById(data.createdBy);
    const activity: TaskActivity = {
      _id: `act-${Date.now()}`,
      taskId: newTask._id,
      teamId: newTask.teamId,
      actorId: data.createdBy,
      action: 'created',
      fromStatus: null,
      toStatus: newTask.status,
      message: `${creatorUser?.name || 'User'} created this task`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.activities.unshift(activity);
    this.save('devhub_mock_activities', this.activities);

    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>, actorId: string): Task {
    const idx = this.tasks.findIndex((t) => t._id === id);
    if (idx !== -1) {
      const oldTask = this.tasks[idx];
      const actor = this.getUserById(actorId);
      const isStatusChange = updates.status && updates.status !== oldTask.status;

      let completedAt = oldTask.completedAt;
      if (updates.status === 'completed') {
        completedAt = new Date().toISOString();
      } else if (updates.status) {
        completedAt = null;
      }

      this.tasks[idx] = {
        ...oldTask,
        ...updates,
        completedAt,
        updatedAt: new Date().toISOString(),
      };
      this.save('devhub_mock_tasks', this.tasks);

      // Record activity
      if (isStatusChange) {
        let msg = `${actor?.name || 'User'} changed status to ${updates.status?.replace('_', ' ')}`;
        if (updates.status === 'in_progress' && oldTask.status === 'todo') {
          msg = `${actor?.name || 'User'} started working`;
        } else if (updates.status === 'pending_review') {
          msg = `${actor?.name || 'User'} submitted the task for review`;
        } else if (updates.status === 'completed') {
          msg = `${actor?.name || 'User'} approved and completed the task`;
        } else if (updates.status === 'changes_requested') {
          msg = `${actor?.name || 'User'} requested changes`;
        }

        const act: TaskActivity = {
          _id: `act-${Date.now()}`,
          taskId: id,
          teamId: oldTask.teamId,
          actorId,
          action: 'status_changed',
          fromStatus: oldTask.status,
          toStatus: updates.status || null,
          message: msg,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.activities.unshift(act);
        this.save('devhub_mock_activities', this.activities);
      }

      return this.tasks[idx];
    }
    throw new Error('Task not found');
  }

  // Activities
  getTaskActivities(taskId: string): (TaskActivity & { actor?: User })[] {
    return this.activities
      .filter((a) => a.taskId === taskId)
      .map((a) => ({
        ...a,
        actor: this.getUserById(a.actorId),
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Comments
  getComments(taskId: string): (Comment & { user?: User; replies?: (Comment & { user?: User })[] })[] {
    const taskComments = this.comments.filter((c) => c.taskId === taskId);
    const topLevel = taskComments.filter((c) => !c.parentId);

    return topLevel.map((comment) => {
      const replies = taskComments
        .filter((c) => c.parentId === comment._id)
        .map((reply) => ({
          ...reply,
          user: this.getUserById(reply.userId),
        }));

      return {
        ...comment,
        user: this.getUserById(comment.userId),
        replies,
      };
    });
  }

  addComment(data: { taskId: string; userId: string; text: string; parentId?: string | null }): Comment {
    const comment: Comment = {
      _id: `cmt-${Date.now()}`,
      taskId: data.taskId,
      userId: data.userId,
      text: data.text,
      parentId: data.parentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.comments.push(comment);
    this.save('devhub_mock_comments', this.comments);

    // Record activity
    const user = this.getUserById(data.userId);
    const task = this.getTaskById(data.taskId);
    if (task) {
      const act: TaskActivity = {
        _id: `act-${Date.now()}`,
        taskId: data.taskId,
        teamId: task.teamId,
        actorId: data.userId,
        action: 'commented',
        fromStatus: null,
        toStatus: null,
        message: `${user?.name || 'User'} commented on the task`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.activities.unshift(act);
      this.save('devhub_mock_activities', this.activities);
    }

    return comment;
  }

  // Notifications
  getNotifications(userId: string): Notification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  markNotificationRead(id: string): Notification {
    const idx = this.notifications.findIndex((n) => n._id === id);
    if (idx !== -1) {
      this.notifications[idx] = {
        ...this.notifications[idx],
        isRead: true,
        readAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.save('devhub_mock_notifications', this.notifications);
      return this.notifications[idx];
    }
    throw new Error('Notification not found');
  }

  markAllNotificationsRead(userId: string): void {
    this.notifications = this.notifications.map((n) =>
      n.userId === userId
        ? { ...n, isRead: true, readAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        : n
    );
    this.save('devhub_mock_notifications', this.notifications);
  }
}

export const mockStorage = new MockStorageService();
