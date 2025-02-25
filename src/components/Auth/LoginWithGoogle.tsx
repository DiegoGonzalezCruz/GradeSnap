'use client'
import Image from 'next/image'
// import Link from 'next/link'
import { useEffect, useState } from 'react'
// import { Button } from '../ui/button'

const LoginWithGoogle = () => {
  const btnSource = '/logos/btn_google_light_normal_ios.svg'
  const [redirectUrl, setRedirectUrl] = useState('/')

  useEffect(() => {
    // Capture the current path to return after login
    setRedirectUrl(window.location.pathname)
  }, [])

  const redirectHandler = () => {
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectUrl)}`
  }

  return (
    <>
      <div className="login-container">
        <div onClick={redirectHandler}>
          <div className="login-button ">
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
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-button {
          display: flex;
          border: 1px solid red;
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
