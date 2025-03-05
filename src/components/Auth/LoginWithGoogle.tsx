'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type LoginWithGoogleProps = {
  className?: string
  redirectTo?: string
}

const LoginWithGoogle = ({ className, redirectTo }: LoginWithGoogleProps) => {
  const btnSource = '/logos/btn_google_light_normal_ios.svg'
  const [redirectUrl, setRedirectUrl] = useState('/')

  useEffect(() => {
    // If a redirectTo prop is provided, use it; otherwise, use the current path.
    if (redirectTo) {
      setRedirectUrl(redirectTo)
    } else {
      setRedirectUrl(window.location.pathname)
    }
  }, [redirectTo])

  const redirectHandler = () => {
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectUrl)}`
  }

  return (
    <>
      <div className={`login-container ${className}`}>
        <div onClick={redirectHandler}>
          <div className="login-button">
            <Image
              src={btnSource}
              height={40}
              width={40}
              alt="Sign in with Google"
              className="image"
            />
            Access with Google
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-button {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          background-color: #f8f8fc;
          border: none;
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .login-button:hover {
          background-color: #e2e2f2;
        }

        .image {
          object-fit: contain;
        }
      `}</style>
    </>
  )
}

export default LoginWithGoogle
