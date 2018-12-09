import getUserId from "../utils/getUserId"

const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    me(parent, args, { prisma, request }, info){
        const userId = getUserId(request)

        return prisma.query.user({
            where: {
                id: userId
            }
        })
    },
    expenses(parent, args, { prisma, request }, info){
        const userId = getUserId(request)

        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                owner: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                description_contains: args.query
            }, {
                note_contains: args.query
            }]
        }

        return prisma.query.expenses(opArgs, info)

    },
    async expense(parent, args, { prisma, request }, info){
        const userId = getUserId(request)

        const expenses = await prisma.query.expenses({
            where: {
                id: args.id,
                owner: {
                    id: userId
                }
            }
        }, info)

        if (posts.length === 0) {
            throw new Error('Expense not found')
        }

        return expenses[0]
    }
}

export { Query as default }