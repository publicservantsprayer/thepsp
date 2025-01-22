import { leaderDbSchema } from '@/lib/firebase/firestore/leaders.schema'

describe('leaderAuthoritySchema', () => {
  const baseRequiredFields = {
    FirstName: 'John',
    LastName: 'Doe',
    LegalName: 'John Doe',
    Family: '2',
    Title: 'President',
    Party: 'Independent',
    Gender: 'M',
    BirthDate: '1',
    BirthMonth: '1',
    BirthYear: '1970',
    BirthPlace: 'Springfield, IL',
    Religion: 'None',
    ElectDate: '2023-01-20',
    Residence: 'Washington, DC',
  }

  describe('Federal Executive', () => {
    it('should validate valid federal executive', () => {
      const validData = {
        ...baseRequiredFields,
        jurisdiction: 'federal',
        branch: 'executive',
        federalExecutiveOffice: 'president',
      }
      expect(leaderDbSchema.safeParse(validData).success).toBe(true)
    })

    it('should reject federal executive without office', () => {
      const invalidData = {
        ...baseRequiredFields,
        jurisdiction: 'federal',
        branch: 'executive',
      }
      const result = leaderDbSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        'Federal executive position requires federalExecutiveOffice',
      )
    })
  })

  describe('State Executive', () => {
    it('should validate valid state executive', () => {
      const validData = {
        ...baseRequiredFields,
        jurisdiction: 'state',
        branch: 'executive',
        stateExecutiveOffice: 'governor',
      }
      expect(leaderDbSchema.safeParse(validData).success).toBe(true)
    })

    it('should reject state executive without office', () => {
      const invalidData = {
        ...baseRequiredFields,
        jurisdiction: 'state',
        branch: 'executive',
      }
      const result = leaderDbSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        'State executive position requires stateExecutiveOffice',
      )
    })
  })

  describe('Mutual Exclusivity', () => {
    it('should reject having both executive offices', () => {
      const invalidData = {
        ...baseRequiredFields,
        jurisdiction: 'federal',
        branch: 'executive',
        federalExecutiveOffice: 'president',
        stateExecutiveOffice: 'governor',
      }
      const result = leaderDbSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        'Cannot have both federal and state executive offices',
      )
    })
  })

  describe('Legislative Branch', () => {
    it('should validate valid legislative position', () => {
      const validData = {
        ...baseRequiredFields,
        jurisdiction: 'federal',
        branch: 'legislative',
        legislativeChamber: 'upper',
      }
      expect(leaderDbSchema.safeParse(validData).success).toBe(true)
    })

    it('should reject legislative without chamber', () => {
      const invalidData = {
        ...baseRequiredFields,
        jurisdiction: 'federal',
        branch: 'legislative',
      }
      const result = leaderDbSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        'Legislative branch requires legislativeChamber',
      )
    })

    it('should reject legislative with executive office', () => {
      const invalidData = {
        ...baseRequiredFields,
        jurisdiction: 'federal',
        branch: 'legislative',
        legislativeChamber: 'upper',
        federalExecutiveOffice: 'president',
      }
      const result = leaderDbSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        'Legislative branch cannot have executive offices',
      )
    })
  })

  describe('Judicial Branch', () => {
    it('should validate valid judicial position', () => {
      const validData = {
        ...baseRequiredFields,
        jurisdiction: 'federal',
        branch: 'judicial',
      }
      expect(leaderDbSchema.safeParse(validData).success).toBe(true)
    })

    it('should reject judicial with any additional offices', () => {
      const invalidData = {
        ...baseRequiredFields,
        jurisdiction: 'federal',
        branch: 'judicial',
        legislativeChamber: 'upper',
      }
      const result = leaderDbSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(
        'Judicial branch cannot have legislative or executive properties',
      )
    })
  })
})
