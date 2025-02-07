'use client'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import LoginWithGoogle from './LoginWithGoogle'

const AuthModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="primary" className="mx-auto">
          Reservar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Para continuar debes registrarte</DialogTitle>
          <DialogDescription>
            El siguiente paso es registrarte, lo puedes hacer con Google. ¡Muy fácil!
          </DialogDescription>
        </DialogHeader>
        <LoginWithGoogle />
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
