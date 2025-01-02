import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Map } from './map'
import { StateName } from '@/components/state-name'

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="my-8 text-center text-3xl font-bold">Find Your State</h1>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-none md:col-span-1">
          <CardContent className="my-auto space-y-8">
            <p className="md:text-xl">
              Your IP address was detected as coming from{' '}
              <strong>
                <StateName />
              </strong>
              . However, you can select any state from the map to set the state
              you want to pray for.
            </p>
            <p className="hidden md:flex md:text-[64px]">
              Prayer can change the course of history
            </p>
            <p className="hidden md:flex md:text-[24px]">
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
            <Map />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
