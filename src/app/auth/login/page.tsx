"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-shad";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import domains from "@/app/conf";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } :any = useForm();
  const [fetchloading, setLoading] = useState(false);
  const [fetchErrors, setfetchErrors] = useState("");
  const { user, setUser, loading} = useAuth()


  useEffect(() => {
    if(!loading && user){
      if(user.user.role == "user"){
        window.location.href = "/user/dashboard"
      }
  
    }
    }, [user, loading])

  const onSubmit = async (body: any) => {
    setLoading(true);

    axios
      .post(`${domains.AUTH_HOST}/auth/v1/login`, body)
      .then((res) => {
        console.log(res.data);

        if (res.data.Error) {
          setfetchErrors(res.data.msg);
        }
        if(res.data.token){
          axios
         .get(`${domains.AUTH_HOST}/auth/v1/get/user/data`, {headers: {"Authorization": "Bearer " + res.data.token},
        withCredentials: true
        },
         )
         .then((rep)=>{
          if(rep.data.Error){
            setUser(false)
          }
          else{

            setUser(rep.data); // Set user data from API
          }
         }).catch((err)=>{
          console.log(err)
          window.location.reload()
         })

          setTimeout(() => {
            
            window.location.href = "/user/dashboard"
          }, 1000);
          document.cookie = `token=${res.data.token}; path=/`
          window.localStorage.setItem("token", res.data.token)
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-teal-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Log in to CareCloud</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Health ID</Label>
                <Input
                  id="email"
                  placeholder="stephen@strange.com"
                  {...register("email", {
                    required: "Email or Health ID is required",
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {fetchErrors && (
                <p className="text-red-500 text-sm">{fetchErrors}</p>
              )}
              <Button type="submit" className="w-full">
              {fetchloading ? <Loader className="animate-spin" /> : "Login" }  
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center w-full">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-500 hover:underline"
              >
                Register
              </Link>
            </p>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
