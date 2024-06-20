import { useEffect, useState } from 'react';
import {
    Badge,
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Spinner,
    Text,
    useColorMode,
    Wrap,
    WrapItem
} from "@chakra-ui/react";

import useSharePost from "../../../hooks/useSharePost.jsx";
import { IoClose } from "react-icons/io5";
import SharePostItem from "../components/SharePost-item.jsx";
import useSliderAlert from "../../../hooks/useSliderAlert.jsx";
import useChattedUsers from "../../../hooks/back-end-hooks/useChattedUsers.js";
import useAuthStore from "../../../store/Backend-stores/authStore.js";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../../config/firebase.js";

function SharePostModal() {
    const { colorMode } = useColorMode();
    const switchMode = (dark, light) => (colorMode === 'dark' ? dark : light);

    const { isOpen, onClose, postId } = useSharePost();
    const { setIsSliderAlertOpen } = useSliderAlert();
    const [isSentLoading, setSentIsLoading] = useState(false);
    const [usersSharedWith, setUsersSharedWith] = useState([]);
    const { chattedUsers, loading } = useChattedUsers(isOpen);
    const authUser = useAuthStore((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setUsersSharedWith([]);
            setSearchTerm("");
        }
    }, [isOpen]);

    const sendTo = (value) => {
        setUsersSharedWith((prevState) => {
            const userExists = prevState.some(user => user.username === value.username);
            if (!userExists) {
                return [...prevState, value];
            }
            return prevState;
        });
    };

    const removeFromList = (value) => {
        setUsersSharedWith((prevState) => prevState.filter(user => user.username !== value.username));
    };

    const handleSend = async () => {
        if (usersSharedWith.length > 0) {
            const newURL = `${window.location.origin}/main/${postId}`;
            setSentIsLoading(true);

            try {
                usersSharedWith.map(async (user) => {
                    const chatDocRef = doc(firestore, "chats", user.chatId);
                    await updateDoc(chatDocRef, {
                        messages: arrayUnion({
                            id: new Date().getTime().toString(),
                            text: newURL,
                            senderId: authUser.uid,
                            date: Date.now(),
                        })
                    });
                    await updateDoc(doc(firestore, "userChats", authUser.uid), {
                        [user.chatId + ".lastMessage"]: {
                            text: "you sent an attachment",
                        },
                        [user.chatId + ".date"]: serverTimestamp(),
                    });
                    await updateDoc(doc(firestore, "userChats", user.uid), {
                        [user.chatId + ".lastMessage"]: {
                            text: `${authUser.username} sent an attachment`,
                        },
                        [user.chatId + ".date"]: serverTimestamp(),
                    });
                })

                setIsSliderAlertOpen('true', "Sent");
                onClose();
            } catch (error) {
                console.error("Error sending URL to users:", error);
            } finally {
                setSentIsLoading(false);
            }
        }
    };

    const filteredUsers = chattedUsers.filter(user =>
        user.userInfo.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered size={{ base: 'full', md: 'xl' }}>
            <ModalOverlay zIndex={2000} bg={'blackAlpha.800'} />
            <Box zIndex={2000} pos='relative'>
                <ModalContent w={{ base: 'full', xl: '550px' }} minH={'430px'} maxH={'70%'} bg={switchMode('#262626', 'white')} borderRadius={'14px'} overflow='hidden'>
                    <Text textAlign={'center'} fontWeight='bold' py='10px'>Share</Text>
                    <ModalCloseButton bg='transparent' size={'lg'} right={'2'} top={0} />
                    <Divider borderColor={switchMode('whiteAlpha.300', 'blackAlpha.300')} />
                    <Flex px={5} w='full' gap={1} py={2}>
                        <Text fontWeight='semibold' fontSize='16px'>To:</Text>
                        <Wrap w='full' flex="1">
                            {usersSharedWith.map((user, key) => (
                                <WrapItem key={key}>
                                    <Badge bg='#E1F1FF' cursor='pointer' borderRadius={'xl'} color='#0095F6' py='1' px={3}>
                                        <Flex gap={1}>
                                            <Text _hover={{ color: '#1c2b33' }}>{user.username}</Text>
                                            <IoClose size={19} onClick={() => removeFromList(user)} />
                                        </Flex>
                                    </Badge>
                                </WrapItem>
                            ))}
                            <WrapItem flex="1" minW='180px' w='full'>
                                <Input
                                    ml={5}
                                    mr={2}
                                    placeholder='Search...'
                                    variant='unstyled'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </WrapItem>
                        </Wrap>
                    </Flex>
                    <Divider borderColor={switchMode('whiteAlpha.300', 'blackAlpha.300')} />
                    <ModalBody overflowY={'auto'} px={0}>
                        {loading ?
                            <Center h={'430px'}>
                                <Spinner />
                            </Center>
                            : (
                                filteredUsers.length === 0 ? (
                                    <Text fontWeight={'semibold'} px={6}>No user found</Text>
                                ) : (
                                    filteredUsers.map((user, key) => (
                                        <SharePostItem
                                            key={key}
                                            sendTo={sendTo}
                                            removeFromList={removeFromList}
                                            chatId={user.chatId}
                                            uid={user.userInfo.uid}
                                            user={user.userInfo}
                                            isChecked={usersSharedWith.some(sharedUser => sharedUser.uid === user.userInfo.uid)}
                                        />
                                    ))
                                )
                            )}
                    </ModalBody>
                    <Divider borderColor={switchMode('whiteAlpha.300', 'blackAlpha.300')} />
                    <ModalFooter>
                        {isSentLoading ? (
                            <Center w={'full'}>
                                <Spinner />
                            </Center>
                        ) : (
                            <Button w='full' onClick={handleSend} _active={{ bg: 'blue.300' }} size='sm' color='white' variant='unstyled' bg='#0095F6'>Send</Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Box>
        </Modal>
    );
}

export default SharePostModal;
