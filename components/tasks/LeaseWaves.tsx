import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { Group, Text, TextInput, Space, Title, Table } from '@mantine/core';

import TaskBox from './TaskBox';
import {ITaskProps} from './index';

export default function StakeWaves(props: ITaskProps) {
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
        },
    });

    const {viewProps, userActions} = props;
    const [address, setAddress] = useState('');

    const addresses = Object.keys(userActions || {});

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
                        w={310}
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
            {
                userActions && addresses.length ?
                <>
                    <Space h='md' />
                    <Title size="h6">User actions:</Title>
                    <Table>
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                addresses.length ? addresses.map(
                                    (address, index) => {
                                        const amount = userActions[address].reduce((prev, current) => {
                                            if (current.type === 8) return prev + current.amount;
                                            else if (current.type === 9) return prev - current.amount;
                                            return prev;
                                        }, 0);
                                        return <tr key={index}>
                                            <td>{address}</td>
                                            <td>{amount || 0} Waves</td>
                                        </tr>
                                    }
                                ) :
                                <tr>
                                    <td colSpan={2}>No data</td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                </>
                : <></>
            }
        </TaskBox>
    );
}