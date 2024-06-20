import { useEffect, useState, useMemo } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import useAuthStore from "../../store/Backend-stores/authStore.js";
import { firestore } from "../../config/firebase.js";

const useChattedUsers = (isOpen) => {
    const [chattedUsers, setChattedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const authUser = useAuthStore(state => state.user);

    useEffect(() => {
        if (!authUser.uid) return;

        const fetchUserDetails = async (uid) => {
            const userDoc = await getDoc(doc(firestore, "users", uid));
            return userDoc.exists() ? userDoc.data() : null;
        };

        const fetchChattedUsers = async () => {
            setLoading(true);

            const unsub = onSnapshot(doc(firestore, "userChats", authUser.uid),
                async (doc) => {
                    if (doc.exists()) {
                        const userChatsData = doc.data();
                        console.log("Fetched user chats data:", userChatsData);
                        const chattedUsersData = await Promise.all(
                            Object.entries(userChatsData).map(async ([chatId, chatData]) => {
                                const userInfo = chatData.userInfo;
                                const userDetails = await fetchUserDetails(userInfo.uid);
                                return {
                                    ...chatData,
                                    chatId,
                                    userInfo: {
                                        ...userInfo,
                                        username: userDetails?.username || "Unknown",
                                        profilePicURL: userDetails?.profilePicURL || "",
                                    },
                                };
                            })
                        );
                        console.log(chattedUsersData)
                        setChattedUsers(chattedUsersData);
                    } else {
                        setChattedUsers([]);
                    }
                    setLoading(false);
                },
                (error) => {
                    console.error("Error fetching chatted users:", error);
                    setLoading(false);
                }
            );

            return () => {
                unsub();
            };
        };

        fetchChattedUsers();
    }, [authUser.uid, isOpen]);

    const sortedChattedUsers = useMemo(() => {
        return chattedUsers ? chattedUsers.sort((a, b) => b.date - a.date) : [];
    }, [chattedUsers]);

    return { chattedUsers: sortedChattedUsers, loading };
};

export default useChattedUsers;