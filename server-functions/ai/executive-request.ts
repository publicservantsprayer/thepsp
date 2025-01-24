'use server'

import { ChatXAI } from '@langchain/xai'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { z } from 'zod'
import { saveAiRequest } from '@/lib/firebase/firestore/ai-requests'
import { StateCode } from '@/lib/types'
import { leaderAiQuerySchema } from '@/lib/firebase/firestore/leaders.schema'

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
  executiveBranchDescription: z
    .string()
    .describe('One paragraph description of the executive branch of the state'),
  governor: leaderAiQuerySchema,
  lieutenantGovernor: leaderAiQuerySchema.optional(),
  secretaryOfState: leaderAiQuerySchema.optional(),
})

export type ExecutiveStructure = z.infer<typeof executiveStructure>
