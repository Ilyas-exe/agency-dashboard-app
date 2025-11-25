import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

// File paths - assuming they are in the project root
const AGENCIES_FILE_PATH = 'agencies_agency_rows.csv'
const CONTACTS_FILE_PATH = 'contacts_contact_rows.csv'

async function main() {
  console.log('Start seeding...')

  // Store valid agency IDs to check foreign key constraints
  const validAgencyIds = new Set<string>()

  // 1. Seed Agencies
  if (fs.existsSync(AGENCIES_FILE_PATH)) {
    console.log(`Reading agencies from ${AGENCIES_FILE_PATH}`)
    const agenciesFileContent = fs.readFileSync(AGENCIES_FILE_PATH, 'utf-8')
    const agencies = parse(agenciesFileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    console.log(`Found ${agencies.length} agencies. Inserting...`)

    for (const row of agencies) {
      // Parse population: remove commas and convert to int
      let population = null
      if (row.population) {
        const popString = row.population.replace(/,/g, '')
        const popInt = parseInt(popString, 10)
        if (!isNaN(popInt)) {
          population = popInt
        }
      }

      await prisma.agency.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          name: row.name,
          state: row.state,
          type: row.type,
          population: population,
          website: row.website,
        },
      })
      validAgencyIds.add(row.id)
    }
    console.log('Agencies seeded.')
  } else {
    console.warn(`Agencies file not found at ${AGENCIES_FILE_PATH}`)
  }

  // 2. Seed Contacts
  if (fs.existsSync(CONTACTS_FILE_PATH)) {
    console.log(`Reading contacts from ${CONTACTS_FILE_PATH}`)
    const contactsFileContent = fs.readFileSync(CONTACTS_FILE_PATH, 'utf-8')
    const contacts = parse(contactsFileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    console.log(`Found ${contacts.length} contacts. Inserting...`)

    // Process in chunks to avoid memory issues or timeouts if large
    const chunkSize = 100
    for (let i = 0; i < contacts.length; i += chunkSize) {
      const chunk = contacts.slice(i, i + chunkSize)
      
      await prisma.$transaction(
        chunk.map((row: any) => {
            // Check if the agency_id exists in our database
            const agencyId = row.agency_id && validAgencyIds.has(row.agency_id) ? row.agency_id : null;

            return prisma.contact.upsert({
                where: { id: row.id },
                update: {},
                create: {
                id: row.id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                phone: row.phone,
                title: row.title,
                department: row.department,
                created_at: row.created_at ? new Date(row.created_at) : new Date(),
                agency_id: agencyId,
                },
            })
        })
      )
    }
    console.log('Contacts seeded.')
  } else {
    console.warn(`Contacts file not found at ${CONTACTS_FILE_PATH}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
