import { useQuery } from '@tanstack/react-query'

const fetchMeUser = async () => {
  const response = await fetch('/api/users/me')
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

const useMeUser = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: fetchMeUser,
  })
  return {
    user: data?.user,
    error,
    isLoading,
    refetch,
  }
}

export default useMeUser
