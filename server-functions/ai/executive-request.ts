'use server'

import { ChatXAI } from '@langchain/xai'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { saveAiRequest } from '@/lib/firebase/firestore/ai-requests'
import {
  singleLeaderAiQuerySchema,
  stateExecutiveStructureSchema,
} from '@/lib/firebase/firestore/leaders.schema'
import { State } from '@/lib/types'

export async function executiveRequest(query: string, state: State) {
  mustGetCurrentAdmin()
  const model = 'grok-2-1212'

  const grok = new ChatXAI({
    model,
    temperature: 1,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
  })

  const structuredModel = grok.withStructuredOutput(
    stateExecutiveStructureSchema,
  )

  const response = await structuredModel.invoke(query)

  await saveAiRequest({
    query,
    response,
    type: 'executive',
    stateCode: state.ref.id,
    model,
    createdAt: new Date(),
  })

  return stateExecutiveStructureSchema.parse(response)
}

export async function singleLeaderRequest(query: string, state: State) {
  mustGetCurrentAdmin()
  const model = 'grok-2-1212'

  const grok = new ChatXAI({
    model,
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
  })

  const structuredModel = grok.withStructuredOutput(singleLeaderAiQuerySchema)

  const response = await structuredModel.invoke(query)

  await saveAiRequest({
    query,
    response,
    type: 'executive',
    stateCode: state.ref.id,
    model,
    createdAt: new Date(),
  })

  return singleLeaderAiQuerySchema.parse(response)
}
