import React, { useContext } from 'react';
import {
  IconNews,
  IconGraph,
  IconUser
} from '@tabler/icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { SignerContext } from '@/context/SignerContext';

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
  { icon: <IconUser size="1rem" />, color: 'yellow', label: 'My', href: '/contests/my', isUser: true },
  { icon: <IconGraph size="1rem" />, color: 'blue', label: 'Stats', href: '/stats' },
];

export function MainLinks() {
  const {authData} = useContext(SignerContext);
  const links = data.map((link) => {
    if (link.isUser) {
      return authData.isLogin ? <MainLink {...link} key={link.label}/> : null;
    }
    return <MainLink {...link} key={link.label} />;
  });
  return <div>{links}</div>;
}