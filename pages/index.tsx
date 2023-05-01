import { Title, Grid, Space } from "@mantine/core";

import Card from '@/components/contests/Card';


export default function Home() {
  return (
    <div>
      <Title>Contests</Title>
      <Space h='md'/>
      <Grid>
        <Grid.Col span={4}>
          <Card/>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card/>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card/>
        </Grid.Col>
      </Grid>
    </div>
  )
}
