import { z } from 'zod'
import { districtSchema, newDistrictSchema } from './districts.schema'

export type District = z.infer<typeof districtSchema>
export type DistrictDb = z.infer<typeof districtSchema>
export type NewDistrict = z.infer<typeof newDistrictSchema>
