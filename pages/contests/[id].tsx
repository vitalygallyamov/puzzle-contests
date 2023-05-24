import axios from 'axios';
import moment from 'moment';

import { IContestData, chooseWinner, getById, participate, unparticipate } from '@/bl/contest';
import { Tasks, getTask } from '@/components/tasks';
import { SignerContext } from '@/context/SignerContext';
import { ASSETS_MAP } from '@/data/assets';
import { Box, Space, Text, Title, Grid, Button, Group, Table, ThemeIcon, Divider, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAward, IconRefresh, IconTrophy } from '@tabler/icons-react';

import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

// import Timer from '@/components/common/Timer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ParticipantsList from '@/components/common/ParticipantsList';
import { formatAddress } from '@/utils/address';

interface IContestPageProps {
    data: IContestData;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const data = await getById(context.query.id as string);
    return {
        props: { data },
    };
}

export default function Page(props: IContestPageProps) {
    const router = useRouter();
    const { authData } = useContext(SignerContext);
    const { id, name, desc, tasks, owner, participants, endDate, prizeFund } = props.data;

    const breadItems = useMemo(() => {
        return [{
            title: 'Puzzlify',
            href: '#'
        }, {
            title: 'Contests',
            href: '/contests'
        }, {
            title: name,
            href: '/contests/' + id
        }];
    }, [id, name]);

    const [tasksData, setTasksData] = useState();
    const [tasksLoading, setTaskLoading] = useState(false);
    const [choosingLoading, setChoosingLoading] = useState(false);

    const [startParticipate, setStartParticipate] = useState(false);

    const callChooseWinner = useCallback(() => {
        const addresses: string[] = [];
        if (tasksData && authData.signer) {
            Object.keys(tasksData).forEach((taskId) => {
                addresses.push(...Object.keys(tasksData[taskId]))
            })
            const addressSet = new Set(...addresses);
            // if (addressSet.size > 0) {
                setChoosingLoading(true);
                chooseWinner(authData.signer, id, Array.from(addressSet), () => {
                    setChoosingLoading(true);
                })
                .finally(() => setChoosingLoading(false));
            // }
        }
    }, [id, authData.signer, tasksData]);

    const updateTasksData = useCallback(() => {
        setTaskLoading(true);
        axios.get('/api/check', {
            params: {
                id
            }
        })
        .then(data => {
            setTasksData(data.data);
        })
        .catch((e) => {
            notifications.show({
                title: 'Error',
                color: 'red',
                message: e?.message
            });
        })
        .finally(() => setTaskLoading(false))
    }, [id]);

    useEffect(() => {
        updateTasksData();
    }, []);

    const refreshData = () => {
        router.replace(router.asPath);
    }

    return (
        <Box>
            <Breadcrumbs items={breadItems} />
            <Space h='xl' />
            <Title>{name}</Title>
            <Space h='md' />
            <Text>{desc}</Text>
            <Space h='md' />
            <Table w='250px'>
                <tbody>
                    <tr>
                        <td>End date</td>
                        <td>
                            {moment(endDate).format('DD.MM.YY')}
                        </td>
                    </tr>
                    <tr>
                        <td>Prize</td>
                        <td>
                            <Group>
                            <ThemeIcon size="sm" variant="light" color="yellow">
                                <IconTrophy />
                            </ThemeIcon>
                            {
                                prizeFund.map((item, index) => {
                                    const [assetId, intAmount] = item.split(':');
                                    if (!ASSETS_MAP[assetId]) return null;
                                    const amount = parseInt(intAmount, 10) / Math.pow(10, ASSETS_MAP[assetId].precision);
                                    return <div key={index}>{`${amount} ${ASSETS_MAP[assetId].name}`}</div>;
                                })
                            }
                            </Group>
                        </td>
                    </tr>
                    <tr>
                        <td>Owner</td>
                        <td>
                            <Badge color='grape' title={owner}>{formatAddress(owner)}</Badge>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Space h='xl' />
            
            <Title size='h3'>Participants</Title>
            <Space h='xs' />
            <Group>
                <ParticipantsList items={participants || []} active={authData.userData?.address} />
            </Group>
            <Space h='md' />
            {
                authData.userData && authData.userData?.address !== owner ?
                    (
                        participants?.length &&
                            participants.indexOf(authData.userData?.address) >= 0 ?
                            <Button color="yellow" loading={startParticipate} onClick={() => {
                                if (authData.signer) {
                                    unparticipate(authData.signer, id, () => {
                                        setStartParticipate(true);
                                    }).then(() => {
                                        refreshData();
                                    }).finally(() => setStartParticipate(false));
                                }
                            }}>Go out</Button> :
                            <Button color="green" loading={startParticipate} onClick={() => {
                                if (authData.signer) {
                                    participate(authData.signer, id, () => {
                                        setStartParticipate(true);
                                    }).then(() => {
                                        refreshData();
                                    }).finally(() => setStartParticipate(false));
                                }
                            }}>Start participating</Button>
                    )
                    : null
            }

            <Divider my="sm" />
            <Group>
                <Title size='h3'>Tasks</Title>
                <Button
                    size='xs'
                    mr={1}
                    loading={tasksLoading}
                    leftIcon={<IconRefresh size="1rem" />}
                    onClick={updateTasksData}>
                    Refresh tasks
                </Button>
                {
                    new Date().getTime() > endDate && authData.signer && authData.userData?.address === owner ?
                        <Button
                            size='xs'
                            color='green'
                            loading={choosingLoading}
                            leftIcon={<IconAward size="1rem" />}
                            onClick={callChooseWinner}>
                            Choose winner
                        </Button> : null
                }
            </Group>
            <Space h='md' />
            <Grid>
                {
                    tasks.map((task, index) => {
                        const viewProps: { [x: string]: string } = {};
                        task.split('|').map((t) => {
                            const [name, value] = t.split(':');
                            viewProps[name] = value;
                        });
                        const taskInfo = Tasks.filter(t => t.id === viewProps.id);
                        if (taskInfo.length) {
                            return <Grid.Col span={6} key={index}>
                                <div>
                                    {getTask(taskInfo[0].id, {
                                        ...taskInfo[0],
                                        viewProps,
                                        userActions: tasksData?.[task]
                                    })}
                                </div>
                            </Grid.Col>
                        } else null;
                    })
                }
            </Grid>
            <Space h='md' />
        </Box>
    );
}