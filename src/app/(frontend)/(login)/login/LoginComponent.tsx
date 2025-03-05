import LoginWithGoogle from '@/components/Auth/LoginWithGoogle'
import ImageComponent from '@/components/Media/ImageComponent'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

const LoginComponent = () => {
  return (
    <div className=" w-full h-[85vh]  flex items-center justify-center bg-background p-4 md:p-8 ">
      <Card className="w-full max-w-6xl overflow-hidden shadow-lg h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0  h-full">
          {/* Image Section - Hidden on mobile, visible on tablet and up */}
          <div className="hidden md:block bg-white relative h-full min-h-[300px]   ">
            <ImageComponent
              image={'/teacher1.jpeg'}
              alt="Teacher helping students"
              className="   w-full h-full object-top"
            />
            <div className="absolute bottom-4 left-4 bg-background/80 p-2 rounded-md text-sm text-muted-foreground backdrop-blur-sm">
              Simplify your classroom grading experience with AI
            </div>
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground p-2  overflow-clip -rotate-12 text-sm  rounded-xl backdrop-blur-sm">
              Comming soon!
            </div>
          </div>

          {/* Login Section */}
          <CardContent className="flex flex-col items-center justify-center p-6 md:p-10 space-y-6 ">
            <div className="text-center space-y-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                  Welcome to GradeSnap
                </h1>
                {/* <div className="h-12 md:h-36 translate-y-0.5 overflow-hidden">
                  <ImageComponent
                    image={'/logos/logo.png'}
                    alt="Application logo"
                    className="h-full w-auto object-contain"
                  />
                </div> */}
              </div>

              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Streamline your grading process with our Google Classroom integration. Save time and
                provide better feedback to your students.
              </p>
            </div>

            <div className="w-full max-w-sm">
              <LoginWithGoogle redirectTo="/dashboard" />

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>By signing in, you agree to our</p>
                <div className="flex justify-center space-x-2 mt-1">
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  <span>•</span>
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}

export default LoginComponent
