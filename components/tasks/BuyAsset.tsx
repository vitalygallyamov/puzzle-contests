import { useForm } from '@mantine/form';
import { Group, Select, NumberInput } from '@mantine/core';

import TaskBox from './TaskBox';
import {ITaskProps} from './index';

export default function BuyAsset(props: ITaskProps) {
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
        },
    });

    return (
        <TaskBox {...props}>
            <Group>
                <Select
                    label="Asset"
                    withAsterisk
                    defaultValue='PUZZLE'
                    data={[
                        { value: 'WAVES', label: 'Waves' },
                        { value: 'PUZZLE', label: 'Puzzle' }
                    ]}
                />
                <NumberInput
                    defaultValue={1}
                    label="Amount"
                    withAsterisk
                    min={0}
                />
            </Group>
        </TaskBox>
    );
}