import { z } from "zod";

export const validateId = {
  params: z.object({
    id: z.string().refine((id) => !isNaN(Number(id)), {
      message: "Id must be a number",
    }),
  }),
};
