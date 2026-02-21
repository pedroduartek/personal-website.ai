import formabaseCertificate from '../CV/Certificado Pedro Duarte.pdf'
import type { EducationItem } from './types'

export const education: EducationItem[] = [
  {
    id: '1',
    institution: 'Polytechnic Institute Of Setúbal',
    degree: "Bachelor's Degree",
    field: 'Management Information Systems',
    startDate: '2017-09',
    endDate: '2020-06',
    location: 'Setúbal, Portugal',
    achievements: [
      'Focused on management and technology across the full information system development lifecycle',
      'Key courses: Application Development, Database Management, Information Systems (Analysis, Design, Architecture, Project Management, Quality, Security), Mathematics',
    ],
    gpa: '15/20',
  },
  {
    id: '2',
    institution: 'Formabase',
    degree: 'Certificate',
    field: 'Web Creation',
    startDate: '2017-02',
    endDate: '2017-02',
    location: 'Lisbon, Portugal',
    achievements: ['PHP, HTML, CSS'],
    certificateUrl: formabaseCertificate,
  },
]
