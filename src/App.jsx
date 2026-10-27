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

// M9 & DR-04: Constrained AI Context Tool enum from PRD §5
export const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

// M11 & DR-05: Deliverable Anchor Board enum ("Presentation", "Demo", "Report", "Documentation")
export const INITIAL_DELIVERABLES = [
  {
    deliverableType: 'presentation',
    label: 'Presentation',
    placeholder: 'Enter presentation URL...',
    url: '',
    statusDot: false,
  },
  {
    deliverableType: 'demo',
    label: 'Demo',
    placeholder: 'Enter live demo URL...',
    url: 'https://vc-hackathon-hub.vercel.app',
    statusDot: true,
  },
  {
    deliverableType: 'report',
    label: 'Report',
    placeholder: 'Enter report URL...',
    url: '',
    statusDot: false,
  },
  {
    deliverableType: 'documentation',
    label: 'Documentation',
    placeholder: 'Enter documentation URL...',
    url: '',
    statusDot: false,
  },
];

// M9: Default Markdown template pre-filled for new tasks
export const DEFAULT_CONTEXT_TEMPLATE = `## Context

**Background**
Describe the goal of this task and how it fits into the architecture.

**Constraints**
- Only modify src/App.jsx (do not touch index.css or main.jsx)
- Persist all state to localStorage under < 50ms (NFR-01)

**Tried so far**
Initial component scaffolding and Tailwind token integration.

**Pick up**
Next step to implement or debug in the next AI prompt session.`;

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

// M10 copy-context (FR-07): Clipboard SVG icon
export function CopyIcon({ copied = false, className = 'w-3.5 h-3.5' }) {
  if (copied) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
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

// M9 (FR-06 & DR-04): Format ISO timestamp into human-readable relative time ("last updated 2h ago")
export function formatRelativeTime(isoString) {
  if (!isoString) return 'Not saved yet';
  const time = new Date(isoString).getTime();
  if (Number.isNaN(time)) return 'Not saved yet';

  const diffSeconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (diffSeconds < 45) return 'just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// M10 copy-context (FR-07 & NFR-05): Format clean UTF-8 Markdown briefing for external AI chat
export function buildPromptContextMarkdown(task) {
  const stageLabel =
    STAGES.find((s) => s.id === task.status)?.label || task.status || 'To Do';
  const toolName = task.contextTool || 'Claude';
  const dueDisplay = task.dueDate ? toDisplayDate(task.dueDate) : 'None';
  const descriptionBlock = task.description?.trim()
    ? task.description.trim()
    : '_No description provided._';
  const contextBlock = task.context?.trim()
    ? task.context.trim()
    : DEFAULT_CONTEXT_TEMPLATE;

  return `# Vibecoding Task Briefing: ${task.title || 'Untitled Task'}

- **Task ID:** \`${task.id || 'draft'}\`
- **Type:** ${(task.type || 'feature').toUpperCase()}
- **Stage:** ${stageLabel}
- **Assignee:** ${task.assignee || TEAM[0]} (Created by: ${task.creator || task.assignee || TEAM[0]})
- **Due Date:** ${dueDisplay}
- **Target AI Tool:** ${toolName}
- **Context Updated:** ${task.contextUpdatedAt || new Date().toISOString()}

## Task Description
${descriptionBlock}

${contextBlock}
`;
}

// M10 (NFR-05): Fast UTF-8 clipboard helper (< 150ms response)
export async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    return true;
  } finally {
    document.body.removeChild(textArea);
  }
}

// M9 Stretch: Lightweight Markdown preview renderer for the Context field
export function renderMarkdownPreview(mdText = '') {
  if (!mdText.trim()) {
    return (
      <p style={{ color: THEME.textMuted }} className="italic text-[12px]">
        No prompt context written yet.
      </p>
    );
  }

  const lines = mdText.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h4
          key={idx}
          style={{ color: THEME.brandAccent, fontFamily: "'Space Grotesk', sans-serif" }}
          className="mt-1 mb-1 text-[13px] font-semibold uppercase tracking-wide"
        >
          {trimmed.replace(/^##\s+/, '')}
        </h4>
      );
    }
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
      return (
        <p
          key={idx}
          style={{ color: THEME.textPrimary }}
          className="mt-1.5 text-[12px] font-semibold"
        >
          {trimmed.slice(2, -2)}
        </p>
      );
    }
    if (trimmed.startsWith('- ')) {
      return (
        <li
          key={idx}
          style={{ color: THEME.textMuted }}
          className="ml-4 list-disc text-[12px] leading-relaxed"
        >
          {trimmed.slice(2)}
        </li>
      );
    }
    return (
      <p
        key={idx}
        style={{ color: THEME.textMuted }}
        className="text-[12px] leading-relaxed"
      >
        {line}
      </p>
    );
  });
}

// M8 due-tint (FR-05, NFR-03, DESIGN.md §2 & §4): Calculate urgency state from DD-MM-YYYY dueDate & status
export function getDueUrgency(task) {
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

// DR-06 & DR-04: mockTasks pre-populated with M8 urgency states and M9 prompt contexts
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
    dueDate: getOffsetDateDDMMYYYY(-2),
    context: `## Context

**Background**
Configured DESIGN.md palette tokens in tailwind.config.js and THEME object.

**Constraints**
- Maintain WCAG 2.1 AA contrast ratios on #09090B and #18181B surfaces (NFR-03)
- Use Space Grotesk, Inter, and JetBrains Mono fonts

**Tried so far**
Verified all 4 urgency tokens (#10B981, #FACC15, #FF2A54, #71717A).

**Pick up**
Completed and verified across all cards.`,
    contextTool: 'Claude',
    contextUpdatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
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
    dueDate: getTodayDDMMYYYY(),
    context: `## Context

**Background**
Build the core 4-column Kanban board with localStorage persistence and M9 prompt context support.

**Constraints**
- Do not modify index.css or main.jsx
- Fit all 4 columns within 1280px desktop viewport (NFR-06)

**Tried so far**
Implemented M4-M11 milestones plus M12 drag-and-drop and search/filter bar.

**Pick up**
Ready for M13 pitch and final report screenshots.`,
    contextTool: 'Cursor',
    contextUpdatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
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
    dueDate: getOffsetDateDDMMYYYY(-1),
    context: `## Context

**Background**
Long task titles or UUID strings were stretching flex items inside the 4-column grid.

**Constraints**
- Keep max-w-[1280px] container without horizontal scrollbar

**Tried so far**
Added min-w-0 and truncate classes to column headers and card footers.

**Pick up**
Verified layout stability with Anchor Banner (M11) and Search/Filter bar (FR-10).`,
    contextTool: 'ChatGPT',
    contextUpdatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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
    dueDate: getOffsetDateDDMMYYYY(4),
    context: `## Context

**Background**
Users need a single modal to create, edit, and delete tasks along with embedded AI prompt context.

**Constraints**
- Persist changes to localStorage in under 50ms (NFR-01)
- Copy UTF-8 Markdown to clipboard with confirmation toast in under 150ms (NFR-05)

**Tried so far**
Added form fields for title, description, type, status, assignee, due date, M9 context, and M10 Copy Context button.

**Pick up**
Test dragging cards across columns or filtering via the FR-10 search bar.`,
    contextTool: 'Lovable',
    contextUpdatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

// NFR-01: Synchronous localStorage persistence (< 50ms, survives reload)
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        const parsed = JSON.parse(raw);
        if (key === 'vibetracker.tasks' && Array.isArray(parsed)) {
          return parsed.map((t, i) => ({
            ...t,
            context:
              typeof t.context === 'string'
                ? t.context
                : mockTasks[i]?.context || DEFAULT_CONTEXT_TEMPLATE,
            contextTool: t.contextTool || mockTasks[i]?.contextTool || 'Claude',
            contextUpdatedAt:
              t.contextUpdatedAt ||
              mockTasks[i]?.contextUpdatedAt ||
              new Date().toISOString(),
          }));
        }
        return parsed;
      }
      return initialValue;
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

  // M11 project-deliverables (FR-08, DR-05, NFR-01): Persistent 4-deliverable anchor state
  const [deliverables, setDeliverables] = useLocalStorage(
    'vibetracker.deliverables',
    INITIAL_DELIVERABLES
  );

  // M12 secret-sauce: Search & Filter state (FR-10, DR-06, NFR-02)
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'feature' | 'bug'
  const [myTasksOnly, setMyTasksOnly] = useState(false);

  // M12 secret-sauce: HTML5 Drag-and-Drop state (FR-09, DESIGN.md §4)
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverStageId, setDragOverStageId] = useState(null);

  // Update URL and boolean statusDot automatically on change (DR-05)
  const handleDeliverableChange = (deliverableType, newUrl) => {
    const hasLink = Boolean(newUrl && newUrl.trim().length > 0);
    setDeliverables((prev) =>
      prev.map((item) =>
        item.deliverableType === deliverableType
          ? {
              ...item,
              url: newUrl,
              statusDot: hasLink,
            }
          : item
      )
    );
  };

  // M7, M10 & M12 toast + copied feedback state
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedTaskId, setCopiedTaskId] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!copiedTaskId) return;
    const timer = setTimeout(() => setCopiedTaskId(null), 1800);
    return () => clearTimeout(timer);
  }, [copiedTaskId]);

  // M10 copy-context (FR-07 & NFR-05): Copy task + prompt context Markdown in < 150ms
  const handleCopyContext = async (taskLike, sourceKey) => {
    const markdownBlock = buildPromptContextMarkdown(taskLike);
    await copyTextToClipboard(markdownBlock);
    setCopiedTaskId(sourceKey || taskLike.id || 'modal');
    triggerToast('Copied. Paste it into your AI.');
  };

  // M12 Drag-and-Drop Handlers (FR-09)
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverStageId(null);
  };

  const handleColumnDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleColumnDragLeave = (stageId) => {
    if (dragOverStageId === stageId) {
      setDragOverStageId(null);
    }
  };

  const handleColumnDrop = (e, targetStageId) => {
    e.preventDefault();
    const taskId = draggedTaskId || e.dataTransfer.getData('text/plain');
    setDraggedTaskId(null);
    setDragOverStageId(null);

    if (!taskId) return;
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.status === targetStageId) return;

    const stageLabel =
      STAGES.find((s) => s.id === targetStageId)?.label || targetStageId;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: targetStageId } : t
      )
    );
    triggerToast(`Moved to ${stageLabel}.`);
  };

  // M12 Filtered tasks calculation (< 100ms response, FR-10, DR-06, NFR-02)
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTasks = tasks.filter((task) => {
    if (typeFilter !== 'all' && task.type !== typeFilter) {
      return false;
    }
    if (myTasksOnly && task.assignee !== TEAM[0]) {
      return false;
    }
    if (normalizedQuery) {
      const haystack = [
        task.title,
        task.description,
        task.id,
        task.assignee,
        task.contextTool,
        task.context,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });

  const hasActiveFilters =
    normalizedQuery.length > 0 || typeFilter !== 'all' || myTasksOnly;

  // M5 crud-modal + M9 task-context state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showContextPreview, setShowContextPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    creator: TEAM[0],
    assignee: TEAM[0],
    dueDate: '',
    createdDate: '',
    context: DEFAULT_CONTEXT_TEMPLATE,
    contextTool: 'Claude',
    contextUpdatedAt: '',
  });

  const handleOpenNewModal = () => {
    const nowIso = new Date().toISOString();
    setEditingTask(null);
    setShowContextPreview(false);
    setFormData({
      title: '',
      description: '',
      type: 'feature',
      status: 'todo',
      creator: TEAM[0],
      assignee: TEAM[0],
      dueDate: toInputDate(getOffsetDateDDMMYYYY(3)),
      createdDate: getTodayDDMMYYYY(),
      context: DEFAULT_CONTEXT_TEMPLATE,
      contextTool: 'Claude',
      contextUpdatedAt: nowIso,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setShowContextPreview(false);
    setFormData({
      title: task.title,
      description: task.description || '',
      type: task.type,
      status: task.status,
      creator: task.creator || task.assignee || TEAM[0],
      assignee: task.assignee,
      dueDate: toInputDate(task.dueDate),
      createdDate: task.createdDate || getTodayDDMMYYYY(),
      context:
        typeof task.context === 'string' && task.context.length > 0
          ? task.context
          : DEFAULT_CONTEXT_TEMPLATE,
      contextTool: task.contextTool || 'Claude',
      contextUpdatedAt: task.contextUpdatedAt || new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setShowContextPreview(false);
  };

  // M9: Update context or AI tool and refresh contextUpdatedAt ISO timestamp automatically
  const handleContextChange = (newContext) => {
    setFormData((prev) => ({
      ...prev,
      context: newContext,
      contextUpdatedAt: new Date().toISOString(),
    }));
  };

  const handleContextToolChange = (newTool) => {
    setFormData((prev) => ({
      ...prev,
      contextTool: newTool,
      contextUpdatedAt: new Date().toISOString(),
    }));
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
    const nowIso = new Date().toISOString();

    if (editingTask) {
      const assigneeChanged = editingTask.assignee !== formData.assignee;
      const contextChanged =
        editingTask.context !== formData.context ||
        editingTask.contextTool !== formData.contextTool;

      const updatedTimestamp = contextChanged
        ? nowIso
        : formData.contextUpdatedAt || editingTask.contextUpdatedAt || nowIso;

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
                context: formData.context,
                contextTool: formData.contextTool || 'Claude',
                contextUpdatedAt: updatedTimestamp,
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
        context: formData.context,
        contextTool: formData.contextTool || 'Claude',
        contextUpdatedAt: formData.contextUpdatedAt || nowIso,
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
  const isModalCopied = copiedTaskId === 'modal-context';

  return (
    <div
      style={{
        backgroundColor: THEME.surfacePage,
        color: THEME.textPrimary,
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
      className="min-h-screen w-full overflow-x-hidden px-4 py-5"
    >
      {/* M7, M10 & M12 Toast Notification (FR-04, FR-07, FR-09, NFR-05) */}
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
              Team JORDAN · All you need is Jordan
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
          className="mb-4 grid grid-cols-3 gap-3"
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
                  className="ml-2 shrink-0 rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[11px]"
                >
                  {totalAssigned} {totalAssigned === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            );
          })}
        </section>

        {/* M11 project-deliverables: Deliverable Anchor Banner (FR-08, DR-05, NFR-01, NFR-03) */}
        <section
          aria-label="Deliverable Anchor Board"
          className="mb-4 grid grid-cols-4 gap-3"
        >
          {deliverables.map((item) => {
            const isLinked = Boolean(item.url && item.url.trim().length > 0);
            const safeHref =
              isLinked && /^https?:\/\//i.test(item.url.trim())
                ? item.url.trim()
                : isLinked
                ? `https://${item.url.trim()}`
                : null;

            return (
              <div
                key={item.deliverableType}
                style={{
                  backgroundColor: THEME.surfaceCard,
                  borderColor: isLinked ? `${THEME.brandAccent}66` : '#27272A',
                }}
                className="flex flex-col justify-between rounded-md border p-3 transition"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label
                    htmlFor={`deliverable-${item.deliverableType}`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    className="truncate text-[13px] font-semibold tracking-wide"
                  >
                    {item.label}
                  </label>

                  {/* NFR-03 & DR-05: Status indicator (empty ring vs filled dot + text label) */}
                  <div className="flex items-center gap-1.5">
                    {safeHref && (
                      <a
                        href={safeHref}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: THEME.brandAccent,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                        className="rounded border border-cyan-500/40 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-medium hover:bg-cyan-500/20"
                        title={`Open ${item.label} link in new tab`}
                      >
                        Open ↗
                      </a>
                    )}
                    <span
                      style={{
                        color: isLinked ? THEME.dueSafe : THEME.textMuted,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-medium"
                      title={
                        isLinked
                          ? `${item.label} URL linked`
                          : `${item.label} URL not added yet`
                      }
                    >
                      <span
                        style={{
                          backgroundColor: isLinked
                            ? THEME.dueSafe
                            : 'transparent',
                          borderColor: isLinked
                            ? THEME.dueSafe
                            : THEME.textMuted,
                          boxShadow: isLinked
                            ? `0 0 8px ${THEME.dueSafe}`
                            : 'none',
                        }}
                        className="inline-block h-2.5 w-2.5 rounded-full border-2 transition-all"
                        aria-hidden="true"
                      />
                      <span>{isLinked ? 'Linked' : 'Empty'}</span>
                    </span>
                  </div>
                </div>

                <input
                  id={`deliverable-${item.deliverableType}`}
                  type="url"
                  value={item.url}
                  onChange={(e) =>
                    handleDeliverableChange(item.deliverableType, e.target.value)
                  }
                  placeholder={item.placeholder || 'Enter URL...'}
                  style={{
                    backgroundColor: THEME.surfacePage,
                    color: THEME.textPrimary,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  className="w-full rounded border border-zinc-700/90 px-2.5 py-1.5 text-[11px] placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            );
          })}
        </section>

        {/* M12 secret-sauce: Search & Filter Toolbar (FR-10, DR-06, NFR-02) */}
        <section
          aria-label="Board Search and Filters"
          style={{ backgroundColor: THEME.surfaceCard }}
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-800 px-3.5 py-2.5"
        >
          {/* Search Input (DR-06 searchQuery) */}
          <div className="relative flex min-w-[240px] flex-1 items-center">
            <svg
              className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, IDs, AI tools, or prompt context..."
              aria-label="Search tasks"
              style={{
                backgroundColor: THEME.surfacePage,
                color: THEME.textPrimary,
              }}
              className="w-full rounded border border-zinc-700/90 py-1.5 pl-8 pr-3 text-[12px] placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Type Filter Pills (DR-06 typeFilter: all | feature | bug) + My Tasks Toggle (myTasksOnly) */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Filter by task type"
              style={{
                backgroundColor: THEME.surfacePage,
                fontFamily: "'JetBrains Mono', monospace",
              }}
              className="inline-flex items-center rounded border border-zinc-800 p-0.5 text-[11px]"
            >
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                style={{
                  backgroundColor:
                    typeFilter === 'all' ? THEME.brandPrimary : 'transparent',
                  color:
                    typeFilter === 'all' ? THEME.textPrimary : THEME.textMuted,
                }}
                className="rounded px-2.5 py-1 font-medium transition"
              >
                All ({tasks.length})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('feature')}
                style={{
                  backgroundColor:
                    typeFilter === 'feature'
                      ? `${THEME.typeFeature}25`
                      : 'transparent',
                  color:
                    typeFilter === 'feature'
                      ? THEME.typeFeature
                      : THEME.textMuted,
                }}
                className="inline-flex items-center gap-1 rounded px-2.5 py-1 font-medium transition"
              >
                <TypeIcon type="feature" className="h-3 w-3" />
                Features
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('bug')}
                style={{
                  backgroundColor:
                    typeFilter === 'bug' ? `${THEME.typeBug}25` : 'transparent',
                  color: typeFilter === 'bug' ? THEME.typeBug : THEME.textMuted,
                }}
                className="inline-flex items-center gap-1 rounded px-2.5 py-1 font-medium transition"
              >
                <TypeIcon type="bug" className="h-3 w-3" />
                Bugs
              </button>
            </div>

            {/* My Tasks Only Toggle (FR-10 & DR-06 myTasksOnly) */}
            <button
              type="button"
              onClick={() => setMyTasksOnly((prev) => !prev)}
              aria-pressed={myTasksOnly}
              style={{
                backgroundColor: myTasksOnly
                  ? `${THEME.brandAccent}22`
                  : THEME.surfacePage,
                color: myTasksOnly ? THEME.brandAccent : THEME.textMuted,
                borderColor: myTasksOnly ? THEME.brandAccent : '#3F3F46',
                fontFamily: "'JetBrains Mono', monospace",
              }}
              className="inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-[11px] font-medium transition hover:border-cyan-400 hover:text-white"
            >
              <span
                style={{
                  backgroundColor: myTasksOnly
                    ? THEME.brandAccent
                    : 'transparent',
                  borderColor: myTasksOnly
                    ? THEME.brandAccent
                    : THEME.textMuted,
                }}
                className="inline-block h-2 w-2 rounded-full border"
              />
              My Tasks Only ({TEAM[0]})
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setMyTasksOnly(false);
                }}
                style={{
                  color: THEME.textMuted,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                className="rounded border border-zinc-700 px-2.5 py-1.5 text-[11px] hover:border-zinc-500 hover:text-white"
              >
                Reset ({filteredTasks.length}/{tasks.length})
              </button>
            )}
          </div>
        </section>

        {/* M4 data-model & M12 Drag-and-Drop (FR-01, FR-09 & NFR-06): 4-column board */}
        <main className="grid grid-cols-4 gap-3">
          {STAGES.map((stage) => {
            const columnTasks = filteredTasks.filter(
              (task) => task.status === stage.id
            );
            const isDropTarget = dragOverStageId === stage.id;

            return (
              <section
                key={stage.id}
                onDragOver={(e) => handleColumnDragOver(e, stage.id)}
                onDragLeave={() => handleColumnDragLeave(stage.id)}
                onDrop={(e) => handleColumnDrop(e, stage.id)}
                style={{
                  borderColor: isDropTarget ? THEME.brandAccent : '#27272A',
                  backgroundColor: isDropTarget
                    ? 'rgba(34, 211, 238, 0.06)'
                    : 'rgba(24, 24, 27, 0.5)',
                }}
                className="flex min-h-[520px] min-w-0 flex-col rounded-lg border p-3 transition-colors"
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
                      style={{
                        color: THEME.textMuted,
                        borderColor: isDropTarget ? THEME.brandAccent : '#27272A',
                      }}
                      className="flex flex-1 items-center justify-center rounded-md border border-dashed p-4 text-center text-[12px]"
                    >
                      {isDropTarget
                        ? `Drop card into ${stage.label}`
                        : 'No tasks here yet.'}
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const isBug = task.type === 'bug';
                      const accentHex = isBug ? THEME.typeBug : THEME.typeFeature;
                      const avatarBg = getAvatarColor(task.assignee);
                      const creatorName = task.creator || task.assignee || TEAM[0];
                      const isCardCopied = copiedTaskId === task.id;
                      const isBeingDragged = draggedTaskId === task.id;

                      // M8 due-tint calculation (FR-05 & DESIGN.md §2 / §4)
                      const urgency = getDueUrgency(task);

                      return (
                        <article
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
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
                            opacity: isBeingDragged
                              ? 0.45
                              : task.status === 'done'
                              ? 0.82
                              : 1,
                          }}
                          title="Click to edit task or drag across columns (FR-09)"
                          className="group relative flex cursor-grab active:cursor-grabbing flex-col justify-between overflow-hidden rounded-md border p-3 pl-4 transition hover:brightness-110"
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

                          {/* Card Top: Drag Grip + Shortened UUID + M10 Copy Context Pill + M6 Type Badge */}
                          <div className="mb-2 flex items-center justify-between gap-1.5">
                            <span
                              title={`Task ID: ${task.id} (Drag to move)`}
                              style={{
                                color: THEME.textMuted,
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                              className="inline-flex items-center gap-1 truncate text-[11px]"
                            >
                              <span aria-hidden="true" className="opacity-60">
                                ⋮⋮
                              </span>
                              #{task.id.slice(0, 6)}
                            </span>

                            <div
                              className="flex shrink-0 items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* M10 Copy Context button on card (FR-07) */}
                              <button
                                type="button"
                                onClick={() => handleCopyContext(task, task.id)}
                                style={{
                                  backgroundColor: isCardCopied
                                    ? `${THEME.dueSafe}28`
                                    : `${THEME.brandAccent}18`,
                                  color: isCardCopied
                                    ? THEME.dueSafe
                                    : THEME.brandAccent,
                                  borderColor: isCardCopied
                                    ? THEME.dueSafe
                                    : `${THEME.brandAccent}66`,
                                  fontFamily: "'JetBrains Mono', monospace",
                                }}
                                className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold transition hover:bg-cyan-500/25 focus:outline-none"
                                title="Copy Context Markdown to clipboard (FR-07)"
                              >
                                <span>{isCardCopied ? 'Copied!' : 'Copy Context'}</span>
                                <CopyIcon copied={isCardCopied} className="h-2.5 w-2.5" />
                              </button>

                              <span
                                style={{
                                  backgroundColor: `${accentHex}20`,
                                  color: accentHex,
                                  borderColor: `${accentHex}66`,
                                  fontFamily: "'JetBrains Mono', monospace",
                                }}
                                className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase"
                              >
                                <TypeIcon type={task.type} className="h-2.5 w-2.5" />
                                {task.type}
                              </span>
                            </div>
                          </div>

                          {/* Card Title & Description */}
                          <div className="mb-2.5">
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

                          {/* M9 Context Indicator Pill on Card */}
                          <div className="mb-2.5 flex items-center justify-between gap-1.5 rounded border border-zinc-800/90 bg-zinc-900/70 px-2 py-1">
                            <span
                              style={{
                                color: THEME.brandAccent,
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                              className="truncate text-[10px] font-medium"
                            >
                              AI: {task.contextTool || 'Claude'}
                            </span>
                            <span
                              style={{
                                color: THEME.textMuted,
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                              className="shrink-0 text-[10px]"
                            >
                              {formatRelativeTime(task.contextUpdatedAt)}
                            </span>
                          </div>

                          {/* Card Footer (FR-04, FR-07, DR-03, DR-04, NFR-05) */}
                          <div className="space-y-2 border-t border-zinc-800/80 pt-2.5">
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

                            {/* Creator label + Hand off dropdown (FR-04) */}
                            <div
                              className="flex items-center justify-between gap-1.5 pt-0.5"
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
                                className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] transition hover:border-cyan-400 hover:text-white focus:outline-none"
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

      {/* M5, M6, M7, M8, M9 & M10 CRUD + Context Modal */}
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
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-6 pl-7 shadow-xl"
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
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the task scope or bug reproduction steps..."
                  style={{
                    backgroundColor: THEME.surfacePage,
                    color: THEME.textPrimary,
                  }}
                  className="w-full rounded-md border border-zinc-700 px-3 py-2 text-[13px] placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
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
                    className="w-full rounded-md border px-3 py-2 text-[13px] font-medium focus:outline-none"
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
                    className="w-full rounded-md border border-zinc-700 px-3 py-2 text-[13px] focus:border-indigo-500 focus:outline-none"
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

              {/* M9 & M10 Task Context + Copy Context Section (FR-06, FR-07, DR-04, NFR-05) */}
              <div className="rounded-md border border-zinc-800 bg-zinc-900/60 p-3.5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label
                      htmlFor="task-context-textarea"
                      style={{
                        color: THEME.brandAccent,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                      className="text-[13px] font-semibold uppercase tracking-wide"
                    >
                      Context
                    </label>
                  </div>

                  {/* M9 Preview + M10 Copy Context Button with Popover Toast */}
                  <div className="relative flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowContextPreview((p) => !p)}
                      style={{
                        backgroundColor: showContextPreview
                          ? `${THEME.brandAccent}22`
                          : THEME.surfacePage,
                        color: showContextPreview
                          ? THEME.brandAccent
                          : THEME.textMuted,
                        borderColor: showContextPreview
                          ? `${THEME.brandAccent}66`
                          : '#3F3F46',
                      }}
                      className="rounded border px-2.5 py-1 text-[11px] font-medium transition"
                    >
                      {showContextPreview ? 'Preview: ON' : 'Live Preview'}
                    </button>

                    {/* M10 Copy Context Hero Button inside Modal (FR-07 & NFR-05) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyContext(
                            {
                              id: editingTask?.id || 'new-task',
                              ...formData,
                            },
                            'modal-context'
                          )
                        }
                        style={{
                          backgroundColor: isModalCopied
                            ? THEME.dueSafe
                            : THEME.brandAccent,
                          color: THEME.surfacePage,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                        className="inline-flex items-center gap-1.5 rounded px-3 py-1 text-[11px] font-bold shadow-md transition hover:opacity-90 focus:outline-none"
                      >
                        <span>Copy Context</span>
                        <CopyIcon copied={isModalCopied} className="h-3.5 w-3.5" />
                      </button>

                      {/* Floating "Copied to clipboard!" tooltip right below the button */}
                      {isModalCopied && (
                        <div
                          style={{
                            backgroundColor: THEME.surfacePage,
                            borderColor: THEME.dueSafe,
                            color: THEME.dueSafe,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                          className="absolute right-0 top-full mt-1.5 z-20 whitespace-nowrap rounded border px-2.5 py-1 text-[11px] font-semibold shadow-lg"
                        >
                          Copied to clipboard!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Context Editor + Optional Split Live Markdown Preview */}
                <div
                  className={
                    showContextPreview
                      ? 'grid grid-cols-2 gap-3'
                      : 'grid grid-cols-1'
                  }
                >
                  <textarea
                    id="task-context-textarea"
                    rows={7}
                    value={formData.context}
                    onChange={(e) => handleContextChange(e.target.value)}
                    placeholder={DEFAULT_CONTEXT_TEMPLATE}
                    style={{
                      backgroundColor: THEME.surfacePage,
                      color: THEME.textPrimary,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                    className="w-full rounded-md border border-zinc-700 px-3 py-2 text-[12px] leading-relaxed placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
                  />

                  {showContextPreview && (
                    <div
                      style={{ backgroundColor: THEME.surfacePage }}
                      className="max-h-[190px] overflow-y-auto rounded-md border border-zinc-800 p-3"
                    >
                      <div
                        style={{
                          color: THEME.textMuted,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                        className="mb-1.5 border-b border-zinc-800 pb-1 text-[10px] uppercase"
                      >
                        Markdown Preview
                      </div>
                      {renderMarkdownPreview(formData.context)}
                    </div>
                  )}
                </div>

                {/* Last Updated Timestamp Line */}
                <div
                  style={{
                    color: THEME.textMuted,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  className="mt-1.5 text-[11px]"
                >
                  last updated {formatRelativeTime(formData.contextUpdatedAt)}{' '}
                  (contextUpdatedAt: {formData.contextUpdatedAt || '—'})
                </div>

                {/* AI Tool Dropdown (DR-04 contextTool) */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="context-tool-select"
                      style={{ color: THEME.textMuted }}
                      className="text-[12px] font-medium"
                    >
                      Optional AI Context Tool:
                    </label>
                    <select
                      id="context-tool-select"
                      value={formData.contextTool}
                      onChange={(e) => handleContextToolChange(e.target.value)}
                      style={{
                        backgroundColor: THEME.surfacePage,
                        color: THEME.brandAccent,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                      className="rounded-md border border-zinc-700 px-2.5 py-1 text-[12px] font-medium focus:border-cyan-400 focus:outline-none"
                    >
                      {AI_TOOLS.map((tool) => (
                        <option key={tool} value={tool}>
                          {tool}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleContextChange(DEFAULT_CONTEXT_TEMPLATE)}
                    style={{ color: THEME.textMuted }}
                    className="rounded border border-zinc-700 px-2 py-0.5 text-[11px] hover:border-zinc-500 hover:text-white"
                  >
                    Reset Template
                  </button>
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