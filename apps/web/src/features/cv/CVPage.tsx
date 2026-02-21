import {
  Document,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import PageSEO from '../../components/seo/PageSEO'
import { education } from '../../content/education'
import { experience } from '../../content/experience'
import { profile } from '../../content/profile'
import { skills } from '../../content/skills'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  contact: {
    fontSize: 10,
    marginBottom: 2,
    color: '#333',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '1 solid #000',
    paddingBottom: 4,
  },
  experienceItem: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 11,
    marginBottom: 2,
  },
  date: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10,
    marginLeft: 12,
    marginBottom: 2,
  },
  skillCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  skillList: {
    fontSize: 10,
    marginBottom: 6,
    marginLeft: 12,
  },
})

function CVDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>{profile.role}</Text>
          <Text style={styles.contact}>Email: {profile.email}</Text>
          <Text style={styles.contact}>LinkedIn: {profile.linkedin}</Text>
          {profile.github && (
            <Text style={styles.contact}>GitHub: {profile.github}</Text>
          )}
          <Text style={styles.contact}>Location: {profile.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text>{profile.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {experience.map((item) => (
            <View key={item.id} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={styles.date}>
                {new Date(item.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })}{' '}
                -{' '}
                {item.endDate
                  ? new Date(item.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })
                  : 'Present'}{' '}
                | {item.location}
              </Text>
              {item.description.map((desc) => (
                <Text key={desc} style={styles.bullet}>
                  • {desc}
                </Text>
              ))}
              <Text style={{ fontSize: 9, marginTop: 4, color: '#666' }}>
                Technologies: {item.technologies.join(', ')}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((item) => (
            <View key={item.id} style={{ marginBottom: 8 }}>
              <Text style={styles.jobTitle}>
                {item.degree} in {item.field}
              </Text>
              <Text style={styles.company}>{item.institution}</Text>
              <Text style={styles.date}>
                {new Date(item.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                })}{' '}
                -{' '}
                {item.endDate
                  ? new Date(item.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                    })
                  : 'Present'}
                {item.gpa && ` | GPA: ${item.gpa}`}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {skills.map((group) => (
            <View key={group.category} style={{ marginBottom: 6 }}>
              <Text style={styles.skillCategory}>{group.category}:</Text>
              <Text style={styles.skillList}>
                {group.skills.map((skill) => skill.name).join(', ')}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export default function CVPage() {
  return (
    <>
      <PageSEO title="Download CV" description="Download my CV as PDF" />
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
          Download CV
        </h1>
        <div className="max-w-2xl">
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            Download my CV as a PDF for easy sharing and printing. The CV
            contains my complete professional experience, education, and skills.
          </p>
          <PDFDownloadLink
            document={<CVDocument />}
            fileName={`${profile.name.replace(/\s+/g, '_')}_CV.pdf`}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {({ loading }) =>
              loading ? 'Generating PDF...' : 'Download CV (PDF)'
            }
          </PDFDownloadLink>
        </div>
      </div>
    </>
  )
}
