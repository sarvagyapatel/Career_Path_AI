'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { BarChart, BookOpen, BriefcaseIcon, GraduationCap, TrendingUp, User, Brain, Map, FileQuestion } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function UserDashboard() {
  const [userData, setUserData] = useState({});

  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.post('/api/get-user', {}, { withCredentials: true })
      setUserData(response.data.user);
      console.log(response.data.user);
    }
    getUserData();
  }, [])

  const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    careerGoal: "Full Stack Developer",
    skillsProgress: 65,
    coursesCompleted: 8,
    totalCourses: 12
  }

  const recentActivities = [
    { type: 'course', name: 'Introduction to React', date: '2023-06-15' },
    { type: 'assessment', name: 'JavaScript Proficiency Test', date: '2023-06-10' },
    { type: 'skill', name: 'Completed Node.js Basics', date: '2023-06-05' },
  ]

  const recommendedCourses = [
    { name: 'Advanced React Patterns', duration: '4 weeks' },
    { name: 'GraphQL Fundamentals', duration: '2 weeks' },
    { name: 'Docker for Developers', duration: '3 weeks' },
  ]

  const generateQuestions = async (type: string) => {
    router.push(`assessment/${type}`)
  }

  const generateResult = async (type: string) => {
    router.push(`assessment-result/${type}`)
  }

  const generateCareerRecommendations = async () => {
    router.push('/career')
  }

  const generateMindMap = async () => {
    router.push('/mind-map')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {userData.fullname}!</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={userData.fullname} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">{userData.fullname}</p>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <Badge className="mt-2">{user.careerGoal}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={user.skillsProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {user.skillsProgress}% of skills mastered for {user.careerGoal}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold">{user.coursesCompleted}/{user.totalCourses}</p>
              <p className="text-sm text-muted-foreground mt-2">Courses completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="activities" >
        <ScrollArea className="w-auto whitespace-nowrap rounded-md border">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="activities" className="ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Recent Activities</TabsTrigger>
              <TabsTrigger value="aptitude">Aptitude Questions</TabsTrigger>
              <TabsTrigger value="skill">Skill Questions</TabsTrigger>
              <TabsTrigger value="career">Career Recommendations</TabsTrigger>
              {/* <TabsTrigger value="mindmap">Mind Map</TabsTrigger> */}
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest learning activities and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-4">
                      {activity.type === 'course' && <BookOpen className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'assessment' && <BarChart className="h-5 w-5 text-green-500" />}
                      {activity.type === 'skill' && <TrendingUp className="h-5 w-5 text-purple-500" />}
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Courses</CardTitle>
                <CardDescription>Courses tailored to your career goals</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {recommendedCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <GraduationCap className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <p className="text-sm text-muted-foreground">Duration: {course.duration}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Enroll</Button>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="aptitude" className=''>
            <Card>
              <CardHeader>
                <CardTitle>Aptitude Questions</CardTitle>
                <CardDescription>Test your aptitude with these questions</CardDescription>
              </CardHeader>
              <CardContent className='flex gap-4'>
                <Button onClick={() => generateQuestions('aptitude')} className="mb-4">
                  <Brain className="mr-2 h-4 w-4" />
                  Aptitude Questions
                </Button>
                <Button onClick={() => generateResult('aptitude')} className="mb-4">
                  <Brain className="mr-2 h-4 w-4" />
                  Aptitude Result
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="skill">
            <Card>
              <CardHeader >
                <CardTitle>Skill Questions</CardTitle>
                <CardDescription>Test your skills with these questions</CardDescription>
              </CardHeader>
              <CardContent className='flex gap-4'>
                <Button onClick={() => generateQuestions('skills')} className="mb-4">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Skill Questions
                </Button>
                <Button onClick={() => generateResult('skills')} className="mb-4">
                  <Brain className="mr-2 h-4 w-4" />
                  Skill Result
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="career">
            <Card>
              <CardHeader>
                <CardTitle>Career Recommendations</CardTitle>
                <CardDescription>Personalized career recommendations based on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateCareerRecommendations} className="mb-4">
                  <BriefcaseIcon className="mr-2 h-4 w-4" />
                  Career Recommendations
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mindmap">
            <Card>
              <CardHeader>
                <CardTitle>Career Mind Map</CardTitle>
                <CardDescription>Visualize your career path and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateMindMap} className="mb-4">
                  <Map className="mr-2 h-4 w-4" />
                  Mind Map
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Career Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BriefcaseIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{userData.ambitions}</p>
                  <p className="text-sm text-muted-foreground">Your current career goal</p>
                </div>
              </div>
              <Button variant="outline">Update Goal</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={85} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Your profile is 85% complete. Finish setting up to get more accurate recommendations.
              </p>
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}