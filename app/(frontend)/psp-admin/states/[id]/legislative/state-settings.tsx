'use client'

import * as React from 'react'
import { Settings } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

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
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/hooks/use-toast'
import { State } from '@/lib/types'
import { serverSaveStateSettings } from '@/server-functions/save-state-settings'

const formSchema = z.object({
  createDailyPost: z.boolean(),
  hasLieutenantGovernor: z.boolean(),
  hasSecretaryOfState: z.boolean(),
  lowerChamberName: z.string().min(1, {
    message: 'Lower chamber name is required.',
  }),
  upperChamberName: z.string().min(1, {
    message: 'Upper chamber name is required.',
  }),
})

type FormValues = z.infer<typeof formSchema>

export function StateSettings({ state }: { state: State }) {
  const [open, setOpen] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createDailyPost: state.createDailyPost || false,
      hasLieutenantGovernor: state.hasLieutenantGovernor || false,
      hasSecretaryOfState: state.hasSecretaryOfState || false,
      lowerChamberName:
        state.lowerChamberName || `${state.name} House of Representatives`,
      upperChamberName: state.upperChamberName || `${state.name} State Senate`,
    },
  })

  async function onSubmit(values: FormValues) {
    const {
      createDailyPost,
      hasLieutenantGovernor,
      hasSecretaryOfState,
      lowerChamberName,
      upperChamberName,
    } = values

    const result = await serverSaveStateSettings({
      state,
      createDailyPost,
      hasLieutenantGovernor,
      hasSecretaryOfState,
      lowerChamberName,
      upperChamberName,
      revalidatePath: '/psp-admin/states/[id]/legislative',
    })

    if (result.success) {
      toast({
        title: 'Settings saved',
        description: 'State settings have been updated successfully.',
      })
      setOpen(false)
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>State Settings</DialogTitle>
          <DialogDescription>
            Configure state-specific settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="createDailyPost"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Daily Post</FormLabel>
                    <FormDescription>
                      Enable automatic daily post creation
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasLieutenantGovernor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Lieutenant Governor
                    </FormLabel>
                    <FormDescription>
                      State has a Lieutenant Governor position
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasSecretaryOfState"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Secretary of State
                    </FormLabel>
                    <FormDescription>
                      State has a Secretary of State position
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="upperChamberName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upper Chamber Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Senate" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the upper legislative chamber
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lowerChamberName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lower Chamber Name</FormLabel>
                  <FormControl>
                    <Input placeholder="House of Representatives" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the lower legislative chamber
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
            >
              Save changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
