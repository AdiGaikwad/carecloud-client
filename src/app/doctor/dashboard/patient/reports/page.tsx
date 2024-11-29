'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Moon, Sun, FileText, Search, Eye } from 'lucide-react'
import axios from 'axios'
import domains from '@/app/conf'
import { useAuth } from '@/context/AuthContext'

type Report = {
  id: string;
  firstName: string;
  lastName: string;
  patientId: string;
  date: string;
  reportType: 'general' | 'specialist' | 'followUp'  | 'emergency';
}

// const mockReports: Report[] = [
//   {
//     id: '1',
//     patientName: 'John Doe',
//     patientId: 'HC 1234 5678 9012',
//     reportType: 'General Checkup',
//     date: '2023-06-15',
//     status: 'completed'
//   },
//   {
//     id: '2',
//     patientName: 'Jane Smith',
//     patientId: 'HC 2345 6789 0123',
//     reportType: 'Specialist Consultation',
//     date: '2023-06-14',
//     status: 'pending'
//   },
//   {
//     id: '3',
//     patientName: 'Alice Johnson',
//     patientId: 'HC 3456 7890 1234',
//     reportType: 'Follow-up',
//     date: '2023-06-13',
//     status: 'reviewed'
//   },
//   {
//     id: '4',
//     patientName: 'Bob Brown',
//     patientId: 'HC 4567 8901 2345',
//     reportType: 'Emergency',
//     date: '2023-06-12',
//     status: 'completed'
//   },
//   {
//     id: '5',
//     patientName: 'Carol White',
//     patientId: 'HC 5678 9012 3456',
//     reportType: 'General Checkup',
//     date: '2023-06-11',
//     status: 'pending'
//   },
// ]

const transformDataArray = (inputArray) => {
    return inputArray.map((input) => ({
      id: input.id,
      patientName: input.title || "Unknown Patient", // Default to 'Unknown Patient' if title is null or undefined
      patientId: input.userId,
      reportType: input.type || "Unknown Report", // Default to 'Unknown Report' if type is null or undefined
      date: new Date(input.updatedAt).toISOString().split("T")[0], // Format date as 'YYYY-MM-DD'
    }));
  };

export default function ViewReportsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [reports, setReports] = useState<Report[]>()
  const [searchTerm, setSearchTerm] = useState('')
  const [access, setAccess] = useState(false);
  const [accessUser, setAccessUser] = useState<any>(false);
  const {user, loading} = useAuth()  
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
          if(res.data.user.reports){
            
              setReports(transformDataArray(res.data.user.reports))
          }
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
    const storedDarkMode = localStorage.getItem('darkMode')
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const filteredReports = reports && reports.filter(report => 
    accessUser && accessUser.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessUser && accessUser.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.id.toLowerCase().includes(searchTerm.toLowerCase())    ||
    report.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: Report['reportType']) => {
    switch (status) {
      case 'general':
        return <Badge className="bg-green-500">{status}</Badge>
      case 'specialist':
        return <Badge className="bg-yellow-500">{status}</Badge>
      case 'followUp':
        return <Badge className="bg-blue-500">{status}</Badge>
        case 'emergency':
            return <Badge className="bg-red-500">{status}</Badge>
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-r from-blue-100 to-teal-100'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/image.png" alt="CareCloud Logo" width={60} height={60} className="mr-2" />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-600'}`}>CareCloud</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
              <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-blue-600'}`}>View Patient Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Date</TableHead>
                    {/* <TableHead>Status</TableHead> */}
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports && filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{accessUser && accessUser.firstName + " " + accessUser.lastName}</TableCell>
                      <TableCell>{report.patientId}</TableCell>
                      <TableCell>{getStatusBadge(report.reportType)}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      {/* <TableCell>{getStatusBadge(report.status)}</TableCell> */}
                      <TableCell>
                       <Link href={`/doctor/dashboard/patient/reports/${report.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                       </Link> 
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredReports && filteredReports.length === 0 && (
                <p className={`text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No reports found matching your search.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

    </div>
  )
}