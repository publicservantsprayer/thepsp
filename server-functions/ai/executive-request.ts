'use server'

import { ChatXAI } from '@langchain/xai'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { z } from 'zod'
import { saveAiRequest } from '@/lib/firebase/firestore/ai-requests'
import { leaderSchema } from '@/lib/firebase/firestore/leaders.types'
import { StateCode } from '@/lib/types'

export async function executiveRequest(query: string, stateCode: StateCode) {
  mustGetCurrentAdmin()
  const model = 'grok-2-1212'

  const grok = new ChatXAI({
    model,
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
  })

  const structuredModel = grok.withStructuredOutput(executiveStructure)

  const response = await structuredModel.invoke(query)

  await saveAiRequest({
    query,
    response,
    type: 'executive',
    stateCode,
    model,
    createdAt: new Date(),
  })

  return response
}

const executiveStructure = z.object({
  governor: leaderSchema,
  lieutenantGovernor: leaderSchema.optional(),
  secretaryOfState: leaderSchema.optional(),
  hasLieutenantGovernor: z.boolean(),
  hasSecretaryOfState: z.boolean(),
})

export type ExecutiveStructure = z.infer<typeof executiveStructure>
