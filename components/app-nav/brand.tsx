import React from 'react';
import { Group, ActionIcon, useMantineColorScheme, Box, rem, Button } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { Logo } from './logo';

export function Brand() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingBottom: theme.spacing.lg,
        borderBottom: `${rem(1)} solid ${
          theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
      })}
    >
      <Group position="apart">
        <Logo colorScheme={colorScheme} />
        <Group position='left'>
            <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
            {colorScheme === 'dark' ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
            </ActionIcon>
            <Button>Create</Button>
        </Group>
      </Group>
    </Box>
  );
}