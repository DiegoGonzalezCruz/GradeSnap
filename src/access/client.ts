import type { AccessArgs, ClientUser } from 'payload'

type isClient = (args: { user: ClientUser & AccessArgs }) => boolean

export const client: isClient = ({ user }) => {
  return Boolean(user?.role === 'client')
}
