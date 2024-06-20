import {Box, Center, Heading, useColorMode, VStack} from "@chakra-ui/react";
import DirectNavBar from "../components/Direct-NavBar.jsx";
import DirectChatBox from "../components/Direct-ChatBox.jsx";
import DirectChatInput from "../components/Direct-ChatInput.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import useAuthStore from "../../../store/Backend-stores/authStore.js";
import {useEffect} from "react";
import useChatStore from "../../../store/Backend-stores/chatStore.js";
import useGetUserProfileById from "../../../hooks/back-end-hooks/useGetUserProfileById.js";


function Direct() {

    const {colorMode}=useColorMode()
    const switchMode=(dark,light)=>(colorMode==='dark'?dark:light)
    const {id}=useParams()
    const authUser = useAuthStore((state) => state.user);
    const {isUserLoading,userProfile,getUserProfile}=useGetUserProfileById()







    if(!id.includes(authUser.uid) ){
        return <VStack w={'full'} pt={10}>

            <Heading>No chat found</Heading>
            <Link to={'/main/chat/inbox'}>return to box</Link>

        </VStack>
    }
    useEffect(()=>{

        getUserProfile(id.replace(authUser.uid,''))

    },[id])


    return (

        <VStack w={'full'} h={'full'} zIndex={3000}>
            <Box w={'full'} >
                <DirectNavBar user={userProfile} chatId={id} isLoading={isUserLoading} />
            </Box>

            <Box w={'full'}  h={{base:'calc(100% - 137px)',md:'calc(100% - 153px)'}} minH={{base:'calc(100% - 237px)',md:'calc(100% - 253px)'}} >
                <DirectChatBox id={id} user={userProfile} />
            </Box>


            <Box flexGrow={1} w={'full'} zIndex={5000} bgColor={switchMode('black','white')}   >
                <DirectChatInput chatId={id} user={userProfile} />

            </Box>

        </VStack>

    );
}

export default Direct;