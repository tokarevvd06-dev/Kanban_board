export const dndColumnId = (id) => `col-${id}`;
export const dndTaskId = (id) => `task-${id}`;
export const dndDropId = (id) => `drop-${id}`;
export const dndTaskGroup = (columnId) => `tasks-${columnId}`;

export const idsEqual = (a, b) => String(a) === String(b);

export function parseColumnId(value) {
  if (value == null) return null;
  const s = String(value);
  if (s === 'columns') return null;
  if (s.startsWith('col-')) return s.slice(4);
  if (s.startsWith('drop-')) return s.slice(5);
  if (s.startsWith('column-')) return s.slice(7);
  if (s.startsWith('tasks-')) return s.slice(6);
  return s;
}

export function parseTaskId(value) {
  if (value == null) return null;
  const s = String(value);
  if (s.startsWith('task-')) return s.slice(5);
  return s;
}
