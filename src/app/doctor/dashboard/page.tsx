"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logout from "@/components/Logout";
import domains from "@/app/conf";
import axios from "axios";

export default function DoctorDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [access, setAccess] = useState<any>(false);
  //   const [searchQuery, setSearchQuery] = useState("");
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/auth/doctor/login";
    }
    if (!loading && user) {
      if (user.user.role == "user") {
        window.location.href = "/user/dashboard";
      }
    }
  }, [user, loading]);

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
          setAccess(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkAccess();
  }, []);

  const greet = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning !";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon !";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "Good Evening !";
    }
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
              width={60}
              height={60}
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
            {/* <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button> */}

            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Doctor" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                <span className={darkMode ? "text-white" : "text-blue-600"}>
                  {/* Search Patients */}
                  <h1>{greet()}</h1>
                </span>
              </CardHeader>
              <CardContent>
                <span>
                  <h1>
                    Dr. {user && user.user.firstName}{" "}
                    {user && user.user.lastName}
                  </h1>
                </span>
                {/* <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter patient name or ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={darkMode ? "bg-gray-700 text-white" : "bg-white"}
                  />
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div> */}
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
                <div className="space-y-2">
                  {access ?  <Link href="/doctor/dashboard/patient">
                    <Button className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Access Patient {access && access.userId}
                    </Button>
                  </Link>  : <Link href="/doctor/request-access">
                    <Button className="w-full justify-start">
                      <Lock className="h-4 w-4 mr-2" />
                      Request Patient Access
                    </Button>
                  </Link>}
                  {/* <Button className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button> */}
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
                  Recently Accessed Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    You haven&apos;t accessed any patient records recently. Use
                    the search function above to find a patient or request
                    access to their records.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <footer
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow mt-8 absolute bottom-0 w-full`}
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
