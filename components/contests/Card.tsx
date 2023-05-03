import {IconCalendarDue, IconUsers, IconTrophy} from '@tabler/icons-react';
import {Card, Group, Text, Badge, Button, Space, Flex, ThemeIcon} from "@mantine/core";

interface ICardProps {
    name: string;
}

export default function ContestCard(props: ICardProps) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
                <Text weight={500}>{props.name}</Text>
                <Flex align='center'>
                    <Badge color="red" variant="dot">
                        <Flex align='center'>
                            <IconCalendarDue size='15px' />&nbsp;<div>11.05</div>
                        </Flex>
                    </Badge>
                    <Space w="md" />
                    <Badge color="green" variant="light">
                        Active
                    </Badge>
                </Flex>
            </Group>

            <Text size="sm" color="dimmed">
                From the start of this contest, buy 10 puzzles via puzzle swap and hold them until the end of the contest
            </Text>

            <Group position="apart" mt='sm'>
                <Text size="sm" color="dimmed">
                    <Flex align='center'>
                        <ThemeIcon size="sm" variant="light" color="gray">
                            <IconUsers />
                        </ThemeIcon>
                        &nbsp;<div>10</div>
                    </Flex>
                </Text>
                <Text size="sm" color="dimmed">
                    <Flex align='center'>
                        <ThemeIcon size="sm" variant="light" color="yellow">
                            <IconTrophy />
                        </ThemeIcon>
                        &nbsp;<div>10 PUZZLE</div>
                    </Flex>
                </Text>
            </Group>

            <Button variant="light" color="indigo" fullWidth mt="md" radius="md">
                Participate
            </Button>
        </Card>
    );
}