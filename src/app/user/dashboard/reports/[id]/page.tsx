"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, Sun, ArrowLeft, Printer, Download } from "lucide-react";
import axios from "axios";
import domains from "@/app/conf";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

type Report = {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  doctor: {
    firstName: string,
    lastName: string
  };
  reportType: "general" | "specialist" | "followUp" | "emergency";
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  doctorName: string;
};

// const mockReport: Report = {
//   id: "1",
//   patientName: "John Doe",
//   patientId: "HC 1234 5678 9012",
//   reportType: "General Checkup",
//   date: "2023-06-15",
//   status: "completed",
//   symptoms:
//     "Patient reported persistent cough and mild fever for the past week.",
//   diagnosis: "Upper respiratory tract infection, likely viral in origin.",
//   treatment:
//     "Prescribed rest, increased fluid intake, and over-the-counter cough suppressants. Advised to return if symptoms worsen or persist beyond 10 days.",
//   notes:
//     "Patient's overall health is good. Recommended a follow-up in 2 weeks if symptoms persist.",
//   doctorName: "Dr. Sarah Smith",
// };

export default function ViewSingleReportPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const params = useParams();

  const transformToReport = (input: any): Report => {
    return {
      id: input.id,
      patientName: input.title || "Unknown Patient", // Use title or default to 'Unknown Patient'
      patientId: input.userId,
      doctor: input.doctor,
      reportType: input.type || "Unknown Report", // Use type or default to 'Unknown Report'
      date: new Date(input.updatedAt).toString().split("G")[0], // Format date as 'YYYY-MM-DD'
      symptoms: input.symptoms || "No symptoms provided",
      diagnosis: input.diagnosis || "No diagnosis provided",
      treatment: input.treatmentplan || "No treatment plan provided",
      notes: "No additional notes provided", // Default as it's not in the input
      doctorName: "Unknown Doctor", // Default as it's not in the input
    };
  };

  const getData = () => {
    const token = window.localStorage.getItem("token");

    axios
      .get(`${domains.AUTH_HOST}/auth/v1/get/reports`, {
        headers: { Authorization: "Auth " + token },
      })
      .then((res) => {
        if (res.data.Success) {
          if (res.data.reports) {
            const all = res.data.reports;
            const theone = params.id;
            const found = all.find((m: any) => m.id == theone);
            console.log(found)
            if (found) {
              setReport(transformToReport(found));
            } else {
              window.location.href = "/user/dashboard/reports";
            }
            // transformToReport()
          }
          // setPatientName(res.data.user.firstName + " " + res.data.user.lastName)
        } else if (res.data.Error) {
          window.location.href = "/user/dashboard";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      if (user.user.role == "doctor") {
        window.location.href = "/doctor/dashboard";
      }
    }
    if (!loading && !user) {
      window.location.href = "/auth/login";
    }
  }, [user, loading]);

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

  //   useEffect(() => {
  //     // In a real application, you would fetch the report data based on the ID
  //     // For now, we'll just use the mock data
  //     setReport(mockReport);
  //   }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getStatusBadge = (status: Report["reportType"]) => {
    switch (status) {
      case "general":
        return <Badge className="bg-green-500">{status}</Badge>;
      case "specialist":
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case "followUp":
        return <Badge className="bg-blue-500">{status}</Badge>;
      case "emergency":
        return <Badge className="bg-red-500">{status}</Badge>;
    }
  };

  if (!report) {
    return <div>Loading...</div>;
  }

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
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/user/dashboard/reports">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <CardTitle
                  className={`text-2xl ${
                    darkMode ? "text-white" : "text-blue-600"
                  }`}
                >
                  Patient Report
                </CardTitle>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={()=>window.print()}>
                  <Printer className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={()=>window.print()}>
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2
                      className={`text-xl font-semibold ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {user && user.user.firstName + " " + user.user.lastName}
                    </h2>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Patient ID: {report.patientId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Report Date: {report.date}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Report Type : {getStatusBadge(report.reportType)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Symptoms
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {report.symptoms}
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Diagnosis
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {report.diagnosis}
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Treatment Plan
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {report.treatment}
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Additional Notes
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {report.notes}
                  </p>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Report created by: Dr. 
                    {report &&  report.doctor.firstName + " " + report.doctor.lastName}
                  </p>
                  {/* <Button variant="outline">Edit Report</Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
