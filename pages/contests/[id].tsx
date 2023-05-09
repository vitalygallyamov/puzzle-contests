import { IContestData, getById, participate, unparticipate } from '@/bl/contest';
import { Tasks, getTask } from '@/components/tasks';
import { SignerContext } from '@/context/SignerContext';
import { Box, Space, Text, Title, Grid, Button } from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useContext } from 'react';

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
    const { id, name, desc, tasks, owner, participants } = props.data;

    const refreshData = () => {
        router.replace(router.asPath);
    }

    return (
        <Box>
            <Title>{name}</Title>
            <Space h='md' />
            <Text>{desc}</Text>
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
                            return <Grid.Col span={3} key={index}>{getTask(taskInfo[0].id, { ...taskInfo[0], viewProps })}</Grid.Col>
                        } else null;
                    })
                }
            </Grid>
            <Space h='md' />
            {
                authData.userData && authData.userData?.address !== owner ?
                    (
                        participants?.length &&
                            participants.indexOf(authData.userData?.address) >= 0 ?
                            <Button onClick={() => {
                                if (authData.signer) {
                                    unparticipate(authData.signer, id).then(() => {
                                        refreshData();
                                    });
                                }
                            }}>Go out</Button> :
                            <Button onClick={() => {
                                if (authData.signer) {
                                    participate(authData.signer, id).then(() => {
                                        refreshData();
                                    });
                                }
                            }}>Start</Button>
                    )
                    : null
            }
        </Box>
    );
}