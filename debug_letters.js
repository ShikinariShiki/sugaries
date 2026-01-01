
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const outputFile = 'debug_output.txt'

function log(msg) {
    console.log(msg)
    // Append to file, create if not exists
    try {
        fs.appendFileSync(outputFile, msg + '\n')
    } catch (e) {
        console.error('Error writing to file:', e)
    }
}

async function main() {
    // Clear file first
    try {
        fs.writeFileSync(outputFile, '')
    } catch (e) {
        // ignore
    }

    log('--- Users ---')
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: { letters: true }
            }
        }
    })

    users.forEach(u => {
        log(`ID: ${u.id}`)
        log(`Email: ${u.email}`)
        log(`Name: ${u.name}`)
        log(`Created: ${u.createdAt}`)
        log(`Updated: ${u.updatedAt}`)
        log(`Letters: ${u._count.letters}`)
        log('----------------')
    })

    log('\n--- Total Letters in DB ---')
    const totalLetters = await prisma.letter.count()
    log(`Total: ${totalLetters}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
