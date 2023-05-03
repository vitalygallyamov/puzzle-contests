import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Box, Select, NumberInput, Title, ActionIcon } from '@mantine/core';
import {IconX} from '@tabler/icons-react';

interface IBuyAssetProps {
    onClickX(): void;
}

export default function BuyAsset(props: IBuyAssetProps) {
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
        },
    });

    return (
        <Box sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            padding: theme.spacing.sm,
            borderRadius: theme.radius.md,
        })}>
            <Group position='apart'>
                <Title size="h5">Buy Asset</Title>
                <ActionIcon color="red">
                    <IconX size="1rem" onClick={() => {
                        props.onClickX();
                    }}/>
                </ActionIcon>
            </Group>
            <Group>
                <Select
                    label="Asset"
                    withAsterisk
                    data={[
                        { value: 'WAVES', label: 'Waves' },
                        { value: 'PUZZLE', label: 'Puzzle' }
                    ]}
                />
                <NumberInput
                    defaultValue={1}
                    label="Amount"
                    withAsterisk
                    min={0}
                />
            </Group>
        </Box>
    );
}