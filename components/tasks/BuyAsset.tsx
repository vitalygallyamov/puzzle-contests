import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { Group, Select, NumberInput, Text } from '@mantine/core';

import TaskBox from './TaskBox';
import {ITaskProps} from './index';
import { ASSETS, ASSETS_MAP, PUZZLE_ASSET_ID } from '@/data/assets';

export default function BuyAsset(props: ITaskProps) {
    const {viewProps} = props;
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
        },
    });

    const [amount, setAmount] = useState(1);
    const [assetId, setAssetId] = useState(PUZZLE_ASSET_ID);

    useEffect(() => {
        props.onDataChange?.(`amount:${amount * Math.pow(10, ASSETS_MAP[assetId].decimals)}|assetId:${assetId}`);
    }, [amount, assetId]);

    return (
        <TaskBox {...props}>
            {
                !viewProps ?
                <Group>
                    <Select
                        label="Asset"
                        withAsterisk
                        value={assetId}
                        onChange={(value) => {setAssetId(value || PUZZLE_ASSET_ID)}}
                        data={ASSETS.map(asset => {
                            return {value: asset.id, label: asset.name};
                        })}
                    />
                    <NumberInput
                        label="Amount"
                        withAsterisk
                        value={amount}
                        onChange={(value) => {setAmount(value || 1)}}
                        min={0}
                    />
                </Group>:
                <Text>
                    Buy <Text fw='bold' span>{(parseInt(viewProps.amount, 10) / Math.pow(10, ASSETS_MAP[viewProps.assetId].decimals))} {ASSETS_MAP[viewProps.assetId].name}</Text> on Puzle Swap
                </Text>
            }
            
        </TaskBox>
    );
}