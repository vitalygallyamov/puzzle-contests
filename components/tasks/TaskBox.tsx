import { PropsWithChildren } from 'react';
import { Group, Box, Title, ActionIcon } from '@mantine/core';
import {IconX} from '@tabler/icons-react';

import {ITaskProps} from './index';

export default function TaskBox(props: ITaskProps & PropsWithChildren) {
    return (
        <Box sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            padding: theme.spacing.sm,
            borderRadius: theme.radius.md,
        })}>
            <Group position='apart'>
                <Title size="h5">{props.name}</Title>
                <ActionIcon color="red" onClick={() => {
                        props.onClickX();
                    }}>
                    <IconX size="1rem" />
                </ActionIcon>
            </Group>
            {props.children}
        </Box>
    );
}