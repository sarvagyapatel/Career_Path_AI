'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, TrendingUp, MessageSquare, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LandingPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const userRegister = () => {
    router.push('/register')
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="#">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl md:text-2xl font-bold">NextStep.AI</span>
        </Link>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-14 left-0 right-0 bg-white md:bg-transparent flex-col md:flex-row gap-4 p-4 md:p-0 md:top-0 shadow md:shadow-none`}>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Navigate Your Career Path with Confidence
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Discover your potential, explore opportunities, and make informed decisions about your professional future.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-white text-primary hover:bg-gray-100" onClick={userRegister}>SignUp</Button>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-neutral-700">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="flex flex-col items-center p-6 space-y-4">
                  <Users className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold text-center">Personalized Guidance</h3>
                  <p className="text-center text-gray-500">
                    Receive tailored advice based on your skills, interests, and goals.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 space-y-4">
                  <TrendingUp className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold text-center">Career Trends</h3>
                  <p className="text-center text-gray-500">
                    Stay updated with the latest industry trends and job market insights.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 space-y-4">
                  <MessageSquare className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold text-center">Expert Consultations</h3>
                  <p className="text-center text-gray-500">
                    Connect with career experts for personalized advice and mentorship.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "Software Developer",
                  content: "CareerCompass helped me transition into tech. Their guidance was invaluable!",
                },
                {
                  name: "Sarah Lee",
                  role: "Marketing Specialist",
                  content: "I found my dream job thanks to the personalized advice from CareerCompass.",
                },
                {
                  name: "Michael Brown",
                  role: "Recent Graduate",
                  content: "As a fresh graduate, CareerCompass gave me the direction I needed to start my career.",
                },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-gray-500">{testimonial.content}</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Shape Your Future?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join CareerCompass today and take the first step towards a fulfilling career.
                </p>
              </div>
      
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2023 CareerCompass. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}