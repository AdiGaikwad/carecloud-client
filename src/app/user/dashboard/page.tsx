"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Upload,
  Download,
  Moon,
  Sun,
  Bell,
  BellDot,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import HealthIdCard from "@/components/HealthIDCard";
import Logout from "@/components/Logout";
import axios from "axios";
import domains from "@/app/conf";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import AccessManagementPage from "../access-management/page";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'


export default function UserDashboard() {
  const [healthScore, setHealthScore] = useState(78);
  const [darkMode, setDarkMode] = useState(true);
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState<any>(false);
  const { toast } = useToast();
  if (!user && !loading) {
    window.location.href = "/auth/login";
  }

  useEffect(() => {
    if (!loading) {
      if (user.user.role != "user") {
        window.location.href = "/auth/login";
      }
    }
  }, [user, loading]);
  // const fetchUserData = async () => {
  //   const token = window.localStorage.getItem("token");
  //   const res = await axios.get(AUTH_DOMAIN + "/auth/v1/get/user/data", {
  //     headers: { "Authorization ": "Authorization " + token },
  //   });
  //   console.log(res);
  // };
  const healthData = [
    { month: 'Jan', cholesterol: 180, bloodPressure: 120 },
    { month: 'Feb', cholesterol: 200, bloodPressure: 125 },
    { month: 'Mar', cholesterol: 190, bloodPressure: 118 },
    { month: 'Apr', cholesterol: 185, bloodPressure: 122 },
    { month: 'May', cholesterol: 195, bloodPressure: 116 },
    { month: 'Jun', cholesterol: 188, bloodPressure: 120 },
  ]
  useEffect(() => {
    const checkRequest = () => {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("token");
        axios
          .get(`${domains.AUTH_HOST}/auth/v1/get/notifications`, {
            headers: { Authorization: "Authorization " + token },
          })
          .then((res) => {
            if (res.data.Success) {
              const nots = res.data.notifications;
              const unread = nots.find((n: any) => n.read == false);
              if (unread) {
                setNotifications(res.data.notifications);
                toast({
                  variant: "default",
                  title: "Notifications",
                  description: "You have unread notifications ",
                  action: (
                    <Link
                      href={`/user/notifications`}
                      className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
                    >
                      Notifications
                    </Link>
                  ),
                });
              }
              console.log(nots);
            }

            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const interval = setInterval(() => {
      checkRequest();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Check if dark mode preference is stored in localStorage
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
    // fetchUserData();

    setHealthScore(98);
  }, []);

  useEffect(() => {
    // Update localStorage when dark mode changes
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    console.log(user);
  }, [user]);

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
              CareCloud
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
            {/* <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button> */}
            {/* <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button> */}
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-4"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeIn} className="md:col-span-3 w-full">
            <Card>
              <CardHeader>
                <CardTitle
                  className={darkMode ? "text-white" : "text-blue-600"}
                >
                  Your Health ID Card
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <HealthIdCard
                  patientName={
                    user && `${user.user.firstName} ${user.user.lastName}`
                  }
                  healthId={
                    user &&
                    `${user.user.id.split("-")[0]} ${user.user.id
                      .split("-")[1]
                      .match(/.{1,4}/g)
                      .join(" ")}`
                  }
                  darkMode={darkMode}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle
                  className={darkMode ? "text-white" : "text-blue-600"}
                >
                  Welcome back,{" "}
                  {!loading ? (
                    user && user.user.firstName
                  ) : (
                    <Skeleton className="h-4 w-[100px]" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`mb-4 flex ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Your Health ID:
                  {!loading ? (
                    user && user.user.id
                  ) : (
                    <Skeleton className="h-6 w-[100px]" />
                  )}
                </span>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Profile Completion
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {healthScore}/100
                  </span>
                </div>
                <Progress value={healthScore} className="w-full" />
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
                  {/* <Link href={"/user/notifications"} > */}
                  <Link
                    href={"/user/notifications"}
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 rounded-md ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    {notifications ? (
                      <BellDot
                        className={`h-6 w-6 mb-2 animate-bounce ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    ) : (
                      <Bell
                        className={`h-6 w-6 mb-2 ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    )}
                    <span>Notifications</span>
                  </Link>
                  {/* </Link> */}
                  <Link
                    href={"/user/dashboard/reports"}
                    className={`flex flex-col items-center rounded-md justify-center h-24 ${
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

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex flex-col items-center justify-center h-24 ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-blue-50 hover:bg-blue-100"
                        }`}
                      >
                        {/* Alert Dialog */}

                        <Upload
                          className={`h-6 w-6 mb-2 ${
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <span>Upload Files</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Error !</AlertDialogTitle>
                        <AlertDialogDescription>
                          Only Doctor can perform this action. Please visit
                          nearest certified doctor
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Ok</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Link
                    href={"/user/dashboard/reports"}
                    className={`flex flex-col items-center justify-center h-24 p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    <Download
                      className={`h-6 w-6 mb-2 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span>Download Reports</span>
                  </Link>
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
                  Health Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={healthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="month"
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <Tooltip
                      contentStyle={
                        darkMode
                          ? { backgroundColor: "#1f2937", border: "none" }
                          : {}
                      }
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="cholesterol"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bloodPressure"
                      stroke="#14b8a6"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeIn} className="md:col-span-3">
            {/* <Card>
              <CardHeader>
                <CardTitle
                  className={darkMode ? "text-white" : "text-blue-600"}
                >
                  Access Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Shield
                        className={`h-6 w-6 ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Active Access Grants
                      </span>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-blue-600"
                      }`}
                    >
                      3
                    </span>
                  </div>
                
                  <Link
                    href="/user/access-management"
                    className="flex w-3/12  justify-between items-center"
                  >
                    <Button className=" justify-center mt-4 flex  items-center">
                      Manage Access
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card> */}
            <AccessManagementPage card={true} darkMode={darkMode} />
          </motion.div>
          <motion.div variants={fadeIn} className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle
                  className={darkMode ? "text-white" : "text-blue-600"}
                >
                  Recent Diagnoses and Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="diagnoses">
                  <TabsList
                    className={darkMode ? "bg-gray-700" : "bg-blue-100"}
                  >
                    <TabsTrigger
                      value="diagnoses"
                      className={
                        darkMode
                          ? "data-[state=active]:bg-gray-800"
                          : "data-[state=active]:bg-white"
                      }
                    >
                      Diagnoses
                    </TabsTrigger>
                    <TabsTrigger
                      value="files"
                      className={
                        darkMode
                          ? "data-[state=active]:bg-gray-800"
                          : "data-[state=active]:bg-white"
                      }
                    >
                      Medical Files
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="diagnoses">
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between">
                        <div>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-blue-600"
                            }`}
                          >
                            Annual Check-up
                          </p>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Dr. Sarah Smith - June 1, 2023
                          </p>
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
                          View Details
                        </Button>
                      </li>
                      <li className="flex items-center justify-between">
                        <div>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-blue-600"
                            }`}
                          >
                            Blood Test Results
                          </p>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Lab Corp - May 15, 2023
                          </p>
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
                          View Details
                        </Button>
                      </li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="files">
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
                                darkMode ? "text-white" : "text-blue-600"
                              }`}
                            >
                              Chest X-ray
                            </p>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Uploaded on June 5, 2023
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
                          View File
                        </Button>
                      </li>
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
                                darkMode ? "text-white" : "text-blue-600"
                              }`}
                            >
                              MRI Scan - Lower Back
                            </p>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Uploaded on May 20, 2023
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
                          View File
                        </Button>
                      </li>
                    </ul>
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
                  File Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    placeholder="Search files..."
                    className={`border rounded px-2 py-1 w-64 ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                  />
                  <Button
                    className={
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New File
                  </Button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className={darkMode ? "bg-gray-800" : "bg-blue-50"}>
                      <th
                        className={`text-left p-2 ${
                          darkMode ? "text-gray-300" : "text-blue-600"
                        }`}
                      >
                        File Name
                      </th>
                      <th
                        className={`text-left p-2 ${
                          darkMode ? "text-gray-300" : "text-blue-600"
                        }`}
                      >
                        Type
                      </th>
                      <th
                        className={`text-left p-2 ${
                          darkMode ? "text-gray-300" : "text-blue-600"
                        }`}
                      >
                        Date
                      </th>
                      <th
                        className={`text-left p-2 ${
                          darkMode ? "text-gray-300" : "text-blue-600"
                        }`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={
                        darkMode
                          ? "border-b border-gray-700"
                          : "border-b border-gray-200"
                      }
                    >
                      <td
                        className={`p-2 ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        Annual_Checkup_2023.pdf
                      </td>
                      <td
                        className={`p-2 ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        PDF
                      </td>
                      <td
                        className={`p-2 ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        June 1, 2023
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className={`p-2 ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        Chest_Xray_June2023.jpg
                      </td>
                      <td
                        className={`p-2 ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        Image
                      </td>
                      <td
                        className={`p-2 ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        June 5, 2023
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
            &copy; {new Date().getFullYear()} CareCloud. All rights reserved.
          </p>
          <Logout />
        </div>
      </footer>
    </div>
  );
}
