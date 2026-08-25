import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().min(2, "اسم الفرع يجب أن يكون حرفين على الأقل"),
  address: z.string().optional(),
  phone: z.string().optional(),
  managerUserId: z.string().optional(),
});

export type BranchFormValues = z.infer<typeof branchSchema>;
