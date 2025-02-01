import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { District, Leader } from '@/lib/types'

export function DistrictTabContent({
  leader,
  districts,
}: {
  leader: Leader
  districts: District[]
}) {
  // Compute the current district for display and initialize the state.
  const initialDistrict = districts.find(
    (district) => district.ref === leader.districtRef,
  )
  const [districtPath, setDistrictPath] = React.useState<string | undefined>(
    initialDistrict?.ref.path,
  )

  // Local state handler
  const handleDistrictValueChange = (value: string) => {
    setDistrictPath(value)
  }

  // Filter district lists for different types.
  const usSenateDistricts = districts.filter(
    (district) =>
      district.jurisdiction === 'federal' &&
      district.legislativeChamber === 'upper',
  )
  const usHouseDistricts = districts.filter(
    (district) =>
      district.jurisdiction === 'federal' &&
      district.legislativeChamber === 'lower',
  )
  const stateSenateDistricts = districts.filter(
    (district) =>
      district.jurisdiction === 'state' &&
      district.legislativeChamber === 'upper',
  )
  const stateHouseDistricts = districts.filter(
    (district) =>
      district.jurisdiction === 'state' &&
      district.legislativeChamber === 'lower',
  )

  const currentDistrict = districts.find(
    (district) => district.ref === leader.districtRef,
  )

  return (
    <>
      <div className="my-6">
        {currentDistrict?.jurisdiction} {currentDistrict?.legislativeChamber}{' '}
        {currentDistrict?.name} {currentDistrict?.ref.path}
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <div>U.S. Senate</div>
        <DistrictSelect
          districts={usSenateDistricts}
          districtPath={districtPath}
          setDistrictPath={handleDistrictValueChange}
        />

        <div>U.S. House</div>
        <DistrictSelect
          districts={usHouseDistricts}
          districtPath={districtPath}
          setDistrictPath={handleDistrictValueChange}
        />

        <div>State Senate</div>
        <DistrictSelect
          districts={stateSenateDistricts}
          districtPath={districtPath}
          setDistrictPath={handleDistrictValueChange}
        />

        <div>State House</div>
        <DistrictSelect
          districts={stateHouseDistricts}
          districtPath={districtPath}
          setDistrictPath={handleDistrictValueChange}
        />
      </div>
    </>
  )
}

export function DistrictSelect({
  districts,
  districtPath,
  setDistrictPath,
}: {
  districts: District[]
  districtPath: string | undefined
  setDistrictPath: (value: string) => void
}) {
  return (
    <Select value={districtPath} onValueChange={setDistrictPath}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a District" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a District</SelectLabel>
          {districts.map((district) => (
            <SelectItem key={district.ref.path} value={district.ref.path}>
              {district.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
