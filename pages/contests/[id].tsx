import { IContestData, getById, participate, unparticipate } from '@/bl/contest';
import { Tasks, getTask } from '@/components/tasks';
import { SignerContext } from '@/context/SignerContext';
import { ASSETS_MAP } from '@/data/assets';
import { Box, Space, Text, Title, Grid, Button, Group, Table, ThemeIcon } from '@mantine/core';
import { IconRefresh, IconTrophy } from '@tabler/icons-react';
import axios from 'axios';
import moment from 'moment';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';

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

    const [tasksData, setTasksData] = useState();
    const [tasksLoading, setTaskLoading] = useState(false);

    const [startParticipate, setStartParticipate] = useState(false);

    const updateTasksData = useCallback(() => {
        setTaskLoading(true);
        axios.get('/api/check', {
            params: {
                id
            }
        }).then(data => {
            setTasksData(data.data);
        }).finally(() => setTaskLoading(false))
    }, [id]);

    useEffect(() => {
        updateTasksData();
    }, []);

    const refreshData = () => {
        router.replace(router.asPath);
    }

    return (
        <Box>
            <Title>{name}</Title>
            <Space h='md' />
            <Text>{desc}</Text>
            <Space h='md' />
            <Table w='250px'>
                <tbody>
                    <tr>
                        <td>End date</td>
                        <td>{moment(endDate).format('DD.MM.YY')}</td>
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
                                    const amount = parseInt(intAmount, 10) / Math.pow(10, ASSETS_MAP[assetId].decimals);
                                    return <div key={index}>{`${amount} ${ASSETS_MAP[assetId].name}`}</div>;
                                })
                            }
                            </Group>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Space h='md' />
            {
                authData.userData && authData.userData?.address !== owner ?
                    (
                        participants?.length &&
                            participants.indexOf(authData.userData?.address) >= 0 ?
                            <Button color="yellow" loading={startParticipate} onClick={() => {
                                if (authData.signer) {
                                    setStartParticipate(true);
                                    unparticipate(authData.signer, id).then(() => {
                                        refreshData();
                                    }).finally(() => setStartParticipate(false));
                                }
                            }}>Go out</Button> :
                            <Button color="green" loading={startParticipate} onClick={() => {
                                if (authData.signer) {
                                    setStartParticipate(true);
                                    participate(authData.signer, id).then(() => {
                                        refreshData();
                                    }).finally(() => setStartParticipate(false));
                                }
                            }}>Start participating</Button>
                    )
                    : null
            }
            <Space h='xl' />
            <Title size='h3'>Tasks</Title>
            <Space h='xs' />
            <Group>
                <Button
                    loading={tasksLoading}
                    leftIcon={<IconRefresh size="1rem" />}
                    onClick={updateTasksData}>
                    Refresh tasks
                </Button>
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