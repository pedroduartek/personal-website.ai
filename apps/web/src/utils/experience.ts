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

/**
 * Calculate years from a given start date to current date
 * @param startDate - ISO date string (e.g., '2020-03-01')
 * @returns Number of full years
 */
export function calculateYearsFromDate(startDate: string): number {
  const start = new Date(startDate)
  const current = new Date()
  
  let years = current.getFullYear() - start.getFullYear()
  const monthDiff = current.getMonth() - start.getMonth()
  
  // If we haven't reached the anniversary month yet this year, subtract one year
  if (monthDiff < 0 || (monthDiff === 0 && current.getDate() < start.getDate())) {
    years--
  }
  
  return Math.max(0, years)
}
