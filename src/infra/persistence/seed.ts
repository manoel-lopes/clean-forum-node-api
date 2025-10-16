#!/usr/bin/env tsx
/* eslint-disable no-console */

import { BcryptPasswordHasher } from '../adapters/security/bcrypt-password-hasher'
import { prisma } from './prisma/client'

const bcrypt = new BcryptPasswordHasher()

async function createTestUsers (totalUsers = 10000) {
  console.log(`🌱 Starting ${totalUsers.toLocaleString()} users seed...`)
  const startTime = Date.now()
  const hashedPassword = await bcrypt.hash('Test@123456')
  const batchSize = 1000
  for (let i = 0; i < totalUsers; i += batchSize) {
    const users = []
    const currentBatchSize = Math.min(batchSize, totalUsers - i)
    for (let j = 0; j < currentBatchSize; j++) {
      const userIndex = i + j + 1
      users.push({
        name: `User ${userIndex}`,
        email: `user${userIndex}@example.com`,
        password: hashedPassword,
      })
    }
    await prisma.user.createMany({
      data: users,
      skipDuplicates: true
    })
    const progress = ((i + currentBatchSize) / totalUsers) * 100
    console.log(`✅ Inserted batch ${Math.ceil((i + currentBatchSize) / batchSize)}/${Math.ceil(totalUsers / batchSize)} - ${progress.toFixed(1)}% complete`)
  }
  const endTime = Date.now()
  const duration = (endTime - startTime) / 1000
  console.log(`🎉 Successfully seeded ${totalUsers} users in ${duration.toFixed(2)}s`)
  console.log(`📊 Average: ${(totalUsers / duration).toFixed(0)} users/second`)
  const userCount = await prisma.user.count()
  console.log(`📋 Total users in database: ${userCount}`)
}

async function createTestQuestions () {
  console.log('🌱 Creating test questions...')
  const startTime = Date.now()

  const users = await prisma.user.findMany({
    take: 1000,
    select: { id: true }
  })

  const questionsData = []
  for (let i = 0; i < 10000; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    questionsData.push({
      title: `Test Question ${i + 1}`,
      content: `This is the content for test question ${i + 1}. It contains some sample text to simulate real forum questions with more detailed content.`,
      slug: `test-question-${i + 1}`,
      authorId: randomUser.id,
    })
  }
  const batchSize = 1000
  for (let i = 0; i < questionsData.length; i += batchSize) {
    const batch = questionsData.slice(i, i + batchSize)
    await prisma.question.createMany({
      data: batch,
      skipDuplicates: true
    })
    console.log(`✅ Inserted question batch ${Math.ceil((i + batchSize) / batchSize)}/${Math.ceil(questionsData.length / batchSize)}`)
  }
  const endTime = Date.now()
  const duration = (endTime - startTime) / 1000
  console.log(`🎉 Created ${questionsData.length} test questions in ${duration.toFixed(2)}s`)
}

async function createTestAnswers () {
  console.log('🌱 Creating test answers...')
  const startTime = Date.now()

  const users = await prisma.user.findMany({
    take: 1000,
    select: { id: true }
  })

  const questions = await prisma.question.findMany({
    take: 1000,
    select: { id: true }
  })

  const answersData = []
  for (let i = 0; i < 20000; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
    const content = `This is test answer ${i + 1} providing a detailed response to the question with helpful information.`
    const excerpt = content.substring(0, 45).replace(/ $/, '').concat('...')
    answersData.push({
      content,
      excerpt,
      authorId: randomUser.id,
      questionId: randomQuestion.id,
    })
  }
  const batchSize = 1000
  for (let i = 0; i < answersData.length; i += batchSize) {
    const batch = answersData.slice(i, i + batchSize)
    await prisma.answer.createMany({
      data: batch,
      skipDuplicates: true
    })
    console.log(`✅ Inserted answer batch ${Math.ceil((i + batchSize) / batchSize)}/${Math.ceil(answersData.length / batchSize)}`)
  }
  const endTime = Date.now()
  const duration = (endTime - startTime) / 1000
  console.log(`🎉 Created ${answersData.length} test answers in ${duration.toFixed(2)}s`)
}

async function createTestComments () {
  console.log('🌱 Creating test comments...')
  const startTime = Date.now()

  const users = await prisma.user.findMany({
    take: 500,
    select: { id: true }
  })

  const questions = await prisma.question.findMany({
    take: 500,
    select: { id: true }
  })

  const answers = await prisma.answer.findMany({
    take: 500,
    select: { id: true }
  })

  const commentsData = []
  for (let i = 0; i < 5000; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const useQuestion = Math.random() > 0.5

    const randomTarget = useQuestion
      ? questions[Math.floor(Math.random() * questions.length)]
      : answers[Math.floor(Math.random() * answers.length)]
    commentsData.push({
      content: `This is test comment ${i + 1} providing additional insight and discussion on the topic.`,
      authorId: randomUser.id,
      questionId: useQuestion ? randomTarget.id : null,
      answerId: useQuestion ? null : randomTarget.id,
    })
  }
  const batchSize = 1000
  for (let i = 0; i < commentsData.length; i += batchSize) {
    const batch = commentsData.slice(i, i + batchSize)
    await prisma.comment.createMany({
      data: batch,
      skipDuplicates: true
    })
    console.log(`✅ Inserted comment batch ${Math.ceil((i + batchSize) / batchSize)}/${Math.ceil(commentsData.length / batchSize)}`)
  }
  const endTime = Date.now()
  const duration = (endTime - startTime) / 1000
  console.log(`🎉 Created ${commentsData.length} test comments in ${duration.toFixed(2)}s`)
}

async function main (totalUsers = 10000) {
  console.log(`🌱 Starting seed with ${totalUsers.toLocaleString()} users...`)
  await createTestUsers(totalUsers)
  await createTestQuestions()
  await createTestAnswers()
  await createTestComments()
  console.log('🏁 Seed completed!')
}

main(100000)
  .catch((e) => {
    console.error(e)
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
