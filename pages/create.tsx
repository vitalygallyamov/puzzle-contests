import { useMemo, useState } from 'react';
import { Title, TextInput, Space, Box, Textarea, Button, NumberInput, Group, Select, Divider, SimpleGrid } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';

import {Tasks} from '@/components/tasks';

export default function Create() {
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

    const removeTask = (task: any) => {
        const newTasks = contestTasksIds.filter((t, i) => {
            console.log(t.key, task.key);
            return t.key !== task.key;
        });
        setContestTasksIds(newTasks);
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
                            setContestTasksIds([...contestTasksIds, {...findTask, key: findTask.id + '-' + contestTasksIds.length}]);
                        }
                    }
                }}>+</Button>
            </Group>
            <Space h="sm" />
            <SimpleGrid cols={3}>
                { contestTasksIds.map((task) => {
                    return <task.component key={task.key} onClickX={() => {
                        removeTask(task)
                    }}/>;
                }) }
            </SimpleGrid>
            <Button>Submit</Button>
        </Box>
    )
}