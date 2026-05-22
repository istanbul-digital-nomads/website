import { getCurrentMember } from "@/lib/supabase/queries";
import { isHostRole } from "@/lib/member-roles";
import { DashboardNav, type DashboardNavItem } from "./dashboard-nav";

// Shared shell for the whole /dashboard area. Renders the persistent
// sub-nav above each page so Overview, Profile, Verification, and
// Payouts feel like one connected dashboard. When there's no signed-in
// member we render children alone - the pages handle the login redirect.

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: member } = await getCurrentMember();

  if (!member) return <>{children}</>;

  const showEarnings =
    isHostRole(member.member_type as never) || member.is_agent === true;

  const items: DashboardNavItem[] = [
    { key: "overview", href: "/dashboard" },
    { key: "profile", href: "/dashboard/profile" },
    { key: "account", href: "/dashboard/account" },
  ];
  if (showEarnings) {
    items.push({ key: "verification", href: "/dashboard/verify" });
    items.push({ key: "payouts", href: "/dashboard/payouts" });
  }

  return (
    <>
      <DashboardNav items={items} greetingName={member.display_name} />
      {children}
    </>
  );
}
