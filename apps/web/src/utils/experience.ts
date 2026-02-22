/**
 * Calculate years and months of experience since March 2020
 */
export function getExperience(): { years: number; months: number; text: string } {
  const startDate = new Date(2020, 2, 1) // March 2020 (month is 0-indexed)
  const currentDate = new Date()

  let years = currentDate.getFullYear() - startDate.getFullYear()
  let months = currentDate.getMonth() - startDate.getMonth()

  if (months < 0) {
    years--
    months += 12
  }

  const text = months > 0 
    ? `${years} years and ${months} month${months !== 1 ? 's' : ''}`
    : `${years} years`

  return { years, months, text }
}
