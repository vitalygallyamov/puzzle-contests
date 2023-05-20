import { Breadcrumbs, Anchor } from '@mantine/core';
import Link from 'next/link';

interface IBcProps {
    items: {
        href: string;
        title: string;
    }[];
}

function Bc(props: IBcProps) {
    const items = (props.items || []).map((item, index) => (
        <Anchor component={Link} href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));
    return (
        <>
            <Breadcrumbs separator="→" mt="xs">{items}</Breadcrumbs>
        </>
    );
}

export default Bc;