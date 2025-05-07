import React from 'react'
import { Image, Flex } from "@chakra-ui/react"

export const Photos = () => {
    return (
        <Flex 
        justify="center"
        alignItems="center"
        gap = {450}
        >
        
        <Image 
            src="/assets/budgetImage.png"
            alt="Budget Smart"
            boxSize="200px"
            border="3px solid black"
            marginTop="-800px"

        />
        <Image 
            src="/assets/saveMoneyPig.png"
            alt="Pig"
            boxSize="200px"
            border="3px solid black"
            marginTop="-800px"

        />
        
        </Flex>
    )

}

export default Photos