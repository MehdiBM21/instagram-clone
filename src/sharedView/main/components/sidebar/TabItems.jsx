import {Avatar, Box, Stack, useBreakpointValue, useColorMode} from "@chakra-ui/react";

import PathNavItem from "./PathNavItem.jsx";
import {GoHeart, GoHeartFill, GoHome, GoHomeFill} from "react-icons/go";
import DrawerNavItem from "./DrawerNavItem.jsx";
import {RiSearch2Fill, RiSearchLine, RiSendPlaneFill, RiSendPlaneLine} from "react-icons/ri";
import {MdExplore, MdOutlineExplore} from "react-icons/md";
import ModalNavItem from "./ModalNavItem.jsx";
import {CgAddR} from "react-icons/cg";
import useDummyPosts from "../../../../hooks/useDummyPosts.jsx";
import {useEffect, useState} from "react";
import useAuthStore from "../../../../store/Backend-stores/authStore.js";
import {HeartWithNotification} from "../../../../assets/constants.jsx";

function TabItems() {

    const {colorMode}=useColorMode()


    const switchMode=(dark,light)=>(colorMode==='dark'?dark:light)



    const authUser=useAuthStore((state)=>state.user)


    return(


                <Stack direction={{base:'row',md:'column'}} width={'full'} alignItems={{base: 'center',lg:'inherit'}} justifyContent={{base:"space-around",md:'inherit'}} gap={{base:0,md:3}}>

                    <PathNavItem  name='Home' icon={<GoHome size={27} strokeWidth={0.5} />} filledIcon={<GoHomeFill size={27}  />} path={'/main/home'}  />


                    <Box display={{base:'none',md:'block'}} >
                        <DrawerNavItem name='Search' icon={<RiSearchLine size={27} strokeWidth={0.5} />} filledIcon={<RiSearch2Fill size={27}  />} />
                    </Box>

                    <PathNavItem name='Explore' icon={<MdOutlineExplore size={27} />} filledIcon={<MdExplore size={27} />} path={'explore'}   />


                    <PathNavItem name='Messages' path={'chat'} icon={<RiSendPlaneLine size={27} strokeWidth={0.2} />} filledIcon={<RiSendPlaneFill size={27}  />}   />

                    {/* <Box display={{base:'none',md:'block'}} >
                        <PathNavItem name='Notifications' path={'explore'} icon={  <HeartWithNotification  borderColor={switchMode('black','white')} />} filledIcon={<GoHeartFill size={26}  />} />
                    </Box> */}


                    <ModalNavItem name='Create' icon={<CgAddR size={27} strokeWidth={0.05} />}    />


                    <PathNavItem name='profile' path={`profile/${authUser.username}`} icon={ <Avatar src={ authUser?.profilePicURL} w='28px' h='28px'  />} filledIcon={ <Avatar src={ authUser?.profilePicURL} w='28px' h='28px' border={switchMode('white 2px solid ','black 2px solid  ')} />} />



                </Stack>


        );
}

export default TabItems;