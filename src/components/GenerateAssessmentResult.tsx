/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from 'axios';
import { RecommendationsDisplayComponent } from './recommendations-display';

const WS_URL = 'ws://localhost:3000';

export function GenerateAssessmentResult(testType:string) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null); // Store WebSocket instance
  const mountedRef = useRef(false); // Track if component has mounted

  useEffect(() => {
    if (mountedRef.current) return; // Prevent multiple runs
    mountedRef.current = true;

    axios
      .post('/api/get-user', {}, { withCredentials: true })
      .then((res) => {
        // console.log(res.data.user);
        let recom:string[] = [];
        if(testType.testType.type==="aptitude") recom=res.data.user.aptitudeEvaluation;
        if(testType.testType.type==="skills") recom=res.data.user.skillEvaluation;
        // console.log(recom)
        if(recom){ setRecommendations(recom); setIsLoading(false);}
        // Initialize WebSocket only once
        if (!wsRef.current && recom.length===0) {
          const ws = new WebSocket(WS_URL);
          wsRef.current = ws;

          ws.onopen = () => {
            if(testType.testType.type==="aptitude") ws.send(JSON.stringify(res.data.user.aptitudeQuestions));
            if(testType.testType.type==="skills") ws.send(JSON.stringify(res.data.user.skillQuestions));
            setIsLoading(false);
            setError(null);
          };

          ws.onmessage = (event) => {
            recom = [...recom, event.data];
            setRecommendations((prev) => [...prev, event.data]);
          };

          ws.onerror = () => {
            setError('An error occurred with the WebSocket connection');
            setIsLoading(false);
          };

          ws.onclose = () => {
            const data = {
              userId: res.data.user._id,
              recommendations: recom,
              type: testType.testType.type
            }
            axios.post('/api/update-result', data).then((res)=>{console.log(res.data)});
            setIsLoading(false);
          };
        }
      });

    return () => {
      if (wsRef.current) {
        wsRef.current.close(); // Clean up WebSocket connection on unmount
        wsRef.current = null;
      }
    };
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
          <CardTitle className="text-2xl font-bold">Aptitude test evaluation</CardTitle>
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
