import formabaseCertificate from '../CV/Certificado Pedro Duarte.pdf'
import formabaseLogo from '../images/formabase.webp'
import polytechnicLogo from '../images/polytechnic_setubal.webp'
import type { EducationItem } from './types'

export const education: EducationItem[] = [
  {
    id: '1',
    institution: 'Polytechnic Institute of Setúbal',
    degree: "Bachelor's Degree",
    field: 'Management Information Systems',
    startDate: '2017-09',
    endDate: '2020-06',
    location: 'Setúbal, Portugal',
    achievements: [
      'Focused on the intersection of business and technology across the full information systems lifecycle',
      'Key coursework included application development, database management, systems analysis and design, architecture, project management, quality, security, and mathematics',
    ],
    gpa: '15/20',
    logo: polytechnicLogo,
  },
  {
    id: '2',
    institution: 'Formabase',
    degree: 'Certificate',
    field: 'Web Creation',
    startDate: '2016-10',
    endDate: '2017-02',
    location: 'Lisbon, Portugal',
    achievements: ['Practical training in PHP, HTML, and CSS'],
    certificateUrl: formabaseCertificate,
    certificateLabel: 'View Certificate',
    logo: formabaseLogo,
  },
]
