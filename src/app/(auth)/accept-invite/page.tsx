import type { Metadata } from "next";
import { AcceptInviteClient } from "@/features/auth/components/AcceptInviteClient";

export const metadata: Metadata = {
  title: "قبول الدعوة",
  description: "فعّل حسابك وانضم إلى فريق إدارة الصالة.",
};

interface AcceptInvitePageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function AcceptInvitePage({ searchParams }: AcceptInvitePageProps) {
  const { token } = await searchParams;

  return <AcceptInviteClient token={token} />;
}
