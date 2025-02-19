// import { featuredImage } from '@/fields/featuredImage'
import type { CollectionConfig, Payload, Where } from 'payload'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { anyone } from '@/access/anyone'
import { admin } from '@/access/admin'
import { adminOrSelf } from '@/access/adminOrSelf'
import { readOnlyUnlessAdmin } from '@/access/readOnlyUnlessAdmin'

const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

interface GoogleStrategyParams {
  headers: Headers
  payload: Payload
}

interface JWTDecoded {
  email: string
  id: string
  collection: string
}

interface StrategyResult {
  user: any | null
  responseHeaders?: Headers
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: adminOrSelf,
    create: admin,
    delete: admin,
    update: adminOrSelf,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    verify: true,

    cookies: {
      secure: process.env.PAYLOAD_ENV !== 'development',
      sameSite: process.env.PAYLOAD_ENV !== 'testing' ? 'None' : 'Lax',
    },
    // disableLocalStrategy: true,
    strategies: [
      {
        name: 'google', // the strategy name we'll use in the login URL
        authenticate: async ({ payload, headers }) => {
          // Retrieve the JWT from cookies
          const cookieHeader = headers.get('cookie')
          if (!cookieHeader) return { user: null }

          const cookies = Object.fromEntries(
            cookieHeader.split('; ').map((cookie) => {
              const [key, ...v] = cookie.split('=')
              return [key, decodeURIComponent(v.join('='))]
            }),
          )

          const token = cookies[`payload-token`]
          if (!token) return { user: null }

          try {
            // Verify the JWT
            const decoded = jwt.verify(token, process.env.PAYLOAD_SECRET) as JWTDecoded

            // Ensure the JWT is intended for the users collection
            if (decoded.collection !== 'users') {
              return { user: null }
            }

            // Retrieve the user from Payload CMS
            const users = await payload.find({
              collection: 'users',
              where: {
                id: { equals: decoded.id },
              },
              limit: 1,
            })

            if (users.docs.length === 0) {
              console.error('User not found in Payload CMS')
              return { user: null }
            }

            const userDoc = users.docs[0]
            if (!userDoc) return { user: null }

            // Check if the user has an id
            if (!userDoc.id) {
              console.error('User document does not have an id')
              return { user: null }
            }

            // Return the user with a guaranteed id
            return {
              user: {
                ...userDoc,
                collection: 'users',
                id: userDoc.id, // Now guaranteed to be a string or number
              },
            }
          } catch (error) {
            console.log('JWT Verification Error:', error)
            return { user: null }
          }
        },
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
      label: 'Email',
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
    {
      name: 'pictureURL',
      label: 'Image',
      type: 'text',
    },
    {
      name: 'googleSub',
      label: 'Google Sub',
      type: 'text',
      unique: true,
      saveToJWT: true,
      admin: { readOnly: true },
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      saveToJWT: true,
      access: {
        // update: admin,
      },
      admin: { position: 'sidebar' },
      defaultValue: 'client',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'coordinator', label: 'Coordinator ' },
        { value: 'instructor', label: 'Instructor' },
        { value: 'client', label: 'Client' },
      ],
    },
    {
      saveToJWT: true,
      name: 'status',
      label: 'Status',
      type: 'select',
      access: {
        // update: admin,
      },
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
  ],
}
