"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge"
import {
  Moon,
  Sun,
  Key,
  FileText,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  //   DropdownMenuLabel,
  //   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import domains from "@/app/conf";

type Notification = {
  notificationId: string;
  type: "otp" | "document" | "appointment" | "alert";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

// const mockNotifications: Notification[] = [
//   {
//     id: "1",
//     type: "otp",
//     title: "OTP Request",
//     message:
//       "Dr. Sarah Smith has requested access to your health records. Please provide the OTP.",
//     timestamp: "2023-06-15T10:30:00Z",
//     read: false,
//   },
//   {
//     id: "2",
//     type: "document",
//     title: "New Document Available",
//     message:
//       "Your latest blood test results have been uploaded to your profile.",
//     timestamp: "2023-06-14T15:45:00Z",
//     read: true,
//   },
//   {
//     id: "3",
//     type: "appointment",
//     title: "Appointment Reminder",
//     message:
//       "You have an upcoming appointment with Dr. John Doe tomorrow at 2:00 PM.",
//     timestamp: "2023-06-13T09:00:00Z",
//     read: false,
//   },
//   {
//     id: "4",
//     type: "alert",
//     title: "Security Alert",
//     message:
//       "There was a failed login attempt to your account. Please review your security settings.",
//     timestamp: "2023-06-12T18:20:00Z",
//     read: false,
//   },
// ];

export default function NotificationsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  useEffect(() => {
    const checkNotifications = () => {
      if (typeof window !== "undefined") {
        //   const token = window.localStorage.getItem("token");

        axios
          .get(`${domains.AUTH_HOST}/auth/v1/get/notifications`, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.Success) {
              setNotifications(res.data.notifications);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    checkNotifications();
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

  // const markAsRead = (id: string) => {
  //   setNotifications(
  //     notifications.map((notif) =>
  //       notif.notificationId === id ? { ...notif, read: true } : notif
  //     )
  //   );
  // };

  const markAllAsRead = async () => {
    try {
      const read = axios.get(
        `${domains.AUTH_HOST}/auth/v1/read/notifications`,
        {
          withCredentials: true,
        }
      );
      console.log(read)
    } catch (err) {
      console.log(err);
    }

    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notif) => !notif.read);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "otp":
        return <Key className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      case "appointment":
        return <Calendar className="h-5 w-5" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5" />;
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
            <Link href="/user/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle
                className={`text-2xl ${
                  darkMode ? "text-white" : "text-blue-600"
                }`}
              >
                Notifications
              </CardTitle>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Filter</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilter("all")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("unread")}>
                      Unread
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" onClick={markAllAsRead}>
                  Mark All as Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications &&
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.notificationId}
                      className={`p-4 rounded-lg ${
                        notification.read
                          ? darkMode
                            ? "bg-gray-800"
                            : "bg-gray-100"
                          : darkMode
                          ? "bg-blue-900"
                          : "bg-blue-100"
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-full mr-4 ${
                            notification.type === "alert"
                              ? "bg-red-500"
                              : darkMode
                              ? "bg-blue-700"
                              : "bg-blue-500"
                          }`}
                        >
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p
                            className={`mt-1 ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {new Date(notification.createdAt).toString()}
                            </span>
                            {/* {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  markAsRead(notification.notificationId)
                                }
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark as Read
                              </Button>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {filteredNotifications &&
                  filteredNotifications.length === 0 && (
                    <p
                      className={`text-center ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      No notifications to display.
                    </p>
                  )}

                {!filteredNotifications && (
                  <p
                    className={`text-center ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No notifications to display.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

  
    </div>
  );
}
