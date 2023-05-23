import { useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import { Title, TextInput, Space, Box, Textarea, Button, NumberInput, Group, Select, Divider, SimpleGrid, Text } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';

import { useRouter } from 'next/router';

import { getTask, Tasks } from '@/components/tasks';
import { create } from '@/bl/contest';
import { SignerContext } from '@/context/SignerContext';
import { ASSETS, ASSETS_MAP, PUZZLE_ASSET_ID } from '@/data/assets';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function Create() {
    const router = useRouter();
    const { authData } = useContext(SignerContext);

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() + 1);

    const [contestTasksIds, setContestTasksIds] = useState<any[]>([]);
    const [contestTasksData, setContestTasksData] = useState<string[]>([]);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<any[]|null>();

    const [isSending, setIsSending] = useState(false);

    type FormValues = typeof form.values;

    const form = useForm({
        initialValues: {
            name: '',
            desc: '',
            prizeAmount: 1,
            prizeAsset: PUZZLE_ASSET_ID,
            endDate: new Date(),
            tasksList: '',
            isLogin: authData.isLogin
        },

        // functions will be used to validate values at corresponding key
        validate: {
            name: (value) => (value.length < 10 ? 'Name must have at least 10 letters' : null),
            desc: (value) => (value.length > 500 ? 'The name must be no more than 500 letters' : null),
            prizeAmount: (value) => (value <= 0 ? 'Specify the amount of the prize fund' : null),
            prizeAsset: (value) => (!value ? 'Choose a prize token' : null),
            tasksList: (value) => (!value ? 'Task data not filled' : null),
            isLogin: (value) => (!value ? 'You are not authorized' : null)
        },
    });

    useEffect(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        form.setValues({ endDate: d });
    }, []);

    useEffect(() => {
        form.setValues({ isLogin: authData.isLogin });
        form.clearFieldError('isLogin');
    }, [authData.isLogin]);

    useEffect(() => {
        (async() => {
            if (authData.isLogin && authData.signer) {
                const balances = await authData.signer.getBalance();
                setUserBalance(balances);
                if (balances.length) {
                    form.setValues({ prizeAsset: balances[0].assetId });
                }
            } else {
                setUserBalance(null);
                form.setValues({ prizeAsset: '', prizeAmount: 1 });
            }
        })();
    }, [authData.isLogin]);

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

    const removeTaskByIndex = (index: number) => {
        setContestTasksIds((prev) => {
            return prev.filter((item, i) => i !== index)
        });
        setContestTasksData((prev) => {
            const newList = prev.filter((item, i) => i !== index);
            updateTasksListField(newList);
            return newList;
        });
    };

    const updateTasksListField = (list: string[]) => {
        form.setValues({ tasksList: list.join(';') });
        form.clearFieldError('tasksList');
    }

    const submit = async (values: FormValues) => {
        if (authData.signer && userBalance && form.isValid()) {
            try {
                const assetDecimals = userBalance.find(asset => asset.assetId === values.prizeAsset).decimals
                const tx: any = await create(authData.signer, values.name, values.desc, values.endDate, contestTasksData, [{
                    assetId: values.prizeAsset,
                    amount: values.prizeAmount * Math.pow(10, assetDecimals)
                }], () => {
                    setIsSending(true);
                });
                setIsSending(false);
                if (tx?.stateChanges?.data?.length) {
                    const lastIdData = tx?.stateChanges?.data.find((d: any) => d.key === 'last_contest_id');
                    if (lastIdData.value > 0) {
                        notifications.show({
                            title: 'Success',
                            color: 'green',
                            message: `Contest "${values.name}" created`
                        });
                        router.replace(`/contests/${lastIdData.value - 1}`);
                    }
                }
            } catch (e: any) {
                setIsSending(false);
                console.error(e);
                notifications.show({
                    title: 'Error',
                    color: 'red',
                    message: e?.message
                });
            }
        }
    }
    return (
        <Box>
            <form onSubmit={form.onSubmit(submit)}>
            <Breadcrumbs items={breadItems} />
            <Space h='xl' />
            <Title>Create</Title>
            <Space h='md' />
            <TextInput
                placeholder="Name"
                label="Contest name"
                {...form.getInputProps('name')}
            />
            <Textarea
                withAsterisk
                label="Description"
                {...form.getInputProps('desc')}
            />
            <DateTimePicker
                label="End date"
                withAsterisk
                minDate={startDate}
                {...form.getInputProps('endDate')}
            />
            <Group>
                <NumberInput
                    label="Prize amount"
                    precision={4}
                    min={0}
                    {...form.getInputProps('prizeAmount')}
                />
                <Select
                    label="Asset"
                    searchable
                    data={
                        userBalance ?
                            (
                                userBalance.length ?
                                    userBalance.map(asset => {
                                        console.log(asset);
                                        return { value: asset.assetId, label: `${asset.assetName} (${(asset.tokens / Math.pow(10, asset.decimals) / Math.pow(10, asset.decimals)).toFixed(2)})` };
                                    }) : [{value: '', label: 'Wallet is empty'}]
                            ) : [{value: '', label: 'Please login'}]
                    }
                    {...form.getInputProps('prizeAsset')}
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
            {
                form.errors.tasksList ? <Text size='sm' color='red'>{form.errors.tasksList}</Text> : null
            }
            <Space h="md" />
            <Group>
                <Select
                    value={selectedTask}
                    data={Tasks.map(task => {
                        return { value: task.id, label: task.name };
                    })}
                    placeholder='Choose task'
                    onChange={(selectedKey) => {
                        if (selectedKey) {
                            const findTask = Tasks.find(task => task.id === selectedKey);
                            if (findTask) {
                                setContestTasksIds([...contestTasksIds, findTask]);
                                const tList = [...contestTasksData, ''];
                                setContestTasksData(tList);
                                updateTasksListField(tList);
                            }
                        }
                        setSelectedTask(null);
                    }}
                />
            </Group>
            <Space h="sm" />
            <SimpleGrid cols={3}>
                {contestTasksIds.map((task, index) => {
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
                                updateTasksListField(data);
                                return data;
                            });
                        }
                    })}</div>;
                })}
            </SimpleGrid>
            <Space h='md' />
            <Group>
                <Button type='submit' loading={isSending}>Submit</Button>
                {
                    form.errors.isLogin ? <Text size='sm' color='red'>{form.errors.isLogin}</Text> : null
                }
            </Group>
            </form>
        </Box>
    )
}