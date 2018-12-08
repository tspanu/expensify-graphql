import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: 'Jax',
        email: 'jax@example.com',
        password: bcrypt.hashSync('Abcd123$', 10)
    },
    data: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'Lux',
        email: 'lux@example.com',
        password: bcrypt.hashSync('abcd1234', 10)
    },
    data: undefined,
    jwt: undefined
}

const seedDatabase = async () => {
    //Delete test data
    await prisma.mutation.deleteManyUsers()

    //Create user one
    userOne.data = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.jwt = jwt.sign({ userId: userOne.data.id }, process.env.JWT_SECRET)

    //Create user two
    userTwo.data = await prisma.mutation.createUser({
        data: userTwo.input
    })

    userTwo.jwt = jwt.sign({ userId: userTwo.data.id }, process.env.JWT_SECRET)
}

export { seedDatabase as default, userOne, userTwo }