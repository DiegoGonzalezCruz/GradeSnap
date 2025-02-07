import { FieldAccess } from 'payload'

export const readOnlyUnlessAdmin: FieldAccess = ({ req: { user } }) => {
  // Only allow updating if the user is logged in and is an admin.
  return Boolean(user && user.role === 'admin')
}
