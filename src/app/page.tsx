'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, FileText, Lock, Users, ShieldCheck, Activity, Calendar } from 'lucide-react'

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-teal-100">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            {/* <Image src="/placeholder.svg" alt="CareCloud Logo" width={40} height={40} className="mr-2" /> */}
            <h1 className="text-3xl font-bold text-blue-600">CareCloud</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-x-4"
          >
            <Link href="/auth/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.section className="text-center mb-16" {...fadeIn}>
          <h2 className="text-5xl font-bold mb-4">Your Health, Connected and Secured</h2>
          <p className="text-xl mb-8">Experience a new era of healthcare management with CareCloud. Securely store, access, and share your medical records anytime, anywhere.</p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8">
              Start Your Health Journey <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.section>

        <motion.section 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeIn}>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <FileText size={48} className="text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Unified Health Records</h3>
                <p>Access your complete medical history, including X-rays, MRI scans, and lab results, all in one secure location.</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeIn}>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Lock size={48} className="text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Data Sharing</h3>
                <p>Share your health information with doctors securely using your unique health ID, ensuring privacy and control.</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeIn}>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Users size={48} className="text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connect with Providers</h3>
                <p>Easily communicate with your healthcare providers, manage appointments, and receive timely updates.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        <motion.section className="mb-16" {...fadeIn}>
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose CareCloud?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <ShieldCheck size={24} className="text-blue-500 mr-2" />
                  <h3 className="text-xl font-semibold">Enhanced Data Security</h3>
                </div>
                <p>Your health data is protected with state-of-the-art encryption and security measures, ensuring your privacy is never compromised.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Activity size={24} className="text-blue-500 mr-2" />
                  <h3 className="text-xl font-semibold">Real-time Health Insights</h3>
                </div>
                <p>Gain valuable insights into your health trends with our advanced analytics, helping you make informed decisions about your wellbeing.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Calendar size={24} className="text-blue-500 mr-2" />
                  <h3 className="text-xl font-semibold">Streamlined Appointments</h3>
                </div>
                <p>Book and manage your medical appointments effortlessly, with automatic reminders to keep you on track with your health schedule.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users size={24} className="text-blue-500 mr-2" />
                  <h3 className="text-xl font-semibold">Family Health Management</h3>
                </div>
                <p>Easily manage health records for your entire family in one place, ensuring everyone's health information is up-to-date and accessible.</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* <motion.section className="mb-16" {...fadeIn}>
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <p className="italic mb-4">"CareCloud has revolutionized how I manage my health. Having all my medical records in one place has made doctor visits so much more efficient!"</p>
                <p className="font-semibold">- Sarah J., CareCloud User</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="italic mb-4">"As a healthcare provider, CareCloud has streamlined our patient care process. The secure data sharing feature is a game-changer for coordinated care."</p>
                <p className="font-semibold">- Dr. Michael T., Family Physician</p>
              </CardContent>
            </Card>
          </div>
        </motion.section> */}

        <motion.section className="mb-16" {...fadeIn}>
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How secure is my health data on CareCloud?</AccordionTrigger>
              <AccordionContent>
                CareCloud employs bank-level encryption and follows strict HIPAA guidelines to ensure your health data is always protected. We use advanced security measures to safeguard your information from unauthorized access.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I share my health records with my doctors?</AccordionTrigger>
              <AccordionContent>
                Yes, CareCloud allows you to securely share your health records with healthcare providers of your choice. You have full control over who can access your information and for how long.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is CareCloud compatible with my existing health devices?</AccordionTrigger>
              <AccordionContent>
                CareCloud is designed to integrate with a wide range of health monitoring devices and apps. We continually expand our compatibility to ensure you can sync data from your favorite health tools.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.section>

        <motion.section className="text-center" {...fadeIn}>
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your health data?</h2>
          <p className="text-xl mb-8">Join CareCloud today and experience a new way of managing your health information.</p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8">
              Create Your Free Account
            </Button>
          </Link>
        </motion.section>
      </main>

      <footer className="bg-blue-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            {/* <Image src="/placeholder.svg" alt="CareCloud Logo" width={40} height={40} className="mr-2" /> */}
            <span className="text-2xl font-bold">CareCloud</span>
          </div>
          <p>&copy; 2023 CareCloud. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}