import React from 'react';
import {
  IconNews,
  IconGraph
} from '@tabler/icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import Link from 'next/link';

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  href: string;
}

function MainLink({ icon, color, label, href }: MainLinkProps) {
  return (
    <UnstyledButton
        href={href}
        component={Link}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [
  { icon: <IconNews size="1rem" />, color: 'pink', label: 'Contests', href: '/contests' },
  { icon: <IconGraph size="1rem" />, color: 'blue', label: 'Stats', href: '/stats' },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}