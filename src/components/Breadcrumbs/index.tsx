import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import React from 'react'

interface IBreadcrumb {
  title: string
  href: string
}

const Breadcrubms = ({ breadcrumbArray }: { breadcrumbArray: IBreadcrumb[] }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbArray.map((item, index) => {
          const isLastItem = index === breadcrumbArray.length - 1

          // If it’s the last item, we render `BreadcrumbPage`,
          // otherwise we render a `BreadcrumbLink` plus a `BreadcrumbSeparator`
          return isLastItem ? (
            <BreadcrumbItem key={item.title}>
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <React.Fragment key={item.title}>
              <BreadcrumbItem>
                <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadcrubms
