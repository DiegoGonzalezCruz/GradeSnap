import { ComingSoon } from '@/components/ComingSoon/ComingSoon'
import { AIGradedAssessments } from '@/components/Dashboard/ai-graded-assements'
import { ClassroomData } from '@/components/Dashboard/classroom-data'
import { DashboardHeader } from '@/components/Dashboard/dashboard-header'
import { DashboardShell } from '@/components/Dashboard/dashboard-shell'
import { SendAnnouncement } from '@/components/Dashboard/send-announcement'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GradeSnap - Settings',
  description: 'Settings Page.',
}

export default function SettingsDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your classroom settings."></DashboardHeader>

      <ComingSoon
        title="Settings"
        description="You can customize various aspects of your classroom, such as grading policies and student data."
        estimatedRelease="Q2"
        image="/logos/logo-darkbackground.svg"
      />
    </DashboardShell>
  )
}
