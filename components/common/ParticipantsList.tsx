import { formatAddress } from "@/utils/address";
import { Avatar, Badge } from "@mantine/core";

interface IParticipantsListProps {
    items: string[];
    active?: string;
}

function ParticipantsList(props: IParticipantsListProps) {
    return (
        <>
            {
                (props.items || []).map((address, index) => {
                    return <Badge
                        title={address}
                        key={index}
                        mr={3}
                        size="lg"
                        color={props.active === address ? 'green' : 'blue'}
                        radius="xl">
                        {formatAddress(address)}
                    </Badge>
                })
            }
        </>
    );
}

export default ParticipantsList;