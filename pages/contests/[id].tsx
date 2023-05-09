import { IContestData, getById } from '@/bl/contest';
import { Tasks, getTask } from '@/components/tasks';
import { Box, Space, Text, Title, Grid } from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

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
    const { name, desc, tasks } = props.data;
    console.log(tasks);
    return (
        <Box>
            <Title>{name}</Title>
            <Space h='md' />
            <Text>{desc}</Text>
            <Space h='md' />
            <Grid>
            {
                tasks.map((task, index) => {
                    const viewProps: {[x: string]: string} = {};
                    task.split('|').map((t) => {
                        const [name, value] = t.split(':');
                        viewProps[name] = value;
                    });
                    const taskInfo = Tasks.filter(t => t.id === viewProps.id);
                    if (taskInfo.length) {
                        return <Grid.Col span={3}>{getTask(taskInfo[0].id, {...taskInfo[0], viewProps})}</Grid.Col>
                    } else null;
                })
            }
            </Grid>
        </Box>
    );
}