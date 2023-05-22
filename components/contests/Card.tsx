import {IconCalendarDue, IconUsers, IconTrophy} from '@tabler/icons-react';
import {Card, Group, Text, Badge, Button, Space, Flex, ThemeIcon} from "@mantine/core";
import { IContestData } from '@/bl/contest';
import moment from 'moment';
import { ASSETS_MAP } from '@/data/assets';
import Link from 'next/link';
import { formatAddress } from '@/utils/address';


interface ICardProps {
    item: IContestData;
}

export default function ContestCard(props: ICardProps) {
    const {item} = props;
    const {status} = item;
    const curDate = new Date();
    const endDate = new Date(item.endDate);

    const getStatusColor = () => {
        switch (status) {
            case 'active': return 'green';
            case 'finish': return 'yellow';
            default: return 'grey';
        }
    };
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
                <Text component={Link} href={`/contests/${item.id}`} weight={500}>{item.name}</Text>
                <Flex align='center'>
                    <Badge variant="filled" title={item.owner} color="indigo">
                        {formatAddress(item.owner)}
                    </Badge>
                    <Space w="xs" />
                    <Badge color={curDate.getTime() < endDate.getTime() ? 'green' : 'red'} variant="dot">
                        <Flex align='center'>
                            <IconCalendarDue size='15px' />&nbsp;<div>{moment(endDate).format('DD/MM')}</div>
                        </Flex>
                    </Badge>
                    <Space w="xs" />
                    {
                        status ? 
                            <Badge color={getStatusColor()} variant="light">
                                {status}
                            </Badge> : null
                    }
                </Flex>
            </Group>

            <Text size="sm" color="dimmed" lineClamp={3}>
                {item.desc}
            </Text>

            <Group position="apart" mt='sm'>
                <Text size="sm" color="dimmed" title='Participants'>
                    <Flex align='center'>
                        <ThemeIcon size="sm" variant="light" color="gray">
                            <IconUsers />
                        </ThemeIcon>
                        &nbsp;<div>{item.participantsCount || 0}</div>
                    </Flex>
                </Text>
                <Text size="sm" color="dimmed">
                    <Flex align='center'>
                        <ThemeIcon size="sm" variant="light" color="yellow">
                            <IconTrophy />
                        </ThemeIcon>
                        &nbsp;
                        {
                            item.prizeFund.map((item, index) => {
                                const [assetId, intAmount] = item.split(':');
                                if (!ASSETS_MAP[assetId]) return null;
                                const amount = parseInt(intAmount, 10) / Math.pow(10, ASSETS_MAP[assetId].decimals);
                                return <div key={index}>{`${amount} ${ASSETS_MAP[assetId].name}`}</div>;
                            })
                        }
                    </Flex>
                </Text>
            </Group>
            {
                status === 'active' ?
                    <Button variant="light" color="indigo" fullWidth mt="md" radius="md" component={Link} href={`/contests/${item.id}`}>
                        Participate
                    </Button> : null
            }
            
        </Card>
    );
}