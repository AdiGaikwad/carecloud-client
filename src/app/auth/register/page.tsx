"use client";

import { useState } from "react";
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
import axios from "axios";
import { Loader } from "lucide-react";
import domains from "@/app/conf";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [healthId, setHealthId] = useState("");
  const [fetchErrors, setfetchErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (body: any) => {
    setLoading(true);
    axios
      .post(`${domains.AUTH_HOST}/auth/v1/register`, body)
      .then((res) => {
        console.log(res.data);
        setHealthId(res.data.healthId);
        if (res.data.Error) {
          setfetchErrors(res.data.msg);
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
            <CardTitle>Register for CareCloud</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             
              <div className="space-y-2">
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="name"
                  placeholder="Stephen"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Last Name</Label>
                <Input
                  id="name"
                  placeholder="Strange"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="stephen@strange.com"

                  {...register("email", { required: "Email is required" })}
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
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
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
              {loading ? <Loader className="animate-spin" /> : "Register" }  
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-500 hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
     
      {healthId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
        >
          
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Registration Successful!</CardTitle>
              <CardDescription>Your unique health ID is:</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-center">{healthId}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setHealthId("")} className="w-full">
                Close
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
