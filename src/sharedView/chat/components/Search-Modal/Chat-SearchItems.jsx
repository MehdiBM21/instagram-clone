import React, {useState} from 'react';
import {Box, Center, Spinner, Text} from "@chakra-ui/react";
import UserProfileSkeleton from "../../../profile/components/UserProfileSkeleton.jsx";
import SearchItem from "../../../../laptopView/search/components/SearchItem.jsx";
import ChatSearchItem from "./Chat-SearchItem.jsx";
import {doc, getDoc, serverTimestamp, setDoc, updateDoc} from "firebase/firestore";
import useChatStore from "../../../../store/Backend-stores/chatStore.js";
import useAuthStore from "../../../../store/Backend-stores/authStore.js";
import {firestore} from "../../../../config/firebase.js";

function ChatSearchItems({handleClose,searchedUsers,isSearchLoading}) {


    const [selectLoading, setSelectLoading] = useState(false)
    const authUser = useAuthStore(state => state.user);
    const setSelectedUser = useChatStore(state => state.setUser)

    const handleSelect = async (userData) => {
        setSelectLoading(true);
        const combinedId = authUser.uid > userData.uid ? authUser.uid + userData.uid : userData.uid + authUser.uid;

        try {
            const res = await getDoc(doc(firestore, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(firestore, "chats", combinedId), { messages: [] });
                await updateDoc(doc(firestore, "userChats", authUser.uid), {

                    [combinedId + ".userInfo"]: {
                        uid: userData.uid,

                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
                console.log("user added in authUser chat");



                await updateDoc(doc(firestore, "userChats", userData.uid), {
                    [combinedId+".userInfo"]: {
                        uid: authUser.uid,
                        username: authUser.username,
                        profilePicUrl: authUser.profilePicURL,
                    },
                    [combinedId+".date"]: serverTimestamp(),
                });
                console.log("user added in selected user chat");
                setSelectLoading(false)

            }
            handleClose();
            setSelectedUser({user:userData,chatId:combinedId});
            localStorage.setItem("selected-user", JSON.stringify({user:userData,chatId:combinedId}));
        } catch (err) {
            console.log(err);
        }

    }


    return (
        <Box overflowY='auto' w={'full'} my={3}>

            {
                isSearchLoading ?
                    [0,1,2].map((key) =>{
                        return (
                            <Box key={key} px={4} >
                                <UserProfileSkeleton />
                            </Box>
                        )
                    })

                    :
                    (
                        searchedUsers.length === 0?
                            <Box px={4} >
                                <Text color={'gray'}>No account found.</Text>
                            </Box>
                            :
                            (
                                selectLoading ?
                                    <Center w={'full'} py={5}>
                                        <Spinner />
                                    </Center>
                                    :
                                    searchedUsers.map((user,key) => <ChatSearchItem handleSelect={handleSelect} key={key} user={user} />)

                            )
                    )

            }




        </Box>
    );
}

export default ChatSearchItems;