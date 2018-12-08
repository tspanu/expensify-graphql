import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, login, getUsers, getProfile } from './utils/userOperations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: 'Travis',
            email: 'travis@example.com',
            password: 'abcd1234'
        }
    }

    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const userExists = await prisma.exists.User({
        id: response.data.createUser.user.id
    })

    expect(userExists).toBe(true)
})

test('Should expose public author profiles', async () => {
    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Jax')
})

test('Should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: "jax@example.com",
            password: "abcd1235"
        }
    }
    await expect(client.mutate({ mutation: login, variables })).rejects.toThrow()
})

test('Should not createUser with short password', async () => {
    const variables = {
        data: {
            name: 'Ashe',
            email: 'ashe@example.com',
            password: 'Abcd'
        }
    }

    await expect(client.mutate({
        mutation: createUser,
        variables
    })).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    const { data } = await client.query({ query: getProfile })

    expect(data.me.id).toBe(userOne.data.id)
    expect(data.me.name).toBe(userOne.data.name)
    expect(data.me.email).toBe(userOne.data.email)
})