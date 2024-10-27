'use client'

import { GenerateAssessmentResult } from '@/components/GenerateAssessmentResult';
import { useParams } from 'next/navigation';
import React from 'react'

function Page() {
  const params = useParams<{ username: string }>();
  // console.log(params)
  return (
    <GenerateAssessmentResult testType={params}/>
  )
}

export default Page