"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Moon, Sun, ArrowLeft } from "lucide-react";

export default function RequestAccess() {
  const [darkMode, setDarkMode] = useState(true);
  const [patientId, setPatientId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState("id");

  const handleChange = (e:any)=>{
    
      setPatientId(e.target.value)
  }
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

    // axios.post

    // Here you would typically make an API call to verify the OTP and grant access
    // For this example, we'll just simulate a successful request
    if (patientId) {
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="patientId"
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Patient ID
                  </Label>
                  {type == "email" ? <Input
                    id="patientId"
                    type="text"
                    value={patientId}
                    onChange={handleChange}
                    className={darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}
                    placeholder="Enter patient ID or Email ID"
                  /> : <div className="flex">
                    <Input
                    id="patientId"
                    type="text"
                    value={patientId}
                    onChange={handleChange}
                    className={darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}
                    placeholder="Enter patient ID or Email ID"
                  /> <Input
                  id="patientId"
                  type="text"
                  value={patientId}
                  onChange={handleChange}
                  className={darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}
                  placeholder="Enter patient ID or Email ID"
                /> 
                    </div>}
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
