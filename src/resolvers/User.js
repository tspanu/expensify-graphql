import getUserId from "../utils/getUserId"

const User = {
    email: { 
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info){
            const userId = getUserId(request, false)
    
            if (userId && userId === parent.id){
                return parent.email
            } else {
                return null
            }
        }
    },
    expenses: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }, info){
            return prisma.query.expenses({
                where: {
                    owner: {
                        id: parent.id
                    }
                }
            })
        }
    }
}

export { User as default }