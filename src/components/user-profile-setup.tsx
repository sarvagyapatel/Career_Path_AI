'use client'

import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Upload, Save } from "lucide-react"
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  age: z.number().min(16, {
    message: "You must be at least 16 years old.",
  }).max(120, {
    message: "Age must be less than 120.",
  }),
  education: z.enum(["high_school", "bachelors", "masters", "phd", "other"], {
    required_error: "Please select your education level.",
  }),
  skills: z.string().min(1, {
    message: "Please enter at least one skill.",
  }),
  interests: z.string().min(1, {
    message: "Please enter your interests.",
  }),
  ambitions: z.string().min(1, {
    message: "Please enter your career ambitions.",
  }),
  experience: z.string().optional(),
})

export default function UserProfileSetup() {
  // const [resumeFile, setResumeFile] = useState<File | null>(null)
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined,
      education: undefined,
      skills: "",
      interests: "",
      ambitions: "",
      experience: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the form data and resumeFile to your backend
    const data = {
      ambitions: values.ambitions,
      education: values.education,
      interests: values.interests,
      skills: values.skills
    }

    const response = await axios.post('/api/profile-setup', data, { withCredentials: true });
    console.log(response);
    if(response.status==200){
      router.push('/dashboard');
    }
    toast({
      title: "Profile saved successfully!",
      description: "Your profile has been updated.",
    })
  }

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setResumeFile(e.target.files[0])
  //   }
  // }

  // const handleSaveAndContinue = () => {
  //   const currentValues = form.getValues()
  //   // Here you would save the current state to local storage or your backend
  //   localStorage.setItem('userProfileData', JSON.stringify(currentValues))
  //   toast({
  //     title: "Progress saved",
  //     description: "You can continue later.",
  //   })
  // }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Set Up Your Profile</CardTitle>
          <CardDescription>Tell us about yourself to get personalized career guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Education Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high_school">High School</SelectItem>
                        <SelectItem value="bachelors">Bachelor Degree</SelectItem>
                        <SelectItem value="masters">Master Degree</SelectItem>
                        <SelectItem value="phd">Ph.D.</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter your skills, separated by commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ambitions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Ambitions</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="space-y-2">
                <Label htmlFor="resume">Upload Resume (optional)</Label>
                <Input id="resume" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
              </div> */}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* <Button variant="outline" onClick={handleSaveAndContinue}>
            <Save className="w-4 h-4 mr-2" />
            Save and Continue Later
          </Button> */}
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Upload className="w-4 h-4 mr-2" />
            Submit Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}