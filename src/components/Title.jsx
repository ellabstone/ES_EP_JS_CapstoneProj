import React from 'react'
import { Text , Flex} from "@chakra-ui/react"


const Title = () => {
  return (
    <Flex height = "25vh" alignItems="center" justifyContent="Center" flexDirection="column">
        <Text textStyle="5xl"> Budget 4 You</Text>
        <Text textStyle="2xl">The Only Budgeting Tool You Need!</Text>
        
    </Flex>
  )
}

export default Title
