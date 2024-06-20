import { Collapse, Flex, IconButton, keyframes, Text, useColorMode, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { RiChat3Line, RiSendPlaneLine } from "react-icons/ri";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import FeedPostCommentInput from "./FeedPostCommentInput.jsx";
import { Link } from "react-router-dom";
import usePostLikes from "../../../../hooks/usePostLikes.jsx";
import useSharePost from "../../../../hooks/useSharePost.jsx";
import usePostModal from "../../../../hooks/usePostModal.jsx";
import useLikePost from "../../../../hooks/back-end-hooks/useLikePost.js";
import useSavePost from "../../../../hooks/back-end-hooks/useSavePost.js";

function FeedPostFooter({ doubleClickLike, setDoubleClickLike,id, post, user }) {
    const { colorMode } = useColorMode();
    const switchMode = (dark, light) => (colorMode === 'dark' ? dark : light);

    const [show, setShow] = useState(false);
    const { onLikesOpen, setPostId } = usePostLikes();
    const { onShareOpen, setSharedPostId } = useSharePost();
    const {onOpenPostModal,setUrl}=usePostModal()


    const {likes,handleLikePost,isLiked}=useLikePost(post,id)



    const {saved, handleSavePost, isUpdating}=useSavePost(post,id)


    const handleClickOnComments = () => {

        setUrl(document.URL)

        window.history.replaceState(null, null, `/main/p/${id}`)
        onOpenPostModal()
    };

    useEffect(() => {
        // console.log(doubleClickLike , !isLiked)
        if (doubleClickLike && !isLiked) {
            handleLikePost()
        }
    }, [doubleClickLike, isLiked]);


    const handleOnLikesClick = () => {
        setPostId(id);
        onLikesOpen();
    };

    const handleOnShareClick = () => {
        setSharedPostId(`p/${id}`);
        onShareOpen();
    };

    return (
        <VStack w={'full'} spacing={'5px'}>

            <Flex justifyContent={'space-between'} w={'full'} py={1}>
                <Flex>

                    {isLiked ?
                        <IconButton onClick={handleLikePost} variant={'link'} aria-label={'like'} animation={animation} icon={<GoHeartFill size={27} color={'#FE2F40'} />} />
                        :
                        <IconButton onClick={handleLikePost} _hover={{ color: 'gray' }} variant={'link'} color={switchMode('white', 'black')} aria-label={'unlike'} icon={<GoHeart strokeWidth={0.3} size={27} />} />
                    }
                    <IconButton _hover={{ color: 'gray' }} onClick={handleClickOnComments} transform="rotateY(180deg)" variant={'link'} color={switchMode('white', 'black')} aria-label={'comments'} icon={<RiChat3Line strokeWidth={0} size={28} />} />
                    <IconButton _hover={{ color: 'gray' }} onClick={handleOnShareClick} transform="rotate(10deg)" variant={'link'} color={switchMode('white', 'black')} aria-label={'share'} icon={<RiSendPlaneLine strokeWidth={0} size={28} />} />
                </Flex>
                {saved ?
                    <IconButton onClick={handleSavePost} variant={'link'} color={switchMode('white', 'black')} aria-label={'unsaved'} icon={<FaBookmark strokeWidth={3} size={23} />} />
                    :
                    <IconButton _hover={{ color: 'gray' }} onClick={handleSavePost} variant={'link'} color={switchMode('white', 'black')} aria-label={'unsaved'} icon={<FaRegBookmark strokeWidth={3} size={23} />} />
                }
            </Flex>
            {
                likes===0?
                    <>
                        <Text px={{ base: 2, smd: 1 }} onClick={handleLikePost} as='span' w={'full'} fontWeight={'semibold'} cursor='pointer' fontSize={'sm'} textAlign={'start'}><span style={{fontWeight:'normal'}} > be the first to</span>  like this </Text>

                    </>
                    :
                    <Text px={{ base: 2, smd: 1 }} onClick={handleOnLikesClick} as='span' w={'full'} fontWeight={'semibold'} cursor='pointer' fontSize={'sm'} textAlign={'start'}>{likes} likes</Text>

            }
            <Flex w={'full'} gap={'3px'} px={{ base: 2, smd: 1 }} fontSize={'sm'}>
                <Collapse startingHeight={20} in={show}>
                    <Link style={{ fontWeight: 500, marginRight: '10px', cursor: 'pointer' }} to={`/main/profile/${user?.username}`}>{user?.username}</Link>{post?.caption}
                </Collapse>
                {post?.caption.length > 30 &&
                    <Text as='span' color='gray' cursor='pointer' onClick={() => setShow(true)}>
                        {!show && 'more...'}
                    </Text>
                }
            </Flex>
            <Text w='full' px={{ base: 2, smd: 1 }} cursor='pointer' onClick={handleClickOnComments} fontSize={'sm'} color={'gray'}> View all {post?.comments.length} comments </Text>
            <FeedPostCommentInput  id={id}/>
        </VStack>
    );
}

export default FeedPostFooter;

const animationKeyframes = keyframes`
    50%{ scale: 1.3; }
    100%{ scale: 1; }
`;

const animation = `${animationKeyframes} 0.25s ease`;
