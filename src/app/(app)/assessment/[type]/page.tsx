'use client'

import { AptitudeAssessment } from '@/components/aptitude-assessment'
import { useParams } from 'next/navigation';
import React from 'react'

function Page() {
  const params = useParams<{ username: string }>();
  // console.log(params)
  return (
    <AptitudeAssessment testType={params}/>
  )
}

export default Page