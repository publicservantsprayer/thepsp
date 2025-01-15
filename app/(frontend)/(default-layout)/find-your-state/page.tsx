import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StateName } from '@/components/state-name'
import { DynamicMapWithoutSSR } from './dynamic-map-without-ssr'

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mr-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2 md:col-start-2">
          <div className="prose dark:prose-invert">
            <h1 className="mb-8">Find Your State</h1>
          </div>
        </div>

        <Card className="border-none bg-background md:col-span-1">
          <CardContent className="my-auto space-y-8">
            <p className="xl:text-xl">
              Your IP address was detected as coming from{' '}
              <strong>
                <StateName />
              </strong>
              . However, you can select any state from the map to set the state
              you want to pray for.
            </p>
            <p className="hidden md:text-[32px] lg:flex lg:text-[48px] xl:text-[64px]">
              Prayer can change the course of history
            </p>
            <p className="hidden lg:flex xl:text-[24px]">
              We invite you to join us in praying for our leaders.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Map of the United States</CardTitle>
            <CardDescription>
              Select on a state to see todays leaders you can pray for. You can
              pan and zoom the map to see the entire country.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicMapWithoutSSR />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
