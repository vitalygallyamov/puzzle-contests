import React from 'react';
import { Navbar } from '@mantine/core';
import { User } from './user';
import { Brand } from './brand';
import { MainLinks } from './mainLinks';

const code = `
import { Navbar } from '@mantine/core';
function Demo() {
  return (
    <Navbar height={600} p="xs" width={{ base: 300 }}>
      <Navbar.Section>{/* Header with logo */}</Navbar.Section>
      <Navbar.Section grow mt="md">{/* Links sections */}</Navbar.Section>
      <Navbar.Section>{/* Footer with user */}</Navbar.Section>
    </Navbar>
  );
}
`;

function Nav() {
  return (
    <Navbar p="xs" width={{ base: 300 }}>
      <Navbar.Section grow mt="md">
        <MainLinks />
      </Navbar.Section>
      <Navbar.Section>
        <User />
      </Navbar.Section>
    </Navbar>
  );
}

export default Nav;