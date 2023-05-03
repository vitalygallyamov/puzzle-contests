import { Title, Grid, Space } from "@mantine/core";

import Card from '@/components/contests/Card';


export default function Home() {
  return (
    <div>
      <Title>Contests</Title>
      <Space h='md'/>
      <Grid>
        <Grid.Col span={3}>
          <Card name="Buy&hold 10 PUZZLE"/>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card name="Buy 1 NFT from market"/>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card name="Stake 10 puzzle"/>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card name="Swap in 5 days"/>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card name="Liquidity to the pool"/>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card name="Supply 100 Waves"/>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card name="Stake 10 Waves"/>
        </Grid.Col>
      </Grid>
    </div>
  )
}
