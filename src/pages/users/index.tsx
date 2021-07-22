import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import Link from 'next/link';

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { SideBar } from "../../components/SideBar";
import { useUsers } from "../../services/hooks/useUsers";

export default function UserList() {
    const isLGScreen = useBreakpointValue({
        base: false,
        lg: true
    })
    const isMDScreen = useBreakpointValue({
        base: false,
        md: true
    })

    const { data, isLoading, isFetching , error } = useUsers();

    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
                <SideBar />
                <Box flex="1" borderRadius={8} bg="gray.800" p={["4","8"]}>
                    <Flex mb="8" justify="space-between" align="center">
                        <Heading size="lg" fontWeight="normal">
                            Usuários
                            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
                        </Heading>
                        <Link href="/users/create" passHref>
                            <Button as="a" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon as={RiAddLine} fontSize="20" />}>
                                Criar novo
                            </Button>
                        </Link>
                    </Flex>
                    {isLoading ? (
                        <Flex justify="center" align="flex-end" h={100}>
                            <Spinner />
                        </Flex>
                    ) : error ? (
                        <Flex justify="center" align="flex-end" h={100}>
                            <Text>Falha ao obter dados do usuário!</Text>
                        </Flex>
                    ) : (
                        <>
                            <Table colorScheme="whiteAlpha">
                                <Thead>
                                    <Tr>
                                        <Th px={["2","4","6"]} color="gray.300" w="8">
                                            <Checkbox colorScheme="pink" />
                                        </Th>
                                        <Th>Usuário</Th>
                                        {isMDScreen && (<Th>Data cadastro</Th>)}
                                        <Th px={["1","4","6"]} w="8"></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.map(user => (
                                        <Tr key={user.id}>
                                            <Td px={["2","4","6"]}>
                                                <Checkbox colorScheme="pink" />
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <Text fontWeight="bold">{user.name}</Text>
                                                    <Text color="gray.300" fontSize="sm">{user.email}</Text>
                                                </Box>
                                            </Td>
                                            {isMDScreen && (<Td>{user.createdAt}</Td>)}
                                            <Td px={["1","4","6"]}>
                                                <Button
                                                    as="a"
                                                    size="sm"
                                                    fontSize="sm"
                                                    colorScheme="purple"
                                                    iconSpacing={isLGScreen ? 2 : 0}
                                                    leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                                                >
                                                    {isLGScreen && 'Editar'}
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                            <Pagination />
                        </>
                    )}
                </Box>
            </Flex>
        </Box>
    )
}