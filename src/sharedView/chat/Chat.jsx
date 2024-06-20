import {Flex, useBreakpointValue} from "@chakra-ui/react";
import useToggleSidebar from "../../hooks/useToggleSidebar.jsx";
import {Suspense, useEffect} from "react";
import {Outlet} from "react-router-dom";
import ChatUsersList from "./components/Chat-UsersList.jsx";
import ProgressLoader from "../loading-pages/ProgressLoader.jsx";
import ChatSearchModal from "./components/Search-Modal/Chat-SearchModal.jsx";

function ChatPage() {



    const {toggle} = useToggleSidebar();



    const display = useBreakpointValue(
        {
            base: 'base',
            sm:'sm',
            md: 'md',
            xl: 'xl',
        }
    )


    useEffect(()=>{

        if (display==='sm' || display==='base'){

            toggle(false)
        }else {
            toggle(true)

        }

    },[display])



    return (
        <Flex w={'full'} h={'100dvh'}  overflow={'hidden'}>
            <ChatUsersList />
            <Suspense fallback={<ProgressLoader />} >
                <Outlet />
            </Suspense>


        </Flex>

    );
}

export default ChatPage;