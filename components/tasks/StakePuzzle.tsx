import { useForm } from '@mantine/form';
import { Group, NumberInput } from '@mantine/core';

import TaskBox from './TaskBox';
import {ITaskProps} from './index';

export default function StakePuzzle(props: ITaskProps) {
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
        },
    });

    return (
        <TaskBox {...props}>
            <Group>
                <NumberInput
                    defaultValue={1}
                    label="Amount Puzzle"
                    withAsterisk
                    min={1}
                />
            </Group>
        </TaskBox>
    );
}