import {useNavigate} from "react-router-dom";
import {
    Avatar,
    Box,
    Divider,
    HStack,
    IconButton,
    Skeleton,
    SkeletonCircle,
    Spacer,
    Text,
    useColorMode
} from "@chakra-ui/react";
import useFeedPostOptions from "../../../hooks/useFeedPostOptions.jsx";
import {TbDots} from "react-icons/tb";
import {useEffect} from "react";

function PostHeader({post,isLoading,user,id}) {
    const navigate=useNavigate()
    const {colorMode} = useColorMode();
    const switchMode=(dark,light)=>(colorMode==='dark'?dark:light)
    const {onOpen,setPostId,setPostOwner}=useFeedPostOptions()


    const handleClickOnOptions=()=>{
        setPostId(id)
        setPostOwner(user?.username)
        onOpen()
    }



    return (
    <Box w={'full'}  h={'61px'}>
        <HStack  w={'full'} alignItems={'center'} px={3}  h={'60px'} >
        {
            isLoading ?

                < >
                    <SkeletonCircle  w={'32px'} h={'32px'} />
                    <Skeleton h='15px'  w={'40%'} noOfLines={1}  />
                </>
                :

                    <HStack >
                        <HStack cursor='pointer' onClick={()=>navigate(`/main/profile/${user?.username}`)} >

                            <Avatar w='32px'  h='32px'  src={user?.profilePicURL}  />

                            <Text sx={{display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden'}} maxW={'240px'} fontWeight='semibold' fontSize='sm' >{user?.username}</Text>
                        </HStack>

                    </HStack>


        }

            <Spacer />
            <IconButton aria-label={'options'} onClick={handleClickOnOptions}  _active={{color:'gray'}} color={switchMode('white','black')} justifyContent={'end'} icon={<TbDots size={25} />} variant='link' />

        </HStack>
        <Divider borderColor={switchMode('whiteAlpha.400','blackAlpha.400')} />


    </Box>
    );
}

export default PostHeader;