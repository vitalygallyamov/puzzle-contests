import { useContext, useMemo, useState } from 'react';
import { Title, TextInput, Space, Box, Textarea, Button, NumberInput, Group, Select, Divider, SimpleGrid } from "@mantine/core";
import { DateTimePicker, DateValue } from '@mantine/dates';

import { useRouter } from 'next/router';

import {getTask, Tasks} from '@/components/tasks';
import { create } from '@/bl/contest';
import { SignerContext } from '@/context/SignerContext';
import { transactionById } from '@waves/waves-transactions/dist/nodeInteraction';
import { ApiBase } from '@/data/common';
import { ASSETS, ASSETS_MAP, PUZZLE_ASSET_ID } from '@/data/assets';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function Create() {
    const router = useRouter();
    const {authData} = useContext(SignerContext);

    const breadItems = useMemo(() => {
        return [{
            title: 'Puzzlify',
            href: '#'
        }, {
            title: 'Contests',
            href: '/contests'
        }, {
            title: 'Create',
            href: '/create'
        }];
    }, []);

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [endDate, setEndDate] = useState<DateValue>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        return d;
    });
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() + 1);
    const [prizeAmount, setPrizeAmount] = useState(0);
    const [prizeAsset, setPrizeAsset] = useState<string | null>(PUZZLE_ASSET_ID);

    const [contestTasksIds, setContestTasksIds] = useState<any[]>([]);
    const [contestTasksData, setContestTasksData] = useState<string[]>([]);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);

    const [isSending, setIsSending] = useState(false);

    const removeTaskByIndex = (index: number) => {
        setContestTasksIds((prev) => {
            return prev.filter((item, i) => i !== index)
        });
        setContestTasksData((prev) => {
            return prev.filter((item, i) => i !== index)
        });
    }

    const submit = async () => {
        if (authData.signer && name && desc && endDate && contestTasksData.length && prizeAmount > 0 && prizeAsset) {
            setIsSending(true);
            try {
                const tx: any = await create(authData.signer, name, desc, endDate, contestTasksData, [{
                    assetId: prizeAsset,
                    amount: prizeAmount * Math.pow(10, ASSETS_MAP[prizeAsset].decimals)
                }]);
                setIsSending(false);
                if (tx?.stateChanges?.data?.length) {
                    const lastIdData = tx?.stateChanges?.data.find((d: any) => d.key === 'last_contest_id');
                    if (lastIdData.value > 0) {
                        router.replace(`/contests/${lastIdData.value - 1}`);
                    }
                }
            } catch (e) {
                setIsSending(false);
                console.error(e);
            }
        }
    }
    return (
        <Box>
            <Breadcrumbs items={breadItems} />
            <Space h='xl' />
            <Title>Create</Title>
            <Space h='md' />
            <TextInput
                placeholder="Name"
                withAsterisk
                label="Contest name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
            />
            <Textarea
                withAsterisk
                label="Description"
                value={desc}
                onChange={(event) => setDesc(event.currentTarget.value)}
            />
            <DateTimePicker
                label="End date"
                withAsterisk
                minDate={startDate}
                value={endDate}
                onChange={(dateValue) => setEndDate(dateValue)}
            />
            <Group>
                <NumberInput
                    label="Prize amount"
                    withAsterisk
                    value={prizeAmount}
                    precision={4}
                    min={0}
                    onChange={(value) => setPrizeAmount(value || 0)}
                />
                <Select
                    label="Asset"
                    withAsterisk
                    value={prizeAsset}
                    data={ASSETS.map(asset => {
                        return { value: asset.id, label: asset.name };
                    })}
                    onChange={(value) => setPrizeAsset(value)}
                />
            </Group>
            <Group>
                {/* <Select
                    label="Distribution method"
                    withAsterisk
                    data={[
                        { value: 'All', label: 'All' },
                        { value: 'Random', label: 'Randomly from all'}
                    ]}
                />
                <NumberInput
                    defaultValue={1}
                    label="Number of winners"
                    withAsterisk
                    min={1}
                /> */}
            </Group>
            <Space h="md" />
            <Divider my="sm" />
            <Title size="h3">Tasks</Title>
            <Space h="md" />
            <Group>
                <Select
                    value={selectedTask}
                    data={Tasks.map(task => {
                        return {value: task.id, label: task.name};
                    })}
                    onChange={setSelectedTask}
                />
                <Button onClick={() => {
                    if (selectedTask) {
                        const findTask = Tasks.find(task => task.id === selectedTask);
                        if (findTask) {
                            setContestTasksIds([...contestTasksIds, findTask]);
                            setContestTasksData([...contestTasksData, '']);
                        }
                    }
                }}>+</Button>
            </Group>
            <Space h="sm" />
            <SimpleGrid cols={3}>
                { contestTasksIds.map((task, index) => {
                    return <div key={index}>{getTask(task.id, {
                        name: task.name,
                        hint: task.hint,
                        onClickX() {
                            removeTaskByIndex(index);
                        },
                        onDataChange(value) {
                            setContestTasksData((prev) => {
                                const data = [...prev];
                                data[index] = `id:${task.id}|${value}`;
                                return data;
                            });
                        }
                    })}</div>;
                }) }
            </SimpleGrid>
            <Space h='md' />
            <Button onClick={submit} loading={isSending}>Submit</Button>
        </Box>
    )
}