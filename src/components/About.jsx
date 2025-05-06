import React from 'react'
import { Text , Flex} from "@chakra-ui/react"

const Title = () => {
    return (
        <Flex mt="-100px" alignItems="center" justifyContent="Center" flexDirection="column">
            <Text textStyle="2xl"> About Our Budgeting Tool </Text>
            <Text textStyle="2xl"> Take control of your finances with three powerful budgeting methods: </Text>
            <Text textStyle="2xl"> 💰 50/20/30 Budget - Spend 50% on needs, 20% on savings, and 30% on wants for a balanced approach. </Text>
            <Text textStyle="2xl"> 🏦 Pay Yourself First - Prioritize savings before expenses to build financial security. </Text>
            <Text textStyle="2xl"> 📊 Zero-Based Budget - Assign every dollar a purpose so your income minus expenses equals zero. </Text>
            <Text textStyle="2xl"> Start budgeting smarter today!</Text>

        </Flex>

    )
}
    
export default Title