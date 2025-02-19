import type { Access } from 'payload'

export const admin: Access = ({ req: { user } }) => {
  // Allow users with a role of 'admin'
  if (user) {
    if (user.role === 'admin') {
      return true
    }
  }

  // allow any other users to update only oneself
  return false
}
