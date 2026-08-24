import { z } from "zod";

// ── Login ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ── Signup Owner ──────────────────────────────────────────────────────
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "الاسم يجب أن يكون على الأقل حرفين")
      .max(200, "الاسم طويل جدًا"),
    organizationName: z
      .string()
      .min(2, "اسم المنشأة يجب أن يكون على الأقل حرفين")
      .max(200, "الاسم طويل جدًا"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("صيغة البريد الإلكتروني غير صحيحة"),
    password: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

// ── Accept Invite ─────────────────────────────────────────────────────
export const acceptInviteSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "الاسم يجب أن يكون على الأقل حرفين")
      .max(200, "الاسم طويل جدًا"),
    password: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>;
