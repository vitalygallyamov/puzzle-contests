import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { Group, NumberInput, Text } from '@mantine/core';

import TaskBox from './TaskBox';
import {ITaskProps} from './index';
import { ASSETS_MAP, PUZZLE_ASSET, PUZZLE_ASSET_ID } from '@/data/assets';

export default function StakePuzzle(props: ITaskProps) {
    const {viewProps} = props;
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
        },
    });

    const [amount, setAmount] = useState(1);

    useEffect(() => {
        props.onDataChange?.(`amount:${amount * Math.pow(10, ASSETS_MAP[PUZZLE_ASSET_ID].decimals)}`);
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
                    Buy and stake <Text fw='bold' span>{(parseInt(viewProps.amount, 10) / Math.pow(10, PUZZLE_ASSET.decimals))} {PUZZLE_ASSET.name}</Text> on Puzle Swap
                </Text>
            }
        </TaskBox>
    );
}