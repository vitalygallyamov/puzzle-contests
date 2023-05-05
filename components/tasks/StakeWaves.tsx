import { useForm } from '@mantine/form';
import { Group, TextInput } from '@mantine/core';

import TaskBox from './TaskBox';
import {ITaskProps} from './index';

export default function StakeWaves(props: ITaskProps) {
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
        },
    });

    return (
        <TaskBox {...props}>
            <Group>
                <TextInput
                    label="Node Address"
                    placeholder="3P..."
                    withAsterisk
                />
            </Group>
        </TaskBox>
    );
}