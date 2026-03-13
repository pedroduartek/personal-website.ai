import azureDevSummitLogo from '../images/azure_dev_summit.webp'
import azureNickChapsas from '../images/photo_nickchapsas_azuresummit.webp'
import azureStage1 from '../images/stage_azuresummit.webp'
import azureStage2 from '../images/stage_azuresummit_2.webp'
import webSummitLogo from '../images/web_summit.webp'
import webSummitGroup from '../images/websummit_groupphoto.webp'
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
    logo: azureDevSummitLogo,
    photos: [
      {
        src: azureStage1,
        alt: 'Azure Dev Summit stage view',
      },
      {
        src: azureStage2,
        alt: 'Azure Dev Summit stage wide shot',
      },
      {
        src: azureNickChapsas,
        alt: 'Photo with Nick Chapsas at Azure Dev Summit',
        objectPosition: 'center 35%',
      },
    ],
    links: {
      website: 'https://azuredevsummit.com/',
    },
  },
  {
    id: '2',
    name: 'Web Summit',
    type: 'Volunteer',
    date: '2019-11',
    location: 'Lisbon, Portugal',
    description:
      'Web Summit is a leading global technology conference, known for connecting professionals, startups, and industry leaders to discuss innovation and emerging trends. Helped organizing in the days prior to the event.',
    logo: webSummitLogo,
    photos: [
      {
        src: webSummitGroup,
        alt: 'Web Summit volunteer group photo',
      },
    ],
    links: {
      website: 'https://websummit.com/',
    },
  },
]
