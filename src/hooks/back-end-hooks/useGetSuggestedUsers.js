import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import useAuthStore from "../../store/Backend-stores/authStore.js";
import {firestore} from "../../config/firebase.js";

const useGetSuggestedUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const authUser = useAuthStore((state) => state.user);



  useEffect(() => {

    if(authUser) getSuggestedUsers();
  }, [authUser]);


  const getSuggestedUsers = async () => {
    setIsLoading(true);
    try {
      const usersRef = collection(firestore, "users");
      const q = query(
          usersRef,
          where("uid", "not-in", [authUser.uid, ...authUser.following]),
          orderBy("uid"),
          limit(3)
      );

      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({...doc.data(), id: doc.id});
      });
      // console.log("DFdff",users)
      setSuggestedUsers(users);
    } catch (error) {
      console.error( error.message);
    }finally{
      setIsLoading(false);
    }
  };

  return { isLoading, suggestedUsers,getSuggestedUsers };
};

export default useGetSuggestedUsers;