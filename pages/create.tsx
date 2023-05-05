import { useContext, useMemo, useState } from 'react';
import { Title, TextInput, Space, Box, Textarea, Button, NumberInput, Group, Select, Divider, SimpleGrid } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';

import {getTask, Tasks} from '@/components/tasks';
import { create } from '@/bl/contest';
import { SignerContext } from '@/context/SignerContext';
import { transactionById } from '@waves/waves-transactions/dist/nodeInteraction';
import { ApiBase } from '@/data/common';

export default function Create() {
    const {authData} = useContext(SignerContext);

    const [contestTasksIds, setContestTasksIds] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const defDate = useMemo(() => {
        const t = new Date();
        const d = new Date();
        d.setDate(d.getDate() + 7);
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        return d;
    }, []);

    const removeTaskByIndex = (index: number) => {
        setContestTasksIds((prev) => {
            return prev.filter((item, i) => i !== index)
        });
    }

    (async() => {
        const t = await transactionById('Cj5NuHRjGC4wkBozwjua8zzvwbVbA5ZcYxbXgqNn6fjk', ApiBase);
        console.log(t);
    })();

    const submit = () => {
        if (authData.signer) {
            create(authData.signer, 'test', 'desc', defDate, [{
                assetId: null,
                amount: 1000
            }]);
        }
    }
    return (
        <Box>
            <Title>Create</Title>
            <Space h='md' />
            <TextInput
                placeholder="Name"
                withAsterisk
                label="Contest name"
            />
            <Textarea
            withAsterisk
                label="Description"
            />
            <DateTimePicker
                label="End date"
                withAsterisk
                defaultValue={defDate}
            />
            <Group>
                <NumberInput
                    defaultValue={1}
                    label="Prize amount"
                    withAsterisk
                    min={0}
                />
                <Select
                    label="Asset"
                    withAsterisk
                    data={[
                        { value: 'WAVES', label: 'Waves' },
                        { value: 'PUZZLE', label: 'Puzzle' },
                        { value: 'USDTPP', label: 'USDT' } 
                    ]}
                />
            </Group>
            <Group>
                <Select
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
                />
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
                        }
                    }
                }}>+</Button>
            </Group>
            <Space h="sm" />
            <SimpleGrid cols={3}>
                { contestTasksIds.map((task, index) => {
                    return <div key={index}>{getTask(task.id, {
                        name: task.name,
                        onClickX() {
                            removeTaskByIndex(index)
                        }
                    })}</div>;
                }) }
            </SimpleGrid>
            <Button onClick={submit}>Submit</Button>
        </Box>
    )
}