/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from 'axios';
import { RecommendationsDisplayComponent } from './recommendations-display';

const WS_URL = 'ws://localhost:3000';

export function CareerPathRecommendation() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false); // Track if component has mounted

  useEffect(() => {
    if (mountedRef.current) return; // Prevent multiple runs
    mountedRef.current = true;

    axios
      .post('/api/get-user', {}, { withCredentials: true })
      .then((res) => {
        const userId = res.data.user._id;
        const recom:string[] = res.data.user.careerPathRecommendations;
        // console.log(recom)
        if(recom.length!==0){ setRecommendations(recom); setIsLoading(false);}
        if (recom.length===0) {
            axios.post('/api/generate-path', res.data.user).then((res)=>{
              console.log(res.data.response.choices[0].message.content)
            
              const data = {
                recommendations: res.data.response.choices[0].message.content,
                userId: userId
              }
              setRecommendations((prev)=>[...prev, res.data.response.choices[0].message.content]);
              axios.post('/api/update-career', data).then((res)=>{console.log(res.data)});
              setIsLoading(false);
            })
        }
      });
  }, []); // Only run once on mount

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [recommendations]);

  const handleRetry = () => {
    setRecommendations([]);
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      setRecommendations(['Retrying connection...', 'New career path data will appear here.']);
    }, 2000);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Career Path Recommendation</CardTitle>
        </CardHeader>
        <RecommendationsDisplayComponent
          isLoading={isLoading}
          error={error}
          recommendations={recommendations}
          onRetry={handleRetry}
        />
      </Card>
    </div>
  );
}
