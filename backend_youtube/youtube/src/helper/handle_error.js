import { Prisma } from "@prisma/client";

export const handle_error = (error, res) => {
    console.log(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            res
                .status(400)
                .send(
                    "There is a unique constraint violation, a new data cannot be created"
                );
        } else {
            res.status(400).send(error.message);
        }
    } else {
        res.status(400).send(error.message);
    }
};
