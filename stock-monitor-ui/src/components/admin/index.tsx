import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import { useAppSelector } from "@/redux/hooks";
import { UsersList } from "@/types/custom.types";
import { Triangle } from "react-loader-spinner";
import UsersListComponent from "./usersList";

const AdminDashboard = () => {
  const auth = useAppSelector((state) => state.auth);
  const [usersList, setUserList] = useState<UsersList[]>([]);
  const fetchUserList = async () => {
    try {
      const response = await axiosInstance.get("/admin/users/list");
      if (response.data.success) {
        setUserList(response.data?.usersList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    void fetchUserList();
  }, []);

  return (
    <div className='flex gap-8 h-full'>
      <UsersListComponent fetchUserList={fetchUserList} data={usersList} />
    </div>
  );
};

export default AdminDashboard;
