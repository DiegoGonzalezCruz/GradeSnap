import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'

const useGoogleTokenRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const refreshGoogleToken = async () => {
      if (isRefreshing) {
        return
      }

      const accessToken = getCookie('google_access_token')

      if (!accessToken) {
        return
      }

      // Check if the token is expired or about to expire (5 minutes buffer)
      const expirationTime = getCookie('google_access_token_expiration') // You'll need to set this cookie when the token is initially set
      if (expirationTime && Date.now() + 5 * 60 * 1000 > Number(expirationTime)) {
        setIsRefreshing(true)
        try {
          const response = await fetch('/api/auth/google/refresh')
          if (response.ok) {
            console.log('Google access token refreshed successfully')
          } else {
            console.error('Failed to refresh Google access token')
          }
        } catch (error) {
          console.error('Error refreshing Google access token:', error)
        } finally {
          setIsRefreshing(false)
        }
      }
    }

    // Refresh the token on component mount and then every 10 minutes
    refreshGoogleToken()
    const intervalId = setInterval(refreshGoogleToken, 10 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [isRefreshing])

  return isRefreshing
}

export default useGoogleTokenRefresh
