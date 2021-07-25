import { Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useEffect } from 'react';

import { apiAuth } from '../../services/api';

export function Footer() {
    const [ testMsg, setTestMsg ] = useState('');
    const [ version, setVersion ] = useState('');

    useEffect(() => {
        apiAuth.get('/test')
        .then(response => setTestMsg(response.data.test))
        .catch(error => console.log(error));

        apiAuth.get('/version')
        .then(response => setVersion(response.data.version))
        .catch(error => console.log(error));
    },[]);

    return (
        <Flex
            as="footer"
            w="100%"
            maxW={1480}
            h="20"
            mx="auto"
            mt="4"
            px="6"
            align="center"
        >
            <Text
                align="center"
                mx="auto"
            >
                Versão: {version}
            </Text>
            <Text
                align="center"
                mx="auto"
            >
                Teste: {testMsg}
            </Text>
        </Flex>
    )
}