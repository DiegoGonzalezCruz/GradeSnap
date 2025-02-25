import type { Access } from 'payload'

export const adminOrSelf: Access = ({ req: { user } }) => {
  // Allow users with a role of 'admin'
  if (user) {
    if (user.role === 'admin') {
      return true
    }
    return {
      id: {
        equals: user.id,
      },
    }
  }

  // allow any other users to update only oneself
  return false
}
