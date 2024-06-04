import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { setAccessToken, setUserData } from "@/redux/authReducer";
import { useAppDispatch } from "@/redux/hooks";
import { CustomZodError } from "@/types/custom.types";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { z } from "zod";

const CreateAccount = () => {
  const [user, setUser] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      // user validation schema
      const userSchema = z.object({
        first: z.string().min(1, "first name is required"),
        last: z.string().min(1, "last name is required"),
        email: z.string().email().min(1, "email is required"),
        password: z.string().min(1, "password is required"),
      });
      // validating inputs with the user schema
      const userValidationResponse = userSchema.safeParse(user);
      // showing the error messages
      if (!userValidationResponse.success) {
        const errArr: CustomZodError[] = [];
        const { errors: err } = userValidationResponse.error;
        for (const error of err) {
          errArr.push({ for: error.path[0], message: error.message });
        }
        toast({
          title: "invalid values",
          description: errArr.map((err) => err.message).join("\n"),
        });
        throw err;
      }
      const response = await axiosInstance.post("/auth/signup", {
        name: {
          first: user.first,
          last: user.last,
        },
        email: user.email,
        password: user.password,
      });
      if (response.data.success) {
        dispatch(setAccessToken(response.data.data));
        dispatch(setUserData(response.data.data));
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Create an account</CardTitle>
        <CardDescription>
          Enter your email and basic details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-4'>
        <div className='grid gap-2 col-span-1'>
          <Label>First</Label>
          <Input
            name='first'
            type='text'
            value={user.first}
            placeholder='robert'
            onChange={handleChange}
          />
        </div>
        <div className='grid gap-2 col-span-1'>
          <Label>Last</Label>
          <Input
            name='last'
            type='text'
            value={user.last}
            placeholder='downey jr'
            onChange={handleChange}
          />
        </div>
        <div className='grid gap-2 col-span-2'>
          <Label>Email</Label>
          <Input
            name='email'
            type='email'
            value={user.email}
            placeholder='m@example.com'
            onChange={handleChange}
          />
        </div>
        <div className='grid gap-2 col-span-2'>
          <Label>Password</Label>
          <Input
            name='password'
            value={user.password}
            type='password'
            onChange={handleChange}
          />
        </div>
      </CardContent>
      <CardFooter className='flex flex-col gap-4'>
        <Button
          className='w-full'
          onClick={() => {
            handleSubmit();
          }}
        >
          Create account
        </Button>
        <p className='px-8 text-center text-sm text-muted-foreground'>
          Already have an account ?{" "}
          <Link
            href='/'
            className='underline underline-offset-4 hover:text-primary'
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default CreateAccount;
