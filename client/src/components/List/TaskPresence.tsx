import React from 'react';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { CURRENT_USER, MOCK_USERS_ON_TASK } from '../../constants';

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

/**
 * Placeholder UI: who is "working on this task".
 * Replace MOCK_USERS_ON_TASK / CURRENT_USER with real presence + auth later.
 */
const TaskPresence: React.FC<TaskPresenceProps> = ({ taskId: _taskId }) => {
  const users = [
    { userId: CURRENT_USER.id, name: CURRENT_USER.name },
    ...MOCK_USERS_ON_TASK,
  ];

  return (
    <Box mt={2} mb={1}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Working on this task now
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {users.map((user) => {
          const isMe = user.userId === CURRENT_USER.id;
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
    </Box>
  );
};

export default TaskPresence;
