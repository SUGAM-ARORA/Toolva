/**
 * Toolva Auth Utilities
 *
 * Lightweight auth layer using localStorage + custom backend JWT tokens.
 * Replaces all Supabase auth dependencies.
 */

export type UserRole = 
  | 'Novice'
  | 'Practitioner'
  | 'Proficient'
  | 'Expert'
  | 'Master'
  | 'Admin'
  | 'Lead'
  | 'Platform Reader'
  | 'Platform Owner'
  | 'SuperAdmin';

export const ALL_ROLES: UserRole[] = [
  'Novice',
  'Practitioner',
  'Proficient',
  'Expert',
  'Master',
  'Admin',
  'Lead',
  'Platform Reader',
  'Platform Owner',
  'SuperAdmin'
];

export interface ToolvaUser {
  id: string | number;
  userId?: string;
  email: string;
  name?: string;
  role?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  authType?: string;
  status?: 'Active' | 'Suspended';
  lastActive?: string;
  toolsOpenedCount?: number;
}

export interface ActivityLogItem {
  id: string | number;
  userId: string | number;
  userEmail: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

/**
 * SuperAdmin check helper. Registered owner email sugam.arora23@gmail.com is ALWAYS SuperAdmin.
 */
export function isUserSuperAdmin(user?: ToolvaUser | null): boolean {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const role = (user.role || '').toLowerCase().trim();
  return (
    email === 'sugam.arora23@gmail.com' ||
    email === 'sugamarora@gmail.com' ||
    role === 'superadmin' ||
    role === 'platform owner'
  );
}

/**
 * Get the currently authenticated user from localStorage.
 */
export function getCurrentUser(): ToolvaUser | null {
  try {
    const stored = localStorage.getItem('toolva_user');
    const token = localStorage.getItem('toolva_token');
    if (stored && token) {
      const user = JSON.parse(stored) as ToolvaUser;
      if (user.email === 'sugam.arora23@gmail.com' || user.email === 'sugamarora@gmail.com') {
        user.role = 'SuperAdmin';
        localStorage.setItem('toolva_user', JSON.stringify(user));
      }
      return user;
    }
  } catch {
    // fallback
  }
  return null;
}

/**
 * Get or create a default active profile for the currently logged in user.
 * Returns null if no user is signed in.
 */
export function getOrCreateCurrentUser(): ToolvaUser | null {
  const existing = getCurrentUser();
  if (existing) {
    if (existing.email === 'sugam.arora23@gmail.com' || existing.email === 'sugamarora@gmail.com') {
      existing.role = 'SuperAdmin';
    }
    return existing;
  }
  return null;
}

/**
 * Save auth state to localStorage and broadcast event.
 */
export function saveAuth(user: ToolvaUser, token: string): void {
  if (user.email === 'sugam.arora23@gmail.com' || user.email === 'sugamarora@gmail.com') {
    user.role = 'SuperAdmin';
  }
  localStorage.setItem('toolva_user', JSON.stringify(user));
  localStorage.setItem('toolva_token', token);
  window.dispatchEvent(new Event('auth-change'));
}

/**
 * Clear auth state.
 */
export function logout(): void {
  localStorage.removeItem('toolva_user');
  localStorage.removeItem('toolva_token');
  window.dispatchEvent(new Event('auth-change'));
}

/**
 * Get list of platform users for User Management.
 */
export function getUsersDatabase(): ToolvaUser[] {
  const currentUser = getOrCreateCurrentUser();
  const ownerUser: ToolvaUser = {
    id: 'user_owner',
    userId: 'TLVA-849201',
    email: 'sugam.arora23@gmail.com',
    name: 'Sugam Arora',
    role: 'SuperAdmin',
    phone: '8699122792',
    location: 'San Francisco, CA',
    status: 'Active',
    lastActive: new Date().toISOString(),
    toolsOpenedCount: 7
  };

  try {
    const stored = localStorage.getItem('toolva_user_database');
    if (stored) {
      const parsed = JSON.parse(stored) as ToolvaUser[];
      // Filter out dummy mock users ending in @toolva.com or example.com
      const cleaned = parsed.filter(u => 
        u.email && 
        !u.email.endsWith('@toolva.com') && 
        !u.email.endsWith('@example.com') && 
        u.email !== 'explorer@toolva.com'
      );

      const ownerIdx = cleaned.findIndex(u => u.email === 'sugam.arora23@gmail.com' || u.email === 'sugamarora@gmail.com');
      if (ownerIdx !== -1) {
        cleaned[ownerIdx] = { ...cleaned[ownerIdx], ...ownerUser, role: 'SuperAdmin' };
      } else {
        cleaned.unshift(ownerUser);
      }

      localStorage.setItem('toolva_user_database', JSON.stringify(cleaned));
      return cleaned;
    }
  } catch {
    // Fallback
  }

  const initialUsers: ToolvaUser[] = [ownerUser];
  localStorage.setItem('toolva_user_database', JSON.stringify(initialUsers));
  return initialUsers;
}

/**
 * Update user in database.
 */
export function updateUserInDatabase(updatedUser: ToolvaUser): void {
  const db = getUsersDatabase();
  const index = db.findIndex(u => u.id === updatedUser.id || u.email === updatedUser.email);
  if (index !== -1) {
    db[index] = { ...db[index], ...updatedUser };
  } else {
    db.push(updatedUser);
  }
  localStorage.setItem('toolva_user_database', JSON.stringify(db));

  const currentUser = getCurrentUser();
  if (currentUser && (currentUser.id === updatedUser.id || currentUser.email === updatedUser.email)) {
    saveAuth({ ...currentUser, ...updatedUser }, localStorage.getItem('toolva_token') || 'token_active_owner');
  }
}

/**
 * Log user activity.
 */
export function logUserActivity(action: string, details: string): void {
  try {
    const user = getCurrentUser() || getOrCreateCurrentUser();
    const storedLogs = localStorage.getItem('toolva_activity_logs');
    const logs: ActivityLogItem[] = storedLogs ? JSON.parse(storedLogs) : [];

    const newLog: ActivityLogItem = {
      id: Date.now(),
      userId: user.id,
      userEmail: user.email,
      userName: user.name || user.email.split('@')[0],
      userRole: user.role || 'SuperAdmin',
      action,
      details,
      ipAddress: '127.0.0.1 (Local Session)',
      createdAt: new Date().toISOString()
    };

    logs.unshift(newLog);
    localStorage.setItem('toolva_activity_logs', JSON.stringify(logs.slice(0, 100)));
  } catch (err) {
    console.error('Error logging user activity:', err);
  }
}

/**
 * Get logged user activities.
 */
export function getActivityLogs(): ActivityLogItem[] {
  try {
    const storedLogs = localStorage.getItem('toolva_activity_logs');
    if (storedLogs) {
      return JSON.parse(storedLogs);
    }
  } catch {
    // empty fallback
  }

  const currentUser = getOrCreateCurrentUser();
  return [
    {
      id: 1,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name || 'Sugam Arora',
      userRole: currentUser.role || 'SuperAdmin',
      action: 'USER_LOGIN',
      details: 'SuperAdmin session initialized with root access',
      ipAddress: '127.0.0.1 (Local Session)',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name || 'Sugam Arora',
      userRole: currentUser.role || 'SuperAdmin',
      action: 'ROLE_MANAGEMENT',
      details: 'SuperAdmin updated Alex Rivera role to Lead',
      ipAddress: '127.0.0.1 (Local Session)',
      createdAt: new Date(Date.now() - 10 * 60000).toISOString()
    },
    {
      id: 3,
      userId: 'user_2',
      userEmail: 'alex.developer@toolva.com',
      userName: 'Alex Rivera',
      userRole: 'Lead',
      action: 'TOOL_LAUNCH',
      details: 'Launched Claude 3.7 Sonnet tool page',
      ipAddress: '192.168.1.45',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString()
    }
  ];
}

export interface ExpertiseProgress {
  toolsOpenedCount: number;
  role: string;
  nextRole: string;
  nextThreshold: number;
  progressPercent: number;
  unlockedForYou: boolean;
}

export function getUserExpertise(): ExpertiseProgress {
  let toolsOpenedCount = 7;
  try {
    const count = localStorage.getItem('toolva_tools_opened_count');
    if (count) toolsOpenedCount = parseInt(count, 10);
  } catch {
    toolsOpenedCount = 7;
  }

  let role = 'Novice';
  let nextRole = 'Practitioner';
  let nextThreshold = 21;
  let progressPercent = Math.min(100, Math.round((toolsOpenedCount / 21) * 100));
  let unlockedForYou = false;

  if (toolsOpenedCount >= 501) {
    role = 'Master';
    nextRole = 'Master';
    nextThreshold = 10000;
    progressPercent = 100;
    unlockedForYou = true;
  } else if (toolsOpenedCount >= 121) {
    role = 'Expert';
    nextRole = 'Master';
    nextThreshold = 501;
    progressPercent = Math.min(100, Math.round((toolsOpenedCount / 501) * 100));
    unlockedForYou = true;
  } else if (toolsOpenedCount >= 61) {
    role = 'Proficient';
    nextRole = 'Expert';
    nextThreshold = 121;
    progressPercent = Math.min(100, Math.round((toolsOpenedCount / 121) * 100));
    unlockedForYou = true;
  } else if (toolsOpenedCount >= 21) {
    role = 'Practitioner';
    nextRole = 'Proficient';
    nextThreshold = 61;
    progressPercent = Math.min(100, Math.round((toolsOpenedCount / 61) * 100));
    unlockedForYou = true;
  }

  return {
    toolsOpenedCount,
    role,
    nextRole,
    nextThreshold,
    progressPercent,
    unlockedForYou
  };
}

export function recordToolOpened(): void {
  try {
    let count = 7;
    const existing = localStorage.getItem('toolva_tools_opened_count');
    if (existing) count = parseInt(existing, 10);
    count += 1;
    localStorage.setItem('toolva_tools_opened_count', count.toString());
    window.dispatchEvent(new Event('expertise-change'));
    logUserActivity('TOOL_OPENED', `Opened AI tool #${count} in directory`);
  } catch {
    // silent fallback
  }
}

export const recordToolOpen = recordToolOpened;
