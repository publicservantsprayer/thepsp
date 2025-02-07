'use server'

import { ChatXAI } from '@langchain/xai'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { saveAiRequest } from '@/lib/firebase/firestore/ai-requests'
import { singleLeaderAiQuerySchema } from '@/lib/firebase/firestore/leaders.schema'
import { State } from '@/lib/types'

export async function legislativeDistrictLeaderRequest(
  query: string,
  state: State,
) {
  mustGetCurrentAdmin()
  const model = 'grok-beta'

  const grok = new ChatXAI({
    model,
    temperature: 1,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
  })

  const structuredModel = grok.withStructuredOutput(singleLeaderAiQuerySchema)
  const response = await structuredModel.invoke([
    [
      'system',
      `You are a helpful assistant that researches public officials.  Provide information the requested government leader.

      Be as complete as possible.  Include information for all of the fields requested if available, including  gender, marital status, how many kids (family), city of residence, date elected, religion, email, Twitter or X.com handle, Facebook page, website, ballotpedia page, and wikipedia page.`,
    ],
    ['user', query],
  ])

  await saveAiRequest({
    query,
    response,
    type: 'singleLeader',
    stateCode: state.ref.id,
    model,
    createdAt: new Date(),
  })

  console.log('response', response)

  return singleLeaderAiQuerySchema.parse(response)
}
