import {
  Shield,
  Lock,
  Timer,
  UserX,
  KeyRound,
  ClipboardList,
  Bell,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

// ─── Static Toggle (visual only) ───
function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full ${
        enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-md ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  );
}

// ─── Static Dropdown (visual only) ───
function StaticDropdown({ value, icon: Icon }: { value: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
      <Icon className="h-4 w-4 text-gray-400" />
      {value}
      <ChevronDown className="h-4 w-4 text-gray-400" />
    </div>
  );
}

// ─── Security Card ───
function SecurityCard({
  icon: Icon,
  iconColor,
  title,
  description,
  children,
  toggleEnabled,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  toggleEnabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-3 sm:items-start sm:gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconColor}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
              {title}
            </h3>
            {toggleEnabled !== undefined && <Toggle enabled={toggleEnabled} />}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm dark:text-gray-400">
            {description}
          </p>
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Nav Item ───
function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
        active
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
          : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </div>
  );
}

// ─── Main Page ───
export default function SecuritySettingsPage() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* ─── Mobile Overlay ─── */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" />

      {/* ─── Sidebar ─── */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 max-lg:hidden lg:static lg:flex lg:w-72">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-6 dark:border-gray-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Going</span>
            <span className="text-lg font-bold text-emerald-500">Genius</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Main
          </p>
          <NavItem icon={LayoutDashboard} label="Dashboard" />
          <NavItem icon={Users} label="Users" />
          <NavItem icon={BarChart3} label="Analytics" />

          <p className="mb-3 mt-6 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            System
          </p>
          <NavItem icon={Settings} label="Settings" />
          <NavItem icon={Shield} label="Security" active />

          <p className="mb-3 mt-6 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Support
          </p>
          <NavItem icon={HelpCircle} label="Help Center" />
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-4 dark:border-gray-700">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
              <p className="truncate text-xs text-gray-400">admin@goinggenius.com</p>
            </div>
            <LogOut className="h-4 w-4 shrink-0 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md sm:h-16 sm:px-6 dark:border-gray-700 dark:bg-gray-800/80">
          <div className="flex items-center gap-3">
            {/* Mobile menu icon (always visible on mobile, hidden on desktop) */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 lg:hidden">
              <Menu className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 sm:text-lg dark:text-white">
                Security Settings
              </h1>
              <p className="hidden text-xs text-gray-400 sm:block">
                Manage your account security preferences
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 sm:px-4 sm:py-2.5 sm:text-sm">
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Save Changes</span>
            <span className="sm:hidden">Save</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-8">
          {/* Section Header */}
          <div className="mb-5 flex items-center gap-3 sm:mb-8 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25 sm:h-12 sm:w-12 sm:rounded-2xl">
              <Lock className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-xl dark:text-white">
                Security Configuration
              </h2>
              <p className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
                Configure security features to protect your account and data
              </p>
            </div>
          </div>

          {/* Security Cards */}
          <div className="space-y-3 sm:space-y-4">
            <SecurityCard
              icon={Lock}
              iconColor="bg-emerald-500"
              title="Two-Factor Authentication"
              description="Send OTP to email on login for an extra layer of security"
              toggleEnabled={true}
            />

            <SecurityCard
              icon={Timer}
              iconColor="bg-blue-500"
              title="Session Timeout"
              description="Automatically log out after a period of inactivity to prevent unauthorized access"
            >
              <StaticDropdown value="30 Minutes" icon={Timer} />
            </SecurityCard>

            <SecurityCard
              icon={UserX}
              iconColor="bg-orange-500"
              title="Login Attempts"
              description="Lock the account after a certain number of failed login attempts"
            >
              <StaticDropdown value="5 Attempts" icon={UserX} />
            </SecurityCard>

            <SecurityCard
              icon={KeyRound}
              iconColor="bg-purple-500"
              title="Password Policy"
              description="Enforce strong password requirements including special characters, numbers, and minimum length"
              toggleEnabled={true}
            />

            <SecurityCard
              icon={ClipboardList}
              iconColor="bg-cyan-500"
              title="Activity Log"
              description="Track and record all user activities including login, logout, and sensitive actions"
              toggleEnabled={true}
            />

            <SecurityCard
              icon={Bell}
              iconColor="bg-rose-500"
              title="Login Notifications"
              description="Receive email alerts when a new device or location is used to sign in"
              toggleEnabled={false}
            />

            <SecurityCard
              icon={Shield}
              iconColor="bg-indigo-500"
              title="IP Whitelist"
              description="Restrict access to your account from specific IP addresses only"
              toggleEnabled={false}
            />
          </div>

          {/* Footer Note */}
          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:mt-8 sm:p-5 dark:border-emerald-900/50 dark:bg-emerald-900/10">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 sm:h-8 sm:w-8 dark:bg-emerald-900/50">
                <Shield className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-800 sm:text-sm dark:text-emerald-300">
                  Security Recommendation
                </p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-700/80 sm:text-sm dark:text-emerald-400/80">
                  We strongly recommend keeping Two-Factor Authentication and Activity Log enabled at
                  all times. These features provide essential protection against unauthorized access and
                  help you monitor suspicious activity on your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}