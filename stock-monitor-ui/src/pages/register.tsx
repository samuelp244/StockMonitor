import CreateAccount from "@/components/auth/CreateAccount";
import React from "react";

const Register = () => {
  return (
    <main className='flex justify-center items-center min-h-screen'>
      <div className='overflow-hidden rounded-lg border bg-background shadow-md w-full max-w-lg'>
        <CreateAccount />
      </div>
    </main>
  );
};

export default Register;
