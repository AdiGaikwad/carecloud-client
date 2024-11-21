"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Moon, Sun, Save, Loader2 } from "lucide-react";
import axios from "axios";
import domains from "@/app/conf";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function NewReportPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [access, setAccess] = useState(false);
  const [accessUser, setAccessUser] = useState<any>(false);
  const { user, loading } = useAuth();
  const [fetchErrors, setfetchErrors] = useState("");
  const [fetchLoading, setLoading] = useState(false);
  const {toast} = useToast()
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const userId = event.target[1].value;
    const type = event.target[3].value;
    const symptoms = event.target[4].value;
    const diagnosis = event.target[5].value;
    const treatmentplan = event.target[6].value;

    if (userId && type && symptoms && diagnosis && treatmentplan) {
      setfetchErrors("");
      setLoading(true);
      const body = {
        userId,
        type,
        symptoms,
        diagnosis,
        treatmentplan,
      };
      axios
        .post(`${domains.AUTH_HOST}/doctor/v1/create/report`, body, {
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          console.log(res);

          if (res.data.Success) {
            window.location.href = "/doctor/dashboard/patient/"
            // console.log(res);
            toast({
                variant: "success",
                title: "Report Created",
                description: "A new report has been created ",
               
              });

          }
          if (res.data.Error) {
            setfetchErrors("Access Expired or Revoked please request again  ");
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);

          setfetchErrors("Unable to save. Please try again ");
        });
    } else {
      setfetchErrors("Please enter all the fields ");
    }

    // Here you would typically send the form data to your backend API
    // console.log("Report submitted");
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
            <Link href="/doctor/dashboard/patient">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
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
                New Patient Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      value={
                        accessUser &&
                        accessUser.firstName + " " + accessUser.lastName
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={accessUser && accessUser.id}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select>
                    <SelectTrigger id="reportType">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Checkup</SelectItem>
                      <SelectItem value="specialist">
                        Specialist Consultation
                      </SelectItem>
                      <SelectItem value="followUp">Follow-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe the patient's symptoms"
                  />
                </div>

                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea id="diagnosis" placeholder="Enter your diagnosis" />
                </div>

                <div>
                  <Label htmlFor="treatment">Treatment Plan</Label>
                  <Textarea
                    id="treatment"
                    placeholder="Describe the treatment plan"
                  />
                </div>
                {fetchErrors && (
                  <p className="text-red-500 text-sm">{fetchErrors}</p>
                )}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="submit"
                    disabled={fetchLoading}
                    className={"w-full sm:w-auto"}
                  >
                    {fetchLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Report
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
