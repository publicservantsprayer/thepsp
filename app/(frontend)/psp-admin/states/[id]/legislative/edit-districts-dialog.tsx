'use client'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  District,
  Jurisdiction,
  Leader,
  LegislativeChamber,
  State,
} from '@/lib/types'
import { addNewDistrict, serverDeleteDistrict } from '@/server-functions/states'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SquareX } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  FindLegislativeAiRequestForm,
  LegislativeDistrictAiResult,
} from './find-legislative-ai-request-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { serverSaveLinedUpLeaders } from '@/server-functions/new-leaders/save-leader-batch'

export function EditDistrictsDialog({
  state,
  districts,
  jurisdiction,
  legislativeChamber,
  leadersToLineUp,
  children,
}: {
  state: State
  districts: District[]
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  leadersToLineUp?: Leader[]
  children?: React.ReactNode
}) {
  const { toast } = useToast()
  const [aiResult, setAiResult] = React.useState<
    LegislativeDistrictAiResult | undefined
  >()
  const [savingLinedUpLeaders, setSavingLinedUpLeaders] = React.useState(false)

  const handleSaveLinedUpLeaders = async () => {
    if (!leadersToLineUp) return
    setSavingLinedUpLeaders(true)

    const result = await serverSaveLinedUpLeaders({
      leaders: leadersToLineUp,
      revalidatePath: '/psp-admin/states/' + state.ref.id.toLowerCase(),
    })
    console.log('Save Lined Up Leaders')
    setSavingLinedUpLeaders(false)

    if (result.success) {
      toast({
        title: result.count + ' Leaders saved.',
      })
    } else {
      console.error(result.error)
      toast({
        title: 'Error',
        description: result.error,
      })
    }
  }

  const handleDelete = (district: District) => async () => {
    const result = await serverDeleteDistrict({
      district,
      state,
      revalidatePath:
        '/psp-admin/states/' + state.ref.id.toLowerCase() + '/legislative',
    })
    if (result.success) {
      toast({
        title: 'District deleted.',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error,
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{state.name}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="districts" className="min-h-[50vh]">
          <TabsList>
            <TabsTrigger value="districts">Districts</TabsTrigger>
            <TabsTrigger value="update-leaders">
              Find Current Leaders
            </TabsTrigger>
            <TabsTrigger value="super-admin">Super Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="districts">
            <div className="space-y-4">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1">
                {districts.map((district) => (
                  <div
                    key={district.ref.id}
                    className="flex items-center rounded border text-sm"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete(district)}
                    >
                      <SquareX className="h-[12px] w-[12px]" />
                    </Button>
                    <div className="whitespace-nowrap pr-1">
                      {district.name}
                    </div>
                  </div>
                ))}
              </div>

              <StateForm
                state={state}
                districts={districts}
                jurisdiction={jurisdiction}
                legislativeChamber={legislativeChamber}
              />
            </div>
          </TabsContent>
          <TabsContent value="update-leaders">
            <FindLegislativeAiRequestForm
              state={state}
              jurisdiction={jurisdiction}
              legislativeChamber={legislativeChamber}
              setAiResult={setAiResult}
            />
          </TabsContent>

          <TabsContent value="super-admin">
            <div className="my-6">Super Admin</div>
            <ScrollArea className="h-[30vh]">
              <div className="grid grid-cols-[auto_auto_auto_auto_auto_auto_auto] gap-y-1 bg-muted/20 text-xs">
                {leadersToLineUp?.map((leader) => (
                  <React.Fragment key={leader.ref.id}>
                    <div className="whitespace-nowrap">{leader.fullname}</div>
                    <div className="whitespace-nowrap">
                      {leader.districtName}
                    </div>
                    <div className="whitespace-nowrap">{leader.District}</div>
                    <div className="whitespace-nowrap">{leader.Chamber}</div>
                    <div className="whitespace-nowrap">
                      {leader.legislativeChamber}
                    </div>
                    <div className="whitespace-nowrap">
                      {leader.jurisdiction}
                    </div>
                    <div className="whitespace-nowrap">{leader.LegType}</div>
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
            <Button
              onClick={handleSaveLinedUpLeaders}
              loading={savingLinedUpLeaders}
              disabled={savingLinedUpLeaders}
            >
              Save Lined Up Leaders
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

const FormSchema = z.object({
  name: z.string(),
})

function StateForm({
  state,
  districts,
  jurisdiction,
  legislativeChamber,
}: {
  state: State
  districts: District[]
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
}) {
  const [nextDistrict, setNextDistrict] = React.useState(districts?.length || 0)

  const { toast } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: `District ${nextDistrict}`,
    },
  })

  // Update field, guessing next district name
  React.useEffect(() => {
    console.log('districts: ', districts)
    if (!districts) return
    if (districts.length + 1 === nextDistrict) return

    console.log('setting next district to: ', districts?.length + 1)
    setNextDistrict(districts?.length + 1 || 0)

    form.resetField('name', {
      defaultValue: `District ${districts?.length + 1}`,
    })
  }, [districts, form, nextDistrict])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await addNewDistrict(
      { name: data.name, jurisdiction, legislativeChamber },
      state,
    )
    toast({
      title: 'District added.',
    })
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Name</FormLabel>
                <FormControl>
                  <Input className="" {...field} />
                </FormControl>
                <FormDescription>Name of the district</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <Button
              type="submit"
              size="sm"
              className="w-full text-sm"
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
            >
              Add District
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
