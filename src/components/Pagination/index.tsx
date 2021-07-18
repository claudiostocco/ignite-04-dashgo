import { Box, Stack } from "@chakra-ui/react";
import { useState } from "react";
import pages from "../../pages";
import { PaginationItem } from "./PaginationItem";

export function Pagination() {
    const [ currentPage, setCurrentPage ] = useState(1);
    const pages = [1,2,3,4,5,6,7];

    const handlePaginationItemClick = (e) => {
        setCurrentPage(Number(e.target.textContent));
    }

    return (
        <Stack
            direction={["column","row"]}
            spacing="6"
            mt="8"
            justifyContent="space-between"
            align="center"
        >
            <Box>
                <strong>0</strong> - <strong>10</strong> de <strong>100</strong>
            </Box>
            <Stack direction="row" spacing="2">
                {pages.map(page => (
                    <PaginationItem key={page} page={page} isCurrent={page===currentPage} onClick={(e) => handlePaginationItemClick(e)} />
                ))}
            </Stack>
        </Stack>
    )
}