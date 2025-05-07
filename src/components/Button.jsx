import React from 'react'
import { Link } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react"

const Buttons = () => {
    return (
        <Flex
            justify="center"
            align="center"
            height="50vh"
            gap = {100}
            

        >
            <Button as={Link} to="/login" w="150px" h="60px" fontSize="2xl" variant="surface">
                Login
            </Button>
            <Button as={Link} to="/register" w="150px" h="60px" fontSize="2xl" variant="surface">
                Register
            </Button>
            
    </Flex>
    )
}

export default Buttons