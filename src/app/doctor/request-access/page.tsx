"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Moon, Sun, ArrowLeft, Loader2 } from "lucide-react";
import PatientIdInput from "@/components/PatientIdInput";
import axios from "axios";
import domains from "@/app/conf";
import { useAuth } from "@/context/AuthContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function RequestAccess() {
  const [darkMode, setDarkMode] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [otpDisplay, setOtpDisplay] = useState(false);
  const { user, loading } = useAuth();

  if (!loading && !user) {
    window.location.href = "/auth/doctor/login";
  }
  if (!loading && user) {
    if (user.user.role == "user") {
      window.location.href = "/user/dashboard";
    }
  }
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState("email");

  const handleChange = (e: any) => {
    if (e.target.value == "") {
      setType("email");
    } else if (e.target.value.startsWith("CCH")) {
      setType("id");
    }
    setPatientId(e.target.value);
  };
  const handlePatientIdChange = (value: string) => {
    if (value == "") {
      setType("email");
    } else if (value.startsWith("CCH")) {
      setType("id");
    }
    setPatientId(value);
  };

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setFetchLoading(true);

    const body = {
      patientId: type == "email" ? patientId : type == "id" ? "CCH-" + patientId : patientId,
      doctorId: user && user.user.id,
    };
    const token = window.localStorage.getItem("token");
    axios
      .post(`${domains.AUTH_HOST}/auth/v1/ask/doctor/access`, body, {
        headers: { Authorization: "Authorization " + token },
      })
      .then((res) => {
        setFetchLoading(false);
        if (res.data.Success) {
          setOtpDisplay(true);
          setSuccess(true);
          setTimeout(() => {
          setSuccess(false);
            
          }, 2500);
        }
        if (res.data.Error && res.data.msg) {
          setError(res.data.msg);
        }
      })
      .catch((err) => {
        setFetchLoading(false);
        console.log(err);
        setError(
          "Unable to request access at the moment. Please try again later"
        );
      });

    // Here you would typically make an API call to verify the OTP and grant access
    // For this example, we'll just simulate a successful request
    if (patientId) {
      console.log(patientId);
      setSuccess(true);
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "dark bg-gray-900"
          : "bg-gradient-to-r from-blue-100 to-teal-100"
      }`}
    >
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/image.png"
              alt="CareCloud Logo"
              width={60}
              height={60}
              className="mr-2"
            />
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-blue-600"
              }`}
            >
              CareCloud - Request Access
            </h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-blue-600"}>
                Request Patient Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fetchLoading && !otpDisplay ? (
                <Loader2 className="animate-spin w-20 h-20 flex justify-center text-center mx-auto" />
              ) : !otpDisplay && !fetchLoading ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="patientId"
                      className={darkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      Enter Patient ID or Email ID
                    </Label>
                    {type == "email" ? (
                      <Input
                        id="patientId"
                        type="text"
                        onChange={handleChange}
                        autoFocus
                        className={
                          darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white text-black"
                        }
                        placeholder="Enter patient ID or Email ID"
                      />
                    ) : (
                      <PatientIdInput
                        darkMode={darkMode}
                        onChange={handlePatientIdChange}
                      />
                    )}
                  </div>
                  {/* <div>
                  <Label htmlFor="otp" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>One-Time Password (OTP)</Label>
                  <Input 
                    id="otp"
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={darkMode ? 'bg-gray-700 text-white' : 'bg-white'}
                    placeholder="Enter OTP provided by patient"
                  />
                </div> */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert>
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>
                        Access request submitted successfully. Enter OTP
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full">
                    Submit Access Request
                  </Button>
                </form>
              ) : (
                otpDisplay && (
                  <div className=" justify-center">
                    <div className="flex justify-center">
                      <InputOTP maxLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                  
                    </div>
                    <br />
                    <div >
                    {success && (
                    <Alert>
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>
                        Access request submitted successfully. Enter OTP
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-center mt-4">
                    
                    <Button variant="default">
                      Submit Otp
                    </Button>
                  </div>
                    </div>
                    <div className="flex">
                      <Button
                        variant="link"
                        className={darkMode ? "text-blue-400" : "text-blue-600"}
                        onClick={()=> setOtpDisplay(false)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Change health Id or Email
                      </Button>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
          <div className="mt-4 text-center">
            <Link href="/doctor/dashboard">
              <Button
                variant="link"
                className={darkMode ? "text-blue-400" : "text-blue-600"}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <footer
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow mt-8 absolute bottom-0 w-full`}
      >
        <div className="container mx-auto px-4 py-4 text-center">
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            &copy; {new Date().getFullYear()} CareCloud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
