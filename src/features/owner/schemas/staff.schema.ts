import { z } from "zod";

export const staffInviteSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  role: z.enum(["Owner", "BranchManager", "Coach", "Reception"], {
    message: "يرجى اختيار دور وظيفي صحيح",
  }),
  branchId: z.string().optional(),
});

export type StaffInviteFormValues = z.infer<typeof staffInviteSchema>;
