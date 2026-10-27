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
export function getTodayDDMMYYYY() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function toInputDate(ddmmyyyy) {
  if (!ddmmyyyy) return '';
  const parts = ddmmyyyy.split('-');
  if (parts.length !== 3) return '';
  // If already YYYY-MM-DD, return as is
  if (parts[0].length === 4) return ddmmyyyy;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm}-${dd}`;
}

export function toDisplayDate(yyyymmdd) {
  if (!yyyymmdd) return '';
  const parts = yyyymmdd.split('-');
  if (parts.length !== 3) return '';
  // If already DD-MM-YYYY, return as is
  if (parts[2].length === 4) return yyyymmdd;
  const [yyyy, mm, dd] = parts;
  return `${dd}-${mm}-${yyyy}`;
}

// DR-06: mockTasks array pre-populated using DR-01 (UUID) & DR-02 ("DD-MM-YYYY")
export const mockTasks = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    title: 'Define DESIGN.md tokens and Tailwind config',
    description: 'Configure dark mode surface, brand, type, and due-state hex tokens.',
    type: 'feature',
    status: 'done',
    assignee: TEAM[0],
    createdDate: '27-10-2026',
    dueDate: '27-10-2026',
  },
  {
    id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    title: 'Implement 4-column Kanban board layout (FR-01)',
    description: 'Render To Do, In Progress, Review, and Done columns with mockTasks.',
    type: 'feature',
    status: 'in-progress',
    assignee: TEAM[0],
    createdDate: '27-10-2026',
    dueDate: '28-10-2026',
  },
  {
    id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    title: 'Fix column overflow on 1280px viewports (NFR-06)',
    description: 'Ensure all four columns fit cleanly on desktop without horizontal scroll.',
    type: 'bug',
    status: 'review',
    assignee: TEAM[1],
    createdDate: '27-10-2026',
    dueDate: '29-10-2026',
  },
  {
    id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    title: 'Build CRUD task modal for Milestone 5 (FR-02)',
    description: 'Create modal form to add, edit, and delete tasks in localStorage.',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[2],
    createdDate: '27-10-2026',
    dueDate: '30-10-2026',
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
  // M4 data-model
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', mockTasks);

  // M5 crud-modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: '',
    createdDate: '',
  });

  // Open modal for creating a new task
  const handleOpenNewModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      type: 'feature',
      status: 'todo',
      assignee: TEAM[0],
      dueDate: toInputDate(getTodayDDMMYYYY()),
      createdDate: getTodayDDMMYYYY(),
    });
    setIsModalOpen(true);
  };

  // Open modal in edit mode when clicking a card (FR-02)
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      type: task.type,
      status: task.status,
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

  // Save new or updated task (FR-02, DR-01, DR-02, NFR-01)
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const formattedDueDate = formData.dueDate ? toDisplayDate(formData.dueDate) : '';

    if (editingTask) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: formData.title.trim(),
                description: formData.description.trim(),
                type: formData.type,
                status: formData.status,
                assignee: formData.assignee,
                dueDate: formattedDueDate,
              }
            : t
        )
      );
    } else {
      // Create new task with UUID (DR-01) and DD-MM-YYYY dates (DR-02)
      const newTask = {
        id: generateId(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        status: formData.status,
        assignee: formData.assignee,
        createdDate: formData.createdDate || getTodayDDMMYYYY(),
        dueDate: formattedDueDate,
      };
      setTasks((prev) => [...prev, newTask]);
    }

    handleCloseModal();
  };

  // Delete task with DESIGN.md §5 confirmation microcopy
  const handleDeleteTask = () => {
    if (!editingTask) return;
    const confirmed = window.confirm("Delete this task? You can't undo this.");
    if (confirmed) {
      setTasks((prev) => prev.filter((t) => t.id !== editingTask.id));
      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-surface-page px-4 py-5 text-text-primary font-sans">
      <div className="mx-auto max-w-[1280px]">
        {/* Header (DESIGN.md §6 wordmark style + M5 "+ New Task" button) */}
        <header className="mb-6 flex items-end justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="font-heading text-[24px] font-semibold text-brand-primary">
              Vibecoding Project Tracker
            </h1>
            <p className="text-[12px] text-text-muted">
              Team starter
            </p>
          </div>

          {/* M5 crud-modal button (DESIGN.md §4 & §5: solid fill, "+ New Task") */}
          <button
            type="button"
            onClick={handleOpenNewModal}
            className="rounded-md bg-brand-primary px-4 py-2 text-[14px] font-medium text-text-primary transition hover:bg-brand-accent hover:text-surface-page focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            + New Task
          </button>
        </header>

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
                  <h2 className="truncate font-heading text-[16px] font-semibold uppercase tracking-wide text-text-primary">
                    {stage.label}
                  </h2>
                  <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[12px] text-text-muted border border-zinc-800">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Task Cards */}
                <div className="flex flex-1 flex-col gap-2.5">
                  {columnTasks.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-zinc-800 p-4 text-center text-[12px] text-text-muted">
                      No tasks here yet.
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <article
                        key={task.id}
                        onClick={() => handleOpenEditModal(task)}
                        className="cursor-pointer flex flex-col justify-between rounded-md border border-zinc-800 bg-surface-card p-3 transition hover:border-brand-accent"
                      >
                        {/* Card Top: Shortened UUID + plain type label (M6 adds color/icons next) */}
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span
                            title={task.id}
                            className="font-mono text-[11px] text-text-muted"
                          >
                            #{task.id.slice(0, 8)}
                          </span>
                          <span className="rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-[11px] uppercase text-text-muted">
                            {task.type}
                          </span>
                        </div>

                        {/* Card Title & Description */}
                        <div className="mb-3">
                          <h3 className="text-[14px] font-medium leading-snug text-text-primary">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="mt-1 line-clamp-2 text-[12px] text-text-muted">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Card Footer: Assignee + Due Date */}
                        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[12px] text-text-muted">
                          <span className="truncate font-medium text-text-primary">
                            {task.assignee}
                          </span>
                          {task.dueDate && (
                            <span className="font-mono text-[11px] text-text-muted">
                              Due: {task.dueDate}
                            </span>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* M5 crud-modal (FR-02 & DESIGN.md §4: Centered dark box with dark dimmed background) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-zinc-800 bg-surface-card p-6 text-text-primary shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h2 className="font-heading text-[18px] font-semibold text-text-primary">
                  {editingTask ? 'Task Details' : 'New Task'}
                </h2>
                {editingTask && (
                  <p className="font-mono text-[11px] text-text-muted">
                    ID: {editingTask.id}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded px-2 py-1 text-text-muted hover:bg-zinc-800 hover:text-text-primary"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-text-muted">
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
                  className="w-full rounded-md border border-zinc-700 bg-surface-page px-3 py-2 text-[14px] text-text-primary placeholder-zinc-600 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-text-muted">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the task scope or bug reproduction steps..."
                  className="w-full rounded-md border border-zinc-700 bg-surface-page px-3 py-2 text-[14px] text-text-primary placeholder-zinc-600 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              {/* Type & Status Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-text-muted">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full rounded-md border border-zinc-700 bg-surface-page px-3 py-2 text-[14px] text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[12px] font-medium text-text-muted">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-md border border-zinc-700 bg-surface-page px-3 py-2 text-[14px] text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assignee (DR-03) & Due Date (DR-02) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-text-muted">
                    Assignee
                  </label>
                  <select
                    value={formData.assignee}
                    onChange={(e) =>
                      setFormData({ ...formData, assignee: e.target.value })
                    }
                    className="w-full rounded-md border border-zinc-700 bg-surface-page px-3 py-2 text-[14px] text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    {TEAM.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[12px] font-medium text-text-muted">
                    Due Date (DD-MM-YYYY)
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full rounded-md border border-zinc-700 bg-surface-page px-3 py-2 font-mono text-[13px] text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              {/* Created Date Read-only Display (DR-02) */}
              <div className="flex items-center justify-between pt-1 font-mono text-[11px] text-text-muted">
                <span>Created Date: {formData.createdDate}</span>
                {formData.dueDate && (
                  <span>Stored Due Date: {toDisplayDate(formData.dueDate)}</span>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    className="rounded-md bg-due-overdue/20 border border-due-overdue/50 px-3 py-2 text-[13px] font-medium text-due-overdue transition hover:bg-due-overdue hover:text-surface-page"
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
                    className="rounded-md border border-zinc-700 bg-surface-page px-4 py-2 text-[13px] font-medium text-text-muted transition hover:border-zinc-500 hover:text-text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-brand-primary px-4 py-2 text-[13px] font-medium text-text-primary transition hover:bg-brand-accent hover:text-surface-page"
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