import {useMemo} from 'react';
import { Title, TextInput, Space, Box, Textarea, Button } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';

export default function Create() {
    const defDate = useMemo(() => {
        const t = new Date();
        const d = new Date();
        d.setDate(d.getDate() + 7);
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        return d;
    }, []);
    return (
        <Box>
            <Title>Create</Title>
            <Space h='md' />
            <TextInput
                placeholder="Name"
                label="Contest name"
            />
            <Textarea
                label="Description"
            />
            <DateTimePicker
                label="End date"
                defaultValue={defDate}
            />
            <Space h="md"/>
            <Button>Submit</Button>
        </Box>
    )
}