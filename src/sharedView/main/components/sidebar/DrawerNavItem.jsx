import React, {useEffect} from 'react';
import {Box, Button, IconButton, Tooltip, useColorMode, useDisclosure} from "@chakra-ui/react";
import useToggleSidebar from "../../../../hooks/useToggleSidebar.jsx";
import SearchDrawer from "../../../../laptopView/search/SearchDrawer.jsx";


function DrawerNavItem({name,icon,filledIcon}) {

    const {colorMode}=useColorMode()
    const switchMode=(dark,light)=>(colorMode==='dark'?dark:light)
    const { isOpen, onOpen,onClose } = useDisclosure()
    // const btnRef = React.useRef()
    const {isSidebarMinimized,isDrawerOpen,toggleDrawer,setClose} = useToggleSidebar();




    const handleState=(state1,state2)=>{
        if(isDrawerOpen || isSidebarMinimized){
            return state1
        }
        return state2
    }

    useEffect(()=>{

        toggleDrawer(isOpen)

    },[isOpen])



    useEffect(()=>{
        setClose(onClose)
    },[])




    return (
        <>
            <Box  display={handleState('block',{base:'block',xl:'none'})}>
                <Tooltip display={{base:'none',md:'block'}} label={name} bg={switchMode('#262626','white')} boxShadow={switchMode("none",'xs')} color={switchMode("white",'black')}  m={2} placement='right'  p={2} borderRadius={8} >
                    <IconButton   variant={{base:"styled",md:"ghost"}}  py={6} px={3}    onClick={isDrawerOpen?onClose:onOpen }    icon={isDrawerOpen ? filledIcon : icon}  aria-label={name}/>
                </Tooltip>
            </Box>

            <Box  display={handleState('none',{base:'none',xl:'block'})} width={'full'}>
                <Button  fontSize={'lg'}  variant={"ghost"} py={6} justifyContent={'flex-start'} pl={3}    width={'full'} onClick={onOpen}   iconSpacing={4} fontWeight={'400'}  leftIcon={ icon}     >
                    {name}
                </Button>
            </Box>
            <SearchDrawer isOpen={isOpen} onClose={onClose} />



        </>
    );

}

export default DrawerNavItem;