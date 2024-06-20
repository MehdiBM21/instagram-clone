import {Modal, ModalCloseButton, ModalContent, ModalOverlay, useColorMode, VStack,} from "@chakra-ui/react";

import CreatePostTabs from "./components/CreatePost-Tabs.jsx";


function CreatePostModal({ isOpen, onClose }) {


    const { colorMode } = useColorMode();
    const switchMode = (dark, light) => (colorMode === 'dark' ? dark : light);



    return (

            <Modal isOpen={isOpen} onClose={onClose} size={{base:'full',md:'2xl',lg:'3xl',xl:'4xl'}}  isCentered  >

                <ModalOverlay zIndex={'1500'}  right={0 } />
                <ModalCloseButton  color={'white'} bg={'transparent'}  display={{base:'none',md:'block'}}   zIndex={'50020'} size={'lg'} right={1} top={1} />
                <VStack zIndex={'2000'} pos='relative'>

                    <ModalContent  maxH={'fit-content'} maxW={'fit-content'}  bg={switchMode('#262626', 'white')}  p='0' borderRadius={'2xl'} >

                        <CreatePostTabs closeModal={onClose} />

                    </ModalContent>
                </VStack>

            </Modal>


    );
}

export default CreatePostModal;

