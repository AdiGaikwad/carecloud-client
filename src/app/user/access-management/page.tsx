"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Moon, Sun, Shield, X, User } from "lucide-react";
import axios from "axios";
import domains from "@/app/conf";

type AccessRequest = {
  id: string;
  doctorName: string;
  hospital: string;
  requestDate: string;
  accessid: string;
  status: "active" | "pending" | "revoked" | "expired";
};

// const mockAccessRequests: AccessRequest[] = [
//   {
//     id: "1",
//     doctorName: "Dr. Sarah Smith",
//     hospital: "Central Hospital",
//     requestDate: "2023-06-15",
//     status: "active",
//   },
//   {
//     id: "2",
//     doctorName: "Dr. John Doe",
//     hospital: "City Medical Center",
//     requestDate: "2023-06-14",
//     status: "pending",
//   },
//   {
//     id: "3",
//     doctorName: "Dr. Emily Brown",
//     hospital: "County General Hospital",
//     requestDate: "2023-06-13",
//     status: "active",
//   },
//   {
//     id: "4",
//     doctorName: "Dr. Michael Johnson",
//     hospital: "St. Mary's Hospital",
//     requestDate: "2023-06-12",
//     status: "revoked",
//   },
//   {
//     id: "5",
//     doctorName: "Dr. Lisa Wang",
//     hospital: "University Medical Center",
//     requestDate: "2023-06-11",
//     status: "pending",
//   },
// ];

function transformAccessData(data: any) {
  const currentTimestamp = new Date().getTime(); // Current timestamp in milliseconds

  return data.map((item, index) => {
    const status =
      new Date(item.expires).getTime() > currentTimestamp
        ? "active"
        : "expired";

    return {
      id: (index + 1).toString(), // Convert index to a string for `id`
      accessid: item.accessid,
      doctorName: `Dr. ${item.doctor.firstName} ${item.doctor.lastName}`, // Extract firstName and lastName from the doctor object
      hospital: "University Medical Center", // Placeholder for hospital name
      requestDate: new Date(item.createdAt).toString().split("G")[0], // Format request date as YYYY-MM-DD
      status, // Calculate status based on `expires`
    };
  });
}

function AccessCard({ accessRequests, darkMode }: any) {
  const activeGrants =
    accessRequests &&
    accessRequests.filter((req) => req.status === "active").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:col-span-3"
    >
      <Card>
        <CardHeader>
          <CardTitle className={darkMode ? "text-white" : "text-blue-600"}>
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
                {activeGrants}
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
      </Card>
    </motion.div>
  );
}

const handleRevoke = (id: string) => {
  console.log(id);
  const body = {
    id,
  };
  axios
    .post(`${domains.AUTH_HOST}/auth/v1/revoke/access`, body, {
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default function AccessManagementPage(props) {
  const [darkMode, setDarkMode] = useState(true);
  const [card, isCard] = useState(props.card);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>();
  useEffect(() => {
    axios
      .get(`${domains.AUTH_HOST}/auth/v1/check/access`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.data.Success) {
          const transformed = transformAccessData(res.data.access);
          console.log(transformed);
          setAccessRequests(transformed);
        }
        if (res.data.Error) {
          setAccessRequests([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
    if (typeof window !== "undefined") {
      if (window.location.href == "/user/dashboard") {
        isCard(true);
      }
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

  const handleStatusChange = (id: string, newStatus: "active" | "revoked") => {
    setAccessRequests(
      accessRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  const getStatusBadge = (status: AccessRequest["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "revoked":
        return <Badge className="bg-red-500">Revoked</Badge>;
      case "expired":
        return <Badge className="bg-red-500">Expired</Badge>;
    }
  };

  return (
    <div>
      {card ? (
        <AccessCard accessRequests={accessRequests} darkMode={props.darkMode} />
      ) : (
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
                {/* <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle
                    className={`text-2xl ${
                      darkMode ? "text-white" : "text-blue-600"
                    }`}
                  >
                    Access Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
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
                        {accessRequests &&
                          accessRequests.filter(
                            (req) => req.status === "active"
                          ).length}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <User
                          className={`h-6 w-6 ${
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Expired Access Grants
                        </span>
                      </div>
                      <span
                        className={`text-2xl font-bold ${
                          darkMode ? "text-white" : "text-blue-600"
                        }`}
                      >
                        {accessRequests &&
                          accessRequests.filter(
                            (req) => req.status === "expired"
                          ).length}
                      </span>
                    </div>
                    {/* <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Users className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pending Access Requests</span>
                  </div>
                  <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-600'}`}>
                    {accessRequests.filter(req => req.status === 'pending').length}
                  </span>
                </div> */}
                    {accessRequests ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Doctor Name</TableHead>
                            {/* <TableHead>Hospital</TableHead> */}
                            <TableHead>Request Date and Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {accessRequests ? (
                            accessRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">
                                  {request.doctorName}
                                </TableCell>
                                {/* <TableCell>{request.hospital}</TableCell> */}
                                <TableCell>{request.requestDate}</TableCell>
                                <TableCell>
                                  {getStatusBadge(request.status)}
                                </TableCell>
                                <TableCell>
                                  {request.status === "pending" && (
                                    <>
                                      {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(request.id, "active")
                                }
                                className="mr-2"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button> */}
                                      {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(request.id, "revoked")
                                }
                              >
                                <X className="h-4 w-4 mr-1" />
                                Deny
                              </Button> */}
                                    </>
                                  )}
                                  {request.status === "active" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        handleStatusChange(
                                          request.id,
                                          "revoked"
                                        );
                                        handleRevoke(request.accessid);
                                      }}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Revoke
                                    </Button>
                                  )}
                                  {/* {request.status === "revoked" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(request.id, "active")
                              }
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Reactivate
                            </Button>
                          )} */}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <div className="flex">
                              There are no access requests
                            </div>
                          )}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex">There are no access requests</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      )}
    </div>
  );
}
