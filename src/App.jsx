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
  // M4 data-model: initialize from localStorage or fall back to DR-06 mockTasks
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', mockTasks);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-surface-page px-4 py-5 text-text-primary font-sans">
      <div className="mx-auto max-w-[1280px]">
        {/* Header (DESIGN.md §6 wordmark style) */}
        <header className="mb-6 flex items-end justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="font-heading text-[24px] font-semibold text-brand-primary">
              Vibecoding Project Tracker
            </h1>
            <p className="text-[12px] text-text-muted">
              Team starter
            </p>
          </div>
          {/* TODO M5 crud-modal: "+ New Task" button goes here */}
        </header>

        {/* TODO M11 anchors: Anchor Banner (FR-08) goes here */}

        {/* M4 data-model (FR-01 & NFR-06): 4-column board fitting <= 1280px without horizontal scroll */}
        <main className="grid grid-cols-4 gap-3">
          {STAGES.map((stage) => {
            const columnTasks = tasks.filter((task) => task.status === stage.id);

            return (
              <section
                key={stage.id}
                className="flex min-h-[520px] min-w-0 flex-col rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
              >
                {/* Column Header (DESIGN.md §3: 16px semibold uppercase) */}
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
                    /* DESIGN.md §4 & §5: Empty state with dashed border and exact microcopy */
                    <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-zinc-800 p-4 text-center text-[12px] text-text-muted">
                      No tasks here yet.
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <article
                        key={task.id}
                        className="flex flex-col justify-between rounded-md border border-zinc-800 bg-surface-card p-3 transition hover:border-zinc-700"
                      >
                        {/* Card Top: Shortened UUID display + plain type label (M6 adds color/icons next) */}
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

                        {/* Card Title & Description (DESIGN.md §3: 14px medium title) */}
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

                        {/* Card Footer: Assignee (DR-03) + Due Date in DD-MM-YYYY (DR-02) */}
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
    </div>
  );
}