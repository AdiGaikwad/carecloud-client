'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Link from 'next/link'

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [healthId, setHealthId] = useState('')

  const onSubmit = async (data) => {
    // Here you would typically send the data to your backend
    console.log(data)
    // For demo purposes, we'll just generate a random health ID
    setHealthId(`HC${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
  }

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
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full">Register</Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full">
              Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
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
              <Button onClick={() => setHealthId('')} className="w-full">Close</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}