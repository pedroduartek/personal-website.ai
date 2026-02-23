import type { ConferenceItem } from './types'

export const conferences: ConferenceItem[] = [
  {
    id: '1',
    name: 'Azure Dev Summit',
    type: 'Participant',
    date: '2025-10',
    location: 'Lisbon, Portugal',
    description:
      'Microsoft technology focused conference spanning 4 days. Included a full-day workshop building an app with Aspire.',
  },
  {
    id: '2',
    name: 'Web Summit',
    type: 'Volunteer',
    date: '2019-11',
    location: 'Lisbon, Portugal',
    description: 'Helped organizing in the days prior to the event.',
  },
]
