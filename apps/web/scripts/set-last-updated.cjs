const fs = require('fs')
const path = require('path')

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function formatDate(d) {
  // YYYY-MM-DD HH:MM
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    ' ' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes())
  )
}

const now = new Date()
const value = formatDate(now)
const envLine = `VITE_LAST_UPDATED="${value}"\n`

const envPath = path.join(__dirname, '..', '.env')
try {
  fs.writeFileSync(envPath, envLine, { encoding: 'utf8' })
  console.log('Wrote', envPath, '->', envLine.trim())
  process.exit(0)
} catch (err) {
  console.error('Failed to write', envPath, err)
  process.exit(1)
}
