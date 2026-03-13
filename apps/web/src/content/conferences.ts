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
      'Four-day conference focused on the Microsoft ecosystem, including a full-day hands-on workshop building an application with .NET Aspire.',
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
      "Volunteered in the days leading up to the event, helping with organization ahead of one of the world's best-known technology conferences.",
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
