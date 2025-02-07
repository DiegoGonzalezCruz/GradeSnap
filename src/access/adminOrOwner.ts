// access/adminOrOwner.ts

import { Access } from 'payload'

export const adminOrOwner: Access = ({ req: { user } }) => {
  if (!user) return false

  if (user.role === 'admin') {
    // Admin can read or manage all
    return true
  }

  // For non-admins, only allow if the "user" field of the order doc equals the logged-in user ID:
  return {
    user: {
      equals: user.id,
    },
  }
}
