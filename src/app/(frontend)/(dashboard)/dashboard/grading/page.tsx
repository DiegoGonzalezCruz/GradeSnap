import { AIGradedAssessments } from '@/components/Dashboard/ai-graded-assements'
import { ClassroomData } from '@/components/Dashboard/classroom-data'
import { DashboardHeader } from '@/components/Dashboard/dashboard-header'
import { DashboardShell } from '@/components/Dashboard/dashboard-shell'
import { SendAnnouncement } from '@/components/Dashboard/send-announcement'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.',
}

export default function GradingDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Grading" text="Here is where the magic happens.">
        <Button>Refresh Data</Button>
      </DashboardHeader>
      {/* <GradingData /> */}
    </DashboardShell>
  )
}
