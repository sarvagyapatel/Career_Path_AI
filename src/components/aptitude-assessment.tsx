'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import axios from 'axios'

// WebSocket URL (replace with your actual WebSocket server)
const WS_URL = 'ws://localhost:3000' // Update with actual WebSocket URL

interface Question {
  id: number
  question: string
  answer: string,
  type: 'mcq' | 'short_answer'
  options?: string[]
}

interface FormValues {
  answers: {
    [key: string]: string
  }
}

interface result {
  id: number
  question: string
  assessment: string
}

const formSchema = z.object({
  answers: z.record(z.string())
})

export function AptitudeAssessment(testType: string) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeRemaining, setTimeRemaining] = useState(3600) // 1 hour in seconds
  const [progress, setProgress] = useState(0)
  const wsRef = useRef<WebSocket | null>(null); // Store WebSocket instance
  const mountedRef = useRef(false); // Track if component has mounted

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {}
    },
  })

  useEffect(() => {
    if (mountedRef.current) return; // Prevent multiple runs
    mountedRef.current = true;
    const ws = new WebSocket(WS_URL)

    if (!wsRef.current) {
      let ind = 1;
      ws.onmessage = (event) => {
        const newQuestion = JSON.parse(event.data);
        const que: Question = {
          id: ind,
          question: newQuestion.question,
          answer: newQuestion.answer,
          type: newQuestion.type,
          options: newQuestion.options
        }
        ind++;
        setQuestions((prevQuestions) => [...prevQuestions, que])
        setProgress((prevProgress) => prevProgress + (100 / 20)) // Assuming 20 questions total
      }


      return () => {
        if (wsRef.current) {
          wsRef.current.close(); // Clean up WebSocket connection on unmount
          wsRef.current = null;
        }
      };
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  async function onSubmit(values: FormValues) {
    // Collect the answers with their ids and questions
    console.log(values)
    console.log(questions)
    const results: result[] = questions.map(question => ({
      id: question.id,
      question: question.question,
      // answer: values.answers[question.id] || ''
      assessment: (question.answer === values.answers[question.id]) ? ('correct') : ('incorrect')
    }))

    // Here you would typically send the results to your backend
    // console.log(results)

    const user = await axios.post('/api/get-user', {}, { withCredentials: true });
    const userId = user.data.user._id;
    const type = testType.testType.type;
    const updated = await axios.post('/api/update-questions', { userId, results, type });
    console.log(updated);
    toast({
      title: "Assessment submitted",
      description: "Your answers have been recorded.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Assessment</CardTitle>
          {/* <div className="flex justify-between items-center">
            <div>Time Remaining: {formatTime(timeRemaining)}</div>
            <Progress value={progress} className="w-1/2" />
          </div> */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {questions.map((question) => (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={`answers.${question.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>{question.question}</FormLabel>
                      <FormControl>
                        {question.type === 'mcq' ? (
                          <RadioGroup
                            key={question.id}
                            value={field.value || ''} // Controlled value
                            onValueChange={(value) => field.onChange(value)}
                            className="flex flex-col space-y-1"
                          >
                            {question.options?.map((option, idx) => (
                              <FormItem className="flex items-center space-x-3 space-y-0" key={idx}>
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        ) : (
                          <Input {...field} />
                        )}
                      </FormControl>
                      <FormMessage />
                      {/* <p className="text-sm text-muted-foreground mt-1">Hint: {question.hint}</p> */}
                    </FormItem>
                  )}
                />
              ))}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={timeRemaining === 0}>
            Submit Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
