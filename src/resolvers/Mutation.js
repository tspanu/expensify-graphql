import bcrypt from 'bcrypt'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const password = await hashPassword(args.data.password)
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Incorrect email/password')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
    },
    async updateUser(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request)

        if (typeof data.password === 'string'){
            data.password = await hashPassword(data.password)
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data
        }, info)
    },
    async createExpense(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.createExpense({
            data: {
                description: data.description,
                amount: data.amount,
                date: data.amount,
                owner: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
    },
    async deleteExpense(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const expenseExists = await prisma.exists.Expense({
            id: args.id,
            owner: {
                id: userId
            }
        })

        if (!expenseExists) {
            throw new Error('Unable to delete expense')
        }

        return prisma.mutation.deleteExpense({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateExpense(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request)

        const expenseExists = await prisma.exists.Expense({
            id: id,
            owner: {
                id: userId
            }
        })

        if (!expenseExists) {
            throw new Error('Unable to update expense')
        }

        return prisma.mutation.updateExpense({
            where: {
                id
            },
            data
        }, info)
    }
}

export { Mutation as default }