'use client'

import { useQuery } from '@tanstack/react-query'

interface UserDetails {
  id: string
  name: {
    givenName: string
    familyName: string
    fullName: string
  }
  emailAddress: string
  photoUrl: string
}

const fetchUserDetails = async (userId: string): Promise<UserDetails> => {
  const res = await fetch(`/api/classroom/users?userId=${userId}`)
  if (!res.ok) {
    throw new Error('Failed to fetch user details')
  }
  return res.json()
}

export function useUserDetails(userId: string) {
  return useQuery({
    queryKey: ['userDetails', userId],
    queryFn: () => fetchUserDetails(userId),
    enabled: !!userId,
  })
}
