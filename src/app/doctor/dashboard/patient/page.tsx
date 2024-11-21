"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Edit, Search, Moon, Sun, Plus, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logout from "@/components/Logout";
import axios from "axios";
import domains from "@/app/conf";
import Link from "next/link";
import Timer from "@/components/Timer";

export default function DoctorDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [timer, setTimer] = useState<any>(false)
  const [access, setAccess] = useState<any>(false);
  const [accessUser, setAccessUser] = useState<any>(false);
  const { user, loading } = useAuth();
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  const checkAccess = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get(`${domains.AUTH_HOST}/doctor/v1/check/access`, {
        headers: { Authorization: "Auth " + token },
      })
      .then((res) => {
        if (res.data.Success) {
          setAccess(res.data.access);
        } else if (res.data.Error) {
          window.location.href = "/doctor/dashboard";
          setAccess(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getData = () => {

    const token = window.localStorage.getItem("token");

    axios
      .get(`${domains.AUTH_HOST}/doctor/v1/get/access/data`, {
        headers: { Authorization: "Auth " + token },
      })
      .then((res) => {
        console.log(res);
        if (res.data.Success) {
          setAccessUser(res.data.user);
          // setPatientName(res.data.user.firstName + " " + res.data.user.lastName)
        } else if (res.data.Error) {
          setAccessUser(false);
          window.location.href = "/doctor/dashboard";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    getData();
  }, [access]);

  useEffect(() => {
    if (!loading && user) {
      if (user.user.role == "user") {
        window.location.href = "/user/dashboard";
      }
    }
    if (!loading && !user) {
      window.location.href = "/auth/doctor/login";
    }
  }, [user, loading]);

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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
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
              width={80}
              height={80}
              className="mr-2"
            />
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-blue-600"
              }`}
            >
              CareCloud - Doctor Dashboard
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Doctor" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeIn} className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle
                  className={darkMode ? "text-white" : "text-blue-600"}
                >
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="patientName"
                      className={darkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      Patient Name
                    </Label>
                    <Input
                      disabled
                      id="patientName"
                      value={
                        accessUser &&
                        accessUser.firstName + " " + accessUser.lastName
                      }
                      className={
                        darkMode ? "bg-gray-700 text-white" : "bg-white"
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="patientAge"
                      className={darkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      Age
                    </Label>
                    <Input
                      disabled
                      id="patientAge"
                      type="number"
                      value={
                        accessUser && accessUser.age ? accessUser.age : "NA"
                      }
                      className={
                        darkMode ? "bg-gray-700 text-white" : "bg-white"
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="patientGender"
                      className={darkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      Gender
                    </Label>
                    <Input
                      disabled
                      id="patientGender"
                      value={
                        accessUser && accessUser.gender
                          ? accessUser.gender
                          : "NA"
                      }
                      className={
                        darkMode ? "bg-gray-700 text-white" : "bg-white"
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="patientId"
                      className={darkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      Patient ID
                    </Label>
                    <Input
                      disabled
                      id="patientId"
                      value={accessUser && accessUser.id}
                      readOnly
                      className={`${
                        darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
                      } cursor-not-allowed`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle
                  className={darkMode ? "text-white" : "text-blue-600"}
                >
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                <Link
                    href={"/doctor/dashboard/patient/reports"}
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 rounded-md ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    <FileText
                      className={`h-6 w-6 mb-2 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span>View Reports</span>
                  </Link>
                  <Button
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    <Upload
                      className={`h-6 w-6 mb-2 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span>Upload Files</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                   
                   <Timer targetDateTime={access && access.expires} />
                    {/* <span>Edit Reports</span> */}
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    <Search
                      className={`h-6 w-6 mb-2 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span>Search History</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle
                  className={darkMode ? "text-white" : "text-blue-600"}
                >
                  Patient Files and Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="files">
                  <TabsList
                    className={darkMode ? "bg-gray-700" : "bg-blue-100"}
                  >
                    <TabsTrigger
                      value="files"
                      className={
                        darkMode
                          ? "data-[state=active]:bg-gray-800"
                          : "data-[state=active]:bg-white"
                      }
                    >
                      Files
                    </TabsTrigger>
                    <TabsTrigger
                      value="reports"
                      className={
                        darkMode
                          ? "data-[state=active]:bg-gray-800"
                          : "data-[state=active]:bg-white"
                      }
                    >
                      Reports
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="files">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3
                          className={`text-lg font-semibold ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Uploaded Files
                        </h3>
                        <Button>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New File
                        </Button>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                          <div className="flex items-center">
                            <FileText
                              className={`h-5 w-5 mr-2 ${
                                darkMode ? "text-blue-400" : "text-blue-500"
                              }`}
                            />
                            <span
                              className={
                                darkMode ? "text-white" : "text-gray-800"
                              }
                            >
                              Chest_Xray_June2023.jpg
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </li>
                        <li className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                          <div className="flex items-center">
                            <FileText
                              className={`h-5 w-5 mr-2 ${
                                darkMode ? "text-blue-400" : "text-blue-500"
                              }`}
                            />
                            <span
                              className={
                                darkMode ? "text-white" : "text-gray-800"
                              }
                            >
                              Blood_Test_Results_May2023.pdf
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="reports">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3
                          className={`text-lg font-semibold ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Patient Latest Report
                        </h3>
                        <Link href={"/doctor/dashboard/patient/new-report"}>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Report
                          </Button>
                        </Link>
                      </div>
                      <div>
                        <br />
                        <span className="flex">
                          Patient Name:{" "}
                          {accessUser &&
                            accessUser.firstName + " " + accessUser.lastName}
                        </span>
                        <span className="flex">
                          Report Type:{" "}
                          {accessUser &&
                            accessUser.reports[0].type.toUpperCase()}
                        </span>

                        <span className="flex">
                        Symptoms:{" "}
                          {accessUser &&
                            accessUser.reports[0].symptoms}
                        </span>

                        <span className="flex">
                        Diagnosis:{" "}
                          {accessUser &&
                            accessUser.reports[0].diagnosis}
                        </span>
                        <span className="flex">
                        Treatment Plan:{" "}
                          {accessUser &&
                            accessUser.reports[0].treatmentplan}
                        </span>
                      
                        {/* <Label htmlFor="reportContent" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Latest Report</Label> */}
                        {/* <Textarea 
                          id="reportContent" 
                          value={reportContent} 
                          onChange={(e) => setReportContent(e.target.value)} 
                          rows={6}
                          className={darkMode ? 'bg-gray-700 text-white' : 'bg-white'}
                        /> */}
                      </div>
                      {/* <Button>Save Report</Button> */}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle
                  className={darkMode ? "text-white" : "text-blue-600"}
                >
                  Recent Patient Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText
                        className={`h-5 w-5 mr-2 ${
                          darkMode ? "text-blue-400" : "text-blue-500"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Blood Test Results Uploaded
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Uploaded on June 15, 2023
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                      }
                    >
                      View
                    </Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Edit
                        className={`h-5 w-5 mr-2 ${
                          darkMode ? "text-blue-400" : "text-blue-500"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Medication List Updated
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Updated on June 10, 2023
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                      }
                    >
                      View
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <footer
        className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow mt-8`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            &copy; 2023 CareCloud. All rights reserved.
          </p>
          <Logout />
        </div>
      </footer>
    </div>
  );
}
