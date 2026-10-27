import { useState, useEffect } from 'react';

// FR-01: 4-column Kanban stages ("To Do", "In Progress", "Review", "Done")
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// DR-03: Assignee constrained to 3 team members from PRD §8
export const TEAM = ['Jordan', 'Teammate B', 'Teammate C'];

// DESIGN.md §2 Color Palette Constants
export const THEME = {
  brandPrimary: '#4F46E5',
  brandAccent:  '#22D3EE',
  surfacePage:  '#09090B',
  surfaceCard:  '#18181B',
  textPrimary:  '#F4F4F5',
  textMuted:    '#A1A1AA',
  typeFeature:  '#38BDF8',
  typeBug:      '#F472B6',
  dueSafe:      '#10B981', // More than 2 days out
  dueWarning:   '#FACC15', // Less than 24 hours
  dueOverdue:   '#FF2A54', // Past due
  dueNeutral:   '#71717A', // Done (overrides date)
};

// M7 task-owner: Helper to get initials & distinct avatar color for each teammate
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(name) {
  if (name === TEAM[0]) return THEME.brandPrimary;
  if (name === TEAM[1]) return THEME.brandAccent;
  return '#A855F7';
}

// M6 tag-style (FR-03 & NFR-03): Distinct SVG icons for Feature vs Bug
export function TypeIcon({ type, className = 'w-3.5 h-3.5' }) {
  if (type === 'bug') {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m8 2 1.88 1.88" />
        <path d="M14.12 3.88 16 2" />
        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
        <path d="M12 20v-9" />
        <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
        <path d="M6 13H2" />
        <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
        <path d="M22 13h-4" />
        <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

// Helper for DR-01 (UUID generation)
export function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
}

// Helpers for DR-02: Convert between "DD-MM-YYYY" (stored) and "YYYY-MM-DD" (HTML date input)
export function formatDateDDMMYYYY(dateObj) {
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const yyyy = dateObj.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function getTodayDDMMYYYY() {
  return formatDateDDMMYYYY(new Date());
}

export function getOffsetDateDDMMYYYY(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return formatDateDDMMYYYY(d);
}

export function toInputDate(ddmmyyyy) {
  if (!ddmmyyyy) return '';
  const parts = ddmmyyyy.split('-');
  if (parts.length !== 3) return '';
  if (parts[0].length === 4) return ddmmyyyy;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm}-${dd}`;
}

export function toDisplayDate(yyyymmdd) {
  if (!yyyymmdd) return '';
  const parts = yyyymmdd.split('-');
  if (parts.length !== 3) return '';
  if (parts[2].length === 4) return yyyymmdd;
  const [yyyy, mm, dd] = parts;
  return `${dd}-${mm}-${yyyy}`;
}

// M8 due-tint (FR-05, NFR-03, DESIGN.md §2 & §4): Calculate urgency state from DD-MM-YYYY dueDate & status
export function getDueUrgency(task) {
  // Done tasks always look neutral, even if previously overdue
  if (task.status === 'done') {
    return {
      key: 'neutral',
      label: 'Done',
      icon: '✓',
      color: THEME.dueNeutral,
      isOverdue: false,
    };
  }

  if (!task.dueDate) {
    return {
      key: 'safe',
      label: 'No Due Date',
      icon: '●',
      color: THEME.dueSafe,
      isOverdue: false,
    };
  }

  const parts = task.dueDate.split('-');
  let dueTime;
  if (parts.length === 3) {
    const [p0, p1, p2] = parts.map(Number);
    // Support both DD-MM-YYYY and YYYY-MM-DD gracefully
    const year = parts[0].length === 4 ? p0 : p2;
    const month = p1 - 1;
    const day = parts[0].length === 4 ? p2 : p0;
    dueTime = new Date(year, month, day, 23, 59, 59, 999).getTime();
  } else {
    dueTime = new Date(task.dueDate).getTime();
  }

  const now = Date.now();
  const hoursRemaining = (dueTime - now) / (1000 * 60 * 60);

  if (hoursRemaining < 0) {
    return {
      key: 'overdue',
      label: 'Past Due',
      icon: '⚠',
      color: THEME.dueOverdue,
      isOverdue: true,
    };
  }

  if (hoursRemaining <= 24) {
    return {
      key: 'warning',
      label: '< 24h Left',
      icon: '⏳',
      color: THEME.dueWarning,
      isOverdue: false,
    };
  }

  return {
    key: 'safe',
    label: '> 2 Days',
    icon: '●',
    color: THEME.dueSafe,
    isOverdue: false,
  };
}

// DR-06: mockTasks pre-populated to showcase all 4 M8 urgency states on load
export const mockTasks = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    title: 'Define DESIGN.md tokens and Tailwind config',
    description: 'Configure dark mode surface, brand, type, and due-state hex tokens.',
    type: 'feature',
    status: 'done',
    creator: TEAM[0],
    assignee: TEAM[0],
    createdDate: getTodayDDMMYYYY(),
    dueDate: getOffsetDateDDMMYYYY(-2), // Done overrides past due -> Neutral (#71717A)
  },
  {
    id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    title: 'Implement 4-column Kanban board layout (FR-01)',
    description: 'Render To Do, In Progress, Review, and Done columns with mockTasks.',
    type: 'feature',
    status: 'in-progress',
    creator: TEAM[0],
    assignee: TEAM[0],
    createdDate: getTodayDDMMYYYY(),
    dueDate: getTodayDDMMYYYY(), // Due today (< 24h) -> Warning (#FACC15)
  },
  {
    id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    title: 'Fix column overflow on 1280px viewports (NFR-06)',
    description: 'Ensure all four columns fit cleanly on desktop without horizontal scroll.',
    type: 'bug',
    status: 'review',
    creator: TEAM[0],
    assignee: TEAM[1],
    createdDate: getOffsetDateDDMMYYYY(-3),
    dueDate: getOffsetDateDDMMYYYY(-1), // Yesterday -> Past Due (#FF2A54)
  },
  {
    id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    title: 'Build CRUD task modal for Milestone 5 (FR-02)',
    description: 'Create modal form to add, edit, and delete tasks in localStorage.',
    type: 'feature',
    status: 'todo',
    creator: TEAM[1],
    assignee: TEAM[2],
    createdDate: getTodayDDMMYYYY(),
    dueDate: getOffsetDateDDMMYYYY(4), // 4 days out -> Safe (#10B981)
  },
];

// NFR-01: Synchronous localStorage persistence (< 50ms, survives reload)
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota errors */
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  // Inject DESIGN.md §3 Google Fonts & dark body background without touching index.css
  useEffect(() => {
    const fontId = 'vibetracker-google-fonts';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@600;700&display=swap';
      document.head.appendChild(link);
    }
    document.body.style.backgroundColor = THEME.surfacePage;
    document.body.style.color = THEME.textPrimary;
  }, []);

  // M4 data-model
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', mockTasks);

  // M7 task-owner toast state
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // M5 crud-modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    creator: TEAM[0],
    assignee: TEAM[0],
    dueDate: '',
    createdDate: '',
  });

  const handleOpenNewModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      type: 'feature',
      status: 'todo',
      creator: TEAM[0],
      assignee: TEAM[0],
      dueDate: toInputDate(getOffsetDateDDMMYYYY(3)),
      createdDate: getTodayDDMMYYYY(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      type: task.type,
      status: task.status,
      creator: task.creator || task.assignee || TEAM[0],
      assignee: task.assignee,
      dueDate: toInputDate(task.dueDate),
      createdDate: task.createdDate || getTodayDDMMYYYY(),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // M7 task-owner (FR-04): Direct "Hand off to..." reassignment + confirmation toast
  const handleHandoffTask = (taskId, newAssignee) => {
    if (!newAssignee) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: newAssignee } : t))
    );
    triggerToast(`Assigned to ${newAssignee}.`);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const formattedDueDate = formData.dueDate ? toDisplayDate(formData.dueDate) : '';

    if (editingTask) {
      const assigneeChanged = editingTask.assignee !== formData.assignee;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: formData.title.trim(),
                description: formData.description.trim(),
                type: formData.type,
                status: formData.status,
                creator: formData.creator || t.creator || TEAM[0],
                assignee: formData.assignee,
                dueDate: formattedDueDate,
              }
            : t
        )
      );
      if (assigneeChanged) {
        triggerToast(`Assigned to ${formData.assignee}.`);
      }
    } else {
      const newTask = {
        id: generateId(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        status: formData.status,
        creator: formData.creator || TEAM[0],
        assignee: formData.assignee,
        createdDate: formData.createdDate || getTodayDDMMYYYY(),
        dueDate: formattedDueDate,
      };
      setTasks((prev) => [...prev, newTask]);
      triggerToast(`Assigned to ${formData.assignee}.`);
    }

    handleCloseModal();
  };

  const handleDeleteTask = () => {
    if (!editingTask) return;
    const confirmed = window.confirm("Delete this task? You can't undo this.");
    if (confirmed) {
      setTasks((prev) => prev.filter((t) => t.id !== editingTask.id));
      handleCloseModal();
    }
  };

  const isModalBug = formData.type === 'bug';
  const modalAccentColor = isModalBug ? THEME.typeBug : THEME.typeFeature;

  return (
    <div
      style={{
        backgroundColor: THEME.surfacePage,
        color: THEME.textPrimary,
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
      className="min-h-screen w-full overflow-x-hidden px-4 py-5"
    >
      {/* M7 Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: THEME.surfaceCard,
            borderColor: THEME.brandAccent,
            color: THEME.textPrimary,
          }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-[13px] font-medium shadow-2xl transition-opacity duration-200"
        >
          <span
            style={{ backgroundColor: THEME.brandAccent }}
            className="h-2 w-2 rounded-full"
          />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto max-w-[1280px]">
        {/* Header with M8 Task Urgency Legend */}
        <header className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h1
              style={{
                color: THEME.brandPrimary,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              className="text-[24px] font-semibold"
            >
              Vibecoding Project Tracker
            </h1>
            <p style={{ color: THEME.textMuted }} className="text-[12px]">
              Team starter
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* M8 due-tint Legend (FR-05 & NFR-03) */}
            <div
              style={{
                backgroundColor: THEME.surfaceCard,
                color: THEME.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
              }}
              className="flex items-center gap-3 rounded-md border border-zinc-800 px-3 py-1.5 text-[11px]"
            >
              <span className="font-semibold text-zinc-300">Urgency:</span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: THEME.dueSafe }}
                  className="h-2.5 w-2.5 rounded-sm"
                />
                &gt; 2 Days
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: THEME.dueWarning }}
                  className="h-2.5 w-2.5 rounded-sm"
                />
                &lt; 24h
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: THEME.dueOverdue }}
                  className="h-2.5 w-2.5 rounded-sm"
                />
                Past Due
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: THEME.dueNeutral }}
                  className="h-2.5 w-2.5 rounded-sm"
                />
                Done
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenNewModal}
              style={{ backgroundColor: THEME.brandPrimary, color: THEME.textPrimary }}
              className="rounded-md px-4 py-2 text-[14px] font-medium transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              + New Task
            </button>
          </div>
        </header>

        {/* M7 task-owner Stretch Strip */}
        <section
          aria-label="Team Active Drivers"
          className="mb-5 grid grid-cols-3 gap-3"
        >
          {TEAM.map((member) => {
            const drivingTasks = tasks.filter(
              (t) => t.assignee === member && t.status === 'in-progress'
            );
            const totalAssigned = tasks.filter((t) => t.assignee === member).length;
            const avatarBg = getAvatarColor(member);

            return (
              <div
                key={member}
                style={{ backgroundColor: THEME.surfaceCard }}
                className="flex items-center justify-between rounded-md border border-zinc-800 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    style={{
                      backgroundColor: `${avatarBg}25`,
                      color: avatarBg,
                      borderColor: `${avatarBg}66`,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold"
                  >
                    {getInitials(member)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">
                      {member}
                    </p>
                    <p
                      style={{ color: THEME.textMuted }}
                      className="truncate text-[11px]"
                    >
                      {drivingTasks.length > 0
                        ? `Driving: ${drivingTasks[0].title}`
                        : 'No task in progress'}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    color: THEME.textMuted,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  className="ml-2 shrink-0 rounded bg-zinc-900 px-2 py-0.5 text-[11px] border border-zinc-800"
                >
                  {totalAssigned} {totalAssigned === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            );
          })}
        </section>

        {/* TODO M11 anchors: Anchor Banner (FR-08) goes here */}

        {/* M4 data-model (FR-01 & NFR-06): 4-column board */}
        <main className="grid grid-cols-4 gap-3">
          {STAGES.map((stage) => {
            const columnTasks = tasks.filter((task) => task.status === stage.id);

            return (
              <section
                key={stage.id}
                className="flex min-h-[520px] min-w-0 flex-col rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
              >
                {/* Column Header */}
                <div className="mb-3 flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    className="truncate text-[16px] font-semibold uppercase tracking-wide"
                  >
                    {stage.label}
                  </h2>
                  <span
                    style={{
                      backgroundColor: THEME.surfaceCard,
                      color: THEME.textMuted,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                    className="rounded border border-zinc-800 px-2 py-0.5 text-[12px]"
                  >
                    {columnTasks.length}
                  </span>
                </div>

                {/* Task Cards */}
                <div className="flex flex-1 flex-col gap-2.5">
                  {columnTasks.length === 0 ? (
                    <div
                      style={{ color: THEME.textMuted }}
                      className="flex flex-1 items-center justify-center rounded-md border border-dashed border-zinc-800 p-4 text-center text-[12px]"
                    >
                      No tasks here yet.
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const isBug = task.type === 'bug';
                      const accentHex = isBug ? THEME.typeBug : THEME.typeFeature;
                      const avatarBg = getAvatarColor(task.assignee);
                      const creatorName = task.creator || task.assignee || TEAM[0];

                      // M8 due-tint calculation (FR-05 & DESIGN.md §2 / §4)
                      const urgency = getDueUrgency(task);

                      return (
                        <article
                          key={task.id}
                          onClick={() => handleOpenEditModal(task)}
                          style={{
                            backgroundColor: THEME.surfaceCard,
                            borderColor: urgency.color,
                            boxShadow:
                              urgency.key === 'overdue'
                                ? `0 0 14px -2px ${THEME.dueOverdue}55`
                                : urgency.key === 'warning'
                                ? `0 0 12px -3px ${THEME.dueWarning}44`
                                : 'none',
                            opacity: task.status === 'done' ? 0.82 : 1,
                          }}
                          className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-md border p-3 pl-4 transition hover:brightness-110"
                        >
                          {/* DESIGN.md §4: Bright red top stripe when overdue */}
                          {urgency.isOverdue && (
                            <div
                              style={{ backgroundColor: THEME.dueOverdue }}
                              className="absolute inset-x-0 top-0 h-1"
                              aria-hidden="true"
                            />
                          )}

                          {/* M6 tag-style: Left accent stripe for Feature (#38BDF8) vs Bug (#F472B6) */}
                          <div
                            style={{
                              backgroundColor:
                                task.status === 'done' ? THEME.dueNeutral : accentHex,
                            }}
                            className="absolute inset-y-0 left-0 w-1.5"
                            aria-hidden="true"
                          />

                          {/* Card Top: Shortened UUID + M6 Type Badge */}
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span
                              title={task.id}
                              style={{
                                color: THEME.textMuted,
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                              className="text-[11px]"
                            >
                              #{task.id.slice(0, 8)}
                            </span>

                            <span
                              style={{
                                backgroundColor: `${accentHex}20`,
                                color: accentHex,
                                borderColor: `${accentHex}66`,
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                              className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium uppercase"
                            >
                              <TypeIcon type={task.type} className="h-3 w-3" />
                              {task.type}
                            </span>
                          </div>

                          {/* Card Title & Description */}
                          <div className="mb-3">
                            <h3
                              className={`text-[14px] font-medium leading-snug ${
                                task.status === 'done' ? 'line-through opacity-75' : ''
                              }`}
                            >
                              {task.title}
                            </h3>
                            {task.description && (
                              <p
                                style={{ color: THEME.textMuted }}
                                className="mt-1 line-clamp-2 text-[12px]"
                              >
                                {task.description}
                              </p>
                            )}
                          </div>

                          {/* M7 & M8 Footer: Assignee Avatar + Urgency-Tinted Due Date Pill */}
                          <div className="border-t border-zinc-800/80 pt-2.5 space-y-2">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex min-w-0 items-center gap-1.5">
                                <span
                                  style={{
                                    backgroundColor: `${avatarBg}25`,
                                    color: avatarBg,
                                    borderColor: `${avatarBg}66`,
                                    fontFamily: "'JetBrains Mono', monospace",
                                  }}
                                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold"
                                  title={`Assigned to ${task.assignee}`}
                                >
                                  {getInitials(task.assignee)}
                                </span>
                                <span
                                  style={{ color: THEME.textPrimary }}
                                  className="truncate text-[12px] font-medium"
                                >
                                  {task.assignee}
                                </span>
                              </div>

                              {/* M8 due-tint badge (FR-05 & NFR-03 icon + status text + date) */}
                              <span
                                style={{
                                  backgroundColor: `${urgency.color}20`,
                                  color: urgency.color,
                                  borderColor: `${urgency.color}66`,
                                  fontFamily: "'JetBrains Mono', monospace",
                                }}
                                title={`Urgency: ${urgency.label}`}
                                className="inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium"
                              >
                                <span aria-hidden="true">{urgency.icon}</span>
                                <span>
                                  {task.status === 'done'
                                    ? 'Done'
                                    : urgency.isOverdue
                                    ? `Overdue · ${task.dueDate}`
                                    : task.dueDate || urgency.label}
                                </span>
                              </span>
                            </div>

                            {/* Creator label (FR-04) + Quick "Hand off to..." dropdown */}
                            <div
                              className="flex items-center justify-between gap-2 pt-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span
                                style={{ color: THEME.textMuted }}
                                className="truncate text-[10px]"
                                title={`Created by ${creatorName}`}
                              >
                                By: {creatorName}
                              </span>

                              <select
                                aria-label={`Hand off ${task.title} to teammate`}
                                value=""
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleHandoffTask(task.id, e.target.value);
                                  }
                                }}
                                style={{
                                  backgroundColor: THEME.surfacePage,
                                  color: THEME.textMuted,
                                }}
                                className="rounded border border-zinc-700 px-1.5 py-0.5 text-[11px] transition hover:border-cyan-400 hover:text-white focus:outline-none"
                              >
                                <option value="" disabled>
                                  Hand off to…
                                </option>
                                {TEAM.filter((m) => m !== task.assignee).map(
                                  (member) => (
                                    <option key={member} value={member}>
                                      {member}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* M5, M6, M7 & M8 CRUD Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: THEME.surfaceCard,
              color: THEME.textPrimary,
              borderColor: `${modalAccentColor}66`,
            }}
            className="relative w-full max-w-lg overflow-hidden rounded-lg border p-6 pl-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* M6 consistent left accent stripe inside the modal */}
            <div
              style={{ backgroundColor: modalAccentColor }}
              className="absolute inset-y-0 left-0 w-1.5"
              aria-hidden="true"
            />

            <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <h2
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  className="text-[18px] font-semibold"
                >
                  {editingTask ? 'Task Details' : 'New Task'}
                </h2>
                <span
                  style={{
                    backgroundColor: `${modalAccentColor}20`,
                    color: modalAccentColor,
                    borderColor: `${modalAccentColor}66`,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium uppercase"
                >
                  <TypeIcon type={formData.type} className="h-3 w-3" />
                  {formData.type}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                style={{ color: THEME.textMuted }}
                className="rounded px-2 py-1 hover:bg-zinc-800 hover:text-white"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {editingTask && (
              <div
                style={{
                  color: THEME.textMuted,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                className="mb-3 flex items-center justify-between text-[11px]"
              >
                <span>ID: {editingTask.id}</span>
                <span>Created by: {formData.creator}</span>
              </div>
            )}

            <form onSubmit={handleSaveTask} className="space-y-4">
              {/* Task Title */}
              <div>
                <label
                  style={{ color: THEME.textMuted }}
                  className="mb-1 block text-[12px] font-medium"
                >
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Implement User Authentication"
                  style={{
                    backgroundColor: THEME.surfacePage,
                    color: THEME.textPrimary,
                  }}
                  className="w-full rounded-md border border-zinc-700 px-3 py-2 text-[14px] placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  style={{ color: THEME.textMuted }}
                  className="mb-1 block text-[12px] font-medium"
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the task scope or bug reproduction steps..."
                  style={{
                    backgroundColor: THEME.surfacePage,
                    color: THEME.textPrimary,
                  }}
                  className="w-full rounded-md border border-zinc-700 px-3 py-2 text-[14px] placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Type & Status Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    style={{ color: THEME.textMuted }}
                    className="mb-1 block text-[12px] font-medium"
                  >
                    Type (FR-03)
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    style={{
                      backgroundColor: THEME.surfacePage,
                      color: modalAccentColor,
                      borderColor: `${modalAccentColor}88`,
                    }}
                    className="w-full rounded-md border px-3 py-2 text-[14px] font-medium focus:outline-none"
                  >
                    <option value="feature">✨ Feature</option>
                    <option value="bug">🐛 Bug</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{ color: THEME.textMuted }}
                    className="mb-1 block text-[12px] font-medium"
                  >
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    style={{
                      backgroundColor: THEME.surfacePage,
                      color: THEME.textPrimary,
                    }}
                    className="w-full rounded-md border border-zinc-700 px-3 py-2 text-[14px] focus:border-indigo-500 focus:outline-none"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* M7: Task Creator (FR-04), Assignee / Hand off to (DR-03) & Due Date (DR-02) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label
                    style={{ color: THEME.textMuted }}
                    className="mb-1 block text-[12px] font-medium"
                  >
                    Creator (FR-04)
                  </label>
                  <select
                    value={formData.creator}
                    onChange={(e) =>
                      setFormData({ ...formData, creator: e.target.value })
                    }
                    style={{
                      backgroundColor: THEME.surfacePage,
                      color: THEME.textPrimary,
                    }}
                    className="w-full rounded-md border border-zinc-700 px-2.5 py-2 text-[13px] focus:border-indigo-500 focus:outline-none"
                  >
                    {TEAM.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{ color: THEME.textMuted }}
                    className="mb-1 block text-[12px] font-medium"
                  >
                    Hand off / Assignee
                  </label>
                  <select
                    value={formData.assignee}
                    onChange={(e) =>
                      setFormData({ ...formData, assignee: e.target.value })
                    }
                    style={{
                      backgroundColor: THEME.surfacePage,
                      color: THEME.textPrimary,
                    }}
                    className="w-full rounded-md border border-zinc-700 px-2.5 py-2 text-[13px] focus:border-indigo-500 focus:outline-none"
                  >
                    {TEAM.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{ color: THEME.textMuted }}
                    className="mb-1 block text-[12px] font-medium"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    style={{
                      backgroundColor: THEME.surfacePage,
                      color: THEME.textPrimary,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                    className="w-full rounded-md border border-zinc-700 px-2.5 py-2 text-[12px] focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Created Date & Live Urgency Preview (DR-02 & FR-05) */}
              <div
                style={{
                  color: THEME.textMuted,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                className="flex items-center justify-between pt-1 text-[11px]"
              >
                <span>Created Date: {formData.createdDate}</span>
                {formData.dueDate && (
                  <span>
                    Stored Due Date: {toDisplayDate(formData.dueDate)} (
                    {
                      getDueUrgency({
                        status: formData.status,
                        dueDate: toDisplayDate(formData.dueDate),
                      }).label
                    }
                    )
                  </span>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    style={{
                      backgroundColor: `${THEME.dueOverdue}22`,
                      color: THEME.dueOverdue,
                      borderColor: `${THEME.dueOverdue}66`,
                    }}
                    className="rounded-md border px-3 py-2 text-[13px] font-medium transition hover:opacity-90"
                  >
                    Delete Task
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      backgroundColor: THEME.surfacePage,
                      color: THEME.textMuted,
                    }}
                    className="rounded-md border border-zinc-700 px-4 py-2 text-[13px] font-medium transition hover:border-zinc-500 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: THEME.brandPrimary,
                      color: THEME.textPrimary,
                    }}
                    className="rounded-md px-4 py-2 text-[13px] font-medium transition hover:opacity-90"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}