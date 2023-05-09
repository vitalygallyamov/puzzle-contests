import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { Group, Text, TextInput } from '@mantine/core';

import TaskBox from './TaskBox';
import {ITaskProps} from './index';

export default function StakeWaves(props: ITaskProps) {
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
        },
    });

    const {viewProps} = props;
    const [address, setAddress] = useState('');

    useEffect(() => {
        props.onDataChange?.(`nodeAddress:${address}`);
    }, [address]);

    return (
        <TaskBox {...props}>
            {
                !viewProps ?
                <Group>
                    <TextInput
                        label="Node Address"
                        placeholder="3P..."
                        withAsterisk
                        value={address}
                        onChange={(event) => {
                            setAddress(event.currentTarget.value)
                        }}
                    />
                </Group> :
                <Text>
                    Lease Waves to node <Text span fw='bold'>{viewProps.nodeAddress}</Text>
                </Text>
            }
        </TaskBox>
    );
}