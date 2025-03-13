'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/auth/login')
  }, [router])

  return null
} 