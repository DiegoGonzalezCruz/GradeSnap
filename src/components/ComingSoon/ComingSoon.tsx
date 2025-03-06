'use client'

import type React from 'react'

import { useState } from 'react'
import { Clock, Mail, Send } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import ImageComponent from '../Media/ImageComponent'

interface ComingSoonProps {
  title: string
  description: string
  image?: string
  estimatedRelease?: string
}

export function ComingSoon({
  title = 'New Feature',
  description = "We're working on something exciting. Stay tuned for updates!",
  image = '/placeholder.svg?height=200&width=400',
  estimatedRelease,
}: ComingSoonProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast("We'll let you know when this feature is available.")

    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="relative">
        <ImageComponent
          image={image || '/placeholder.svg'}
          alt={`${title} preview`}
          className="w-full object-cover h-48"
        />
        <Badge
          className="absolute top-4 right-4 bg-primary text-primary-foreground"
          variant="secondary"
        >
          <Clock className="w-3 h-3 mr-1" />
          Coming Soon
        </Badge>
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {estimatedRelease && (
          <p className="text-sm text-muted-foreground mb-4">
            Estimated release: {estimatedRelease}
          </p>
        )}
        {/* <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Get notified when this feature launches</p>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    Notify Me
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form> */}
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3">
        <p className="text-xs text-muted-foreground">We are working on it!</p>
      </CardFooter>
    </Card>
  )
}
