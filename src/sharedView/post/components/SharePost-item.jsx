import React, { useEffect, useState } from 'react';
import { Avatar, Box, Center, HStack, Spacer, Text, useColorMode, VStack } from "@chakra-ui/react";
import { IoMdCheckmark } from "react-icons/io";
import useGetUserProfileById from "../../../hooks/back-end-hooks/useGetUserProfileById.js";
import UserProfileSkeleton from "../../profile/components/UserProfileSkeleton.jsx";

function SharePostItem({user,uid, chatId,sendTo, removeFromList,  isChecked }) {
    const { colorMode } = useColorMode();
    const switchMode = (dark, light) => (colorMode === 'dark' ? dark : light);
    const [isCheked, setIsCheked] = useState(isChecked);






    useEffect(() => {
        if (isCheked) {
            sendTo({username:user?.username,uid,chatId});
        } else {
            removeFromList({username:user?.username,uid, chatId});
        }
    }, [isCheked]);


    useEffect(() => {
        setIsCheked(isChecked);
    }, [isChecked]);

    const handleCheck = () => {
        setIsCheked(!isCheked);
    };

    return (

        <VStack _hover={{ bg: switchMode('whiteAlpha.200', 'blackAlpha.100') }} onClick={handleCheck} cursor={'pointer'} px={5}>
            <HStack w='full' h={'60px'}>
                <HStack w='full'>
                    <Avatar w='44px' height='44px' src={user?.profilePicURL} />
                    <Box maxH={'44px'} >
                        <Text fontSize='sm' fontWeight='semibold' cursor={'pointer'} sx={{display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden'}} maxW={{base:'170px',md:'200px'}}>{user?.username}</Text>
                    </Box>
                </HStack>
                <Spacer />
                <Center w='24px' h='24px' minW={'24px'} borderRadius='50%' aspectRatio={1} bg={isCheked && switchMode('#F8F9F9', '#0F1419')} border={'1px '} borderColor='#DFE2E7'>
                    {isCheked && <IoMdCheckmark color={switchMode('black', 'white')} />}
                </Center>
            </HStack>
        </VStack>
    );
}

export default SharePostItem;
