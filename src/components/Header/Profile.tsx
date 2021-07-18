import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
    showProfileData?: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {
    return (
        <Flex align="center">
            {showProfileData && (
                <Box mr="4" textAlign="right">
                    <Text>Claudio Marcio Stocco</Text>
                    <Text color="gray.300" fontSize="small">
                        claudiostocco@gmail.com
                    </Text>
                </Box>
            )}
            <Avatar size="md" name="Claudio Marcio Stocco" src="https://avatars.githubusercontent.com/u/47143084?v=4" />
        </Flex>
    );
}