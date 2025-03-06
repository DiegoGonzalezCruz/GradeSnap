import { ComingSoon } from '@/components/ComingSoon/ComingSoon'
import { AIGradedAssessments } from '@/components/Dashboard/ai-graded-assements'
import { ClassroomData } from '@/components/Dashboard/classroom-data'
import { DashboardHeader } from '@/components/Dashboard/dashboard-header'
import { DashboardShell } from '@/components/Dashboard/dashboard-shell'
import { SendAnnouncement } from '@/components/Dashboard/send-announcement'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GradeSnap - Rubrics',
  description: 'Rubrics.',
}

export default function SummariesDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Rubrics" text="Summaries of the classroom data."></DashboardHeader>
      <ComingSoon
        title="Rubrics"
        description="You can view rubrics for your classroom, including grading policies and student data."
        estimatedRelease="Q2"
        image="/logos/logo-darkbackground.svg"
      />
    </DashboardShell>
  )
}
