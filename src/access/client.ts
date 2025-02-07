import type { AccessArgs, ClientUser } from 'payload'
import type { User } from '@/payload-types'

type isClient = (args: { user: ClientUser & AccessArgs }) => boolean

export const client: isClient = ({ user }) => {
  return Boolean(user?.role === 'client')
}
