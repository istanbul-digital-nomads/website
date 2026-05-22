import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEventById } from "@/lib/supabase/queries";
import { validateUpdateEvent } from "@/lib/validations";
import { notifyMembers } from "@/lib/notifications/notify";
import { SITE_URL } from "@/lib/seo";

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const { data, error } = await getEventById(params.id);

  if (error || !data) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = validateUpdateEvent(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { data, error } = await (supabase.from("events") as any)
    .update(result.data)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Notify attending members (going/maybe, excluding the organizer) when the
  // date or location changed.
  const r = result.data as Record<string, unknown>;
  const scheduleChanged =
    r.date !== undefined ||
    r.location_name !== undefined ||
    r.location_address !== undefined ||
    r.location_url !== undefined;
  if (scheduleChanged) {
    const sb = supabase as unknown as { from: (t: string) => any };
    const { data: rsvps } = await sb
      .from("rsvps")
      .select("member_id")
      .eq("event_id", params.id)
      .in("status", ["going", "maybe"])
      .neq("member_id", user.id);
    await notifyMembers(
      ((rsvps ?? []) as Array<{ member_id: string }>).map((x) => x.member_id),
      {
        actorId: user.id,
        category: "events",
        messageKey: "eventUpdated",
        values: { title: (data as { title: string }).title },
        cta: {
          labelKey: "ctaOpenEvent",
          url: `${SITE_URL}/events/${params.id}`,
        },
      },
    );
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("events").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { deleted: true } });
}
