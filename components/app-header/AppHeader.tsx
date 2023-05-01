import styled from "@emotion/react";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { Header, Group, ActionIcon, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";
import { Logo } from '../app-nav/logo';

export default function AppHeader() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    return (
        <Header height={60}>
            <Group sx={{ height: '100%' }} px={20} position="apart">
                <Logo colorScheme={colorScheme} />
                <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                    {colorScheme === 'dark' ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
                </ActionIcon>
            </Group>
        </Header>
    );
}