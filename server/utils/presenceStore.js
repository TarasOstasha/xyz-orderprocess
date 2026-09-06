/**
 * In-memory presence: who is currently viewing/working on each task.
 * Replace with Redis / DB + real auth sessions later if needed.
 */

const STALE_MS = 20_000; // drop users who haven't heartbeated in 20s

/** @type {Map<number, Map<string, { userId: string, name: string, email?: string, lastSeen: number }>>} */
const byTask = new Map();

function getTaskMap(taskId) {
  const id = Number(taskId);
  if (!byTask.has(id)) {
    byTask.set(id, new Map());
  }
  return byTask.get(id);
}

function prune(taskId) {
  const map = getTaskMap(taskId);
  const now = Date.now();
  for (const [userId, entry] of map.entries()) {
    if (now - entry.lastSeen > STALE_MS) {
      map.delete(userId);
    }
  }
  if (map.size === 0) {
    byTask.delete(Number(taskId));
  }
}

function upsert(taskId, user) {
  if (!user?.userId || !user?.name) {
    throw new Error('userId and name are required');
  }
  const map = getTaskMap(taskId);
  map.set(String(user.userId), {
    userId: String(user.userId),
    name: String(user.name),
    email: user.email ? String(user.email) : undefined,
    lastSeen: Date.now(),
  });
  prune(taskId);
  return list(taskId);
}

function leave(taskId, userId) {
  const map = getTaskMap(taskId);
  map.delete(String(userId));
  prune(taskId);
  return list(taskId);
}

function list(taskId) {
  prune(taskId);
  const map = byTask.get(Number(taskId));
  if (!map) return [];
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
  upsert,
  leave,
  list,
  STALE_MS,
};
