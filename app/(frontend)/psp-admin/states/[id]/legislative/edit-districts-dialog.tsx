'use client'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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

import { District, Jurisdiction, LegislativeChamber, State } from '@/lib/types'
import { addNewDistrict, serverDeleteDistrict } from '@/server-functions/states'
import { zodResolver } from '@hookform/resolvers/zod'
import { SquareX } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function EditDistrictsDialog({
  state,
  districts,
  jurisdiction,
  legislativeChamber,
  children,
}: {
  state: State
  districts: District[]
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  children?: React.ReactNode
}) {
  const { toast } = useToast()

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
        </DialogHeader>
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
                <div className="whitespace-nowrap pr-1">{district.name}</div>
              </div>
            ))}
          </div>
        </div>

        <StateForm
          state={state}
          districts={districts}
          jurisdiction={jurisdiction}
          legislativeChamber={legislativeChamber}
        />
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
  }, [districts, nextDistrict])

  const { toast } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: `District ${nextDistrict}`,
    },
  })

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
