import { Title, Grid, Space } from "@mantine/core";

import Card from '@/components/contests/Card';
import { IContestData, getAll } from "@/bl/contest";
import { useEffect } from "react";

interface IContestsPageProps {
    data: IContestData[];
}

export async function getServerSideProps() {
    const data = await getAll();
    return {
        props: {data},
    };
}

export default function Contests(props: IContestsPageProps) {
    return (
        <div>
            <Title>Contests</Title>
            <Space h='md' />
            <Grid>
                {
                    props.data?.map((item) =>
                        <Grid.Col key={item.id} span={4}>
                            <Card item={item} />
                        </Grid.Col>
                    )
                }
            </Grid>
        </div>
    )
}
