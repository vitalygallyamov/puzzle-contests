import React, {useContext, useMemo} from 'react';
import { IconLogout } from '@tabler/icons-react';
import { UnstyledButton, Group, Avatar, Text, Box, useMantineTheme, rem, ThemeIcon} from '@mantine/core';
import { Menu, Button } from '@mantine/core';
import * as identityImg from "identity-img";

import {getSigner} from '@/utils/signer';
import {SignerContext} from '@/context/SignerContext';
import { formatAddress } from '@/utils/address';

export function User() {
  const theme = useMantineTheme();
  const {authData, setAuthData} = useContext(SignerContext);

  const onSeedClick = async () => {
    if (!authData.isLogin) {
        const signer = await getSigner('web');
        signer.login().then((userData) => {
            setAuthData?.({userData, isLogin: true, signer})
        });
    }
  }

  const onEmailClick = async () => {
    if (!authData.isLogin) {
        const signer = await getSigner('email');
        signer.login().then((userData) => {
            setAuthData?.({userData, isLogin: true, signer})
        });
    }
  }

  const onKeeperClick = async () => {
    if (!authData.isLogin) {
        const signer = await getSigner('keeper');
        signer.login().then((userData) => {
            setAuthData?.({userData, isLogin: true, signer})
        });
    }
  }

  const logout = () => {
    authData.signer?.logout().then(() => {
        setAuthData?.({userData: undefined, isLogin: false, signer: undefined});
    })
  }

  const avatarSrc = useMemo(() => {
    const address = authData.userData?.address;
    return address ? identityImg.create(address, { size: 255 }) : '#';
  }, [authData.userData?.address]);

  return (
    !authData.isLogin ?
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button>Connect</Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Connect wallet</Menu.Label>
                <Menu.Item onClick={onKeeperClick}>Keeper</Menu.Item>
                <Menu.Item onClick={onEmailClick}>WX email</Menu.Item>
                <Menu.Item onClick={onSeedClick}>WX seed</Menu.Item>
            </Menu.Dropdown>
        </Menu> :
        <Box
        sx={{
            paddingTop: theme.spacing.sm,
            borderTop: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
        }}>
            <UnstyledButton
                sx={{
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                '&:hover': {
                    backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
                }}
            >
                <Group>
                <Avatar
                    src={avatarSrc}
                    radius="xl"
                />
                <Box sx={{ flex: 1 }}>
                    <Text title={authData.userData?.address} size="sm" weight={500}>{formatAddress(authData.userData?.address || '')}</Text>
                    
                </Box>
                <ThemeIcon variant="outline" size="sm" color="gray">
                    <IconLogout onClick={logout} />
                </ThemeIcon>
                

                {/* {theme.dir === 'ltr' ? (
                    <IconChevronRight size={rem(18)} />
                ) : (
                    <IconChevronLeft size={rem(18)} />
                )} */}
                </Group>
            </UnstyledButton>
        </Box>
  );
}