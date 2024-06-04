import React, { useEffect, useState } from "react";
import SubscriptionsList from "./List";
import { Button } from "@/components/ui/button";
import SearchList from "./SearchList";
import axiosInstance from "@/api/axiosInstance";
import { useAppSelector } from "@/redux/hooks";
import { Subscription } from "@/types/custom.types";
import { Triangle } from "react-loader-spinner";
const UserSubscriptionsList = () => {
  const auth = useAppSelector((state) => state.auth);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loader, setLoader] = useState(false);
  const fetchUserSubscriptions = async () => {
    try {
      const response = await axiosInstance.get(
        `/subscriptions/list/${auth.user.userId}`
      );
      if (response.data.success) {
        setSubscriptions(response.data?.subscriptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    void fetchUserSubscriptions();
  }, []);

  return (
    <>
      {loader ? (
        <div className='flex flex-col justify-center items-center h-full'>
          <Triangle
            visible={true}
            height='80'
            width='80'
            color='#FFFFFF'
            ariaLabel='triangle-loading'
            wrapperStyle={{}}
            wrapperClass=''
          />
        </div>
      ) : (
        <div className='flex gap-8 h-full'>
          <SearchList
            fetchUserSubscriptions={fetchUserSubscriptions}
            subscriptions={subscriptions}
            setLoader={setLoader}
          />
          <SubscriptionsList
            fetchUserSubscriptions={fetchUserSubscriptions}
            data={subscriptions}
          />
        </div>
      )}
    </>
  );
};

export default UserSubscriptionsList;
