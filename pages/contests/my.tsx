import { Title, Grid, Space } from "@mantine/core";

import Card from '@/components/contests/Card';
import { IContestData, getAll } from "@/bl/contest";
import { useContext, useEffect } from "react";
import { SignerContext } from "@/context/SignerContext";
import { useRouter } from "next/router";

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
    const router = useRouter();
    const {authData} = useContext(SignerContext);
    const {address} = authData.userData || {};

    useEffect(() => {
        if (!address) {
            router.replace('/contests');
        }
    }, [address]);
    return (
        <div>
            <Title>My contests</Title>
            <Space h='md' />
            <Grid>
                {
                    address && props.data ?
                        props.data.filter(item => item.owner === address).map((item) =>
                            <Grid.Col key={item.id} span={4}>
                                <Card item={item} />
                            </Grid.Col>
                        ) : null
                }
            </Grid>
        </div>
    )
}
