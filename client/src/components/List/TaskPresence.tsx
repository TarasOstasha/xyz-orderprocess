import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import * as API from '../../api';
import { RootState } from '../../store';

interface PresenceUser {
  userId: string;
  name: string;
  email?: string;
}

interface TaskPresenceProps {
  taskId: number;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

const HEARTBEAT_MS = 10_000;

const TaskPresence: React.FC<TaskPresenceProps> = ({ taskId }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [users, setUsers] = useState<PresenceUser[]>([]);

  const syncPresence = useCallback(async () => {
    if (!taskId || !currentUser) return;
    try {
      const { data } = await API.upsertTaskPresence(taskId);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Presence heartbeat failed', err);
    }
  }, [taskId, currentUser]);

  useEffect(() => {
    if (!taskId || !currentUser) return;

    let cancelled = false;

    const run = async () => {
      if (!cancelled) await syncPresence();
    };
    run();

    const intervalId = window.setInterval(run, HEARTBEAT_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      API.leaveTaskPresence(taskId).catch(() => undefined);
    };
  }, [taskId, currentUser, syncPresence]);

  if (!currentUser) return null;

  return (
    <Box mt={2} mb={1}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Working on this task now
      </Typography>
      {users.length === 0 ? (
        <Typography variant="caption" color="text.secondary">
          No one else here yet
        </Typography>
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {users.map((user) => {
            const isMe = user.userId === String(currentUser.id);
            return (
              <Chip
                key={user.userId}
                avatar={
                  <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                    {initials(user.name)}
                  </Avatar>
                }
                label={isMe ? `${user.name} (you)` : user.name}
                color={isMe ? 'primary' : 'default'}
                variant={isMe ? 'filled' : 'outlined'}
                size="small"
              />
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default TaskPresence;
