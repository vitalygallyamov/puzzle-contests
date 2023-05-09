import { PropsWithChildren } from 'react';
import { Group, Box, Title, ActionIcon, Text, ThemeIcon, HoverCard } from '@mantine/core';
import {IconInfoCircle, IconX} from '@tabler/icons-react';

import {ITaskProps} from './index';

export default function TaskBox(props: ITaskProps & PropsWithChildren) {
    return (
        <Box sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            padding: theme.spacing.sm,
            borderRadius: theme.radius.md,
        })}>
            <Group position='apart'>
                <Group>
                    <Title size="h5">{props.name}</Title>

                    <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                            <IconInfoCircle size={16} />
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <Text size="sm">{props.hint}</Text>
                        </HoverCard.Dropdown>
                    </HoverCard>
                </Group>
                {
                    props.onClickX ?
                        <ActionIcon color="red" onClick={() => {
                            props.onClickX?.();
                        }}>
                            <IconX size="1rem" />
                        </ActionIcon> : null
                }
            </Group>
            {props.children}
        </Box>
    );
}