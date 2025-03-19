import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export const send_response = async (req, res, table, data, params = {}) => {

    const whereCondition = Object.keys(params).length === 0 ? { ...req.query } : params.where;
    const total = await db[table].count({
        where: {
            ...whereCondition,
            NOT: req.headers.not_queries || {}
        },
    })

    res.send({
        total,
        data
    })
}
