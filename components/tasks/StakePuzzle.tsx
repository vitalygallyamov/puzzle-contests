import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { Group, NumberInput, Space, Table, Text, Title } from '@mantine/core';

import TaskBox from './TaskBox';
import {ITaskProps} from './index';
import { ASSETS_MAP, PUZZLE_ASSET, PUZZLE_ASSET_ID } from '@/data/assets';

export default function StakePuzzle(props: ITaskProps) {
    const {viewProps, userActions} = props;
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
        },
    });

    const [amount, setAmount] = useState(1);
    const addresses = Object.keys(userActions || {});

    useEffect(() => {
        props.onDataChange?.(`amount:${amount * Math.pow(10, ASSETS_MAP[PUZZLE_ASSET_ID].precision)}`);
    }, [amount]);

    return (
        <TaskBox {...props}>
            {
                !viewProps ?
                <Group>
                    <NumberInput
                        label="Amount Puzzle"
                        withAsterisk
                        value={amount}
                        onChange={(value) => {setAmount(value || 1)}}
                        min={1}
                    />
                </Group> :
                <Text>
                    Stake <Text fw='bold' span>{(parseInt(viewProps.amount, 10) / Math.pow(10, PUZZLE_ASSET.precision))} {PUZZLE_ASSET.name}</Text> on Puzle Swap
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
                                            let a = 0;
                                            if (current.call?.function === 'stake') {
                                                return prev + ((current.payment?.[0].amount || 0) * Math.pow(10, PUZZLE_ASSET.precision))
                                            } else if (current.call?.function === 'unStake' && current.call.args?.[0].value as number > 0) {
                                                return prev - (current.call.args[0].value as number || 0);
                                            }
                                            return prev;
                                        }, 0);
                                        return amount ? <tr key={index}>
                                            <td>{address}</td>
                                            <td>{(amount / Math.pow(10, PUZZLE_ASSET.precision)).toFixed(2) || 0} Puzzle</td>
                                        </tr> : null
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