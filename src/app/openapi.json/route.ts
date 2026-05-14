import { NextResponse } from "next/server";

const SITE = "https://istanbulnomads.com";

export const dynamic = "force-static";

export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Istanbul Digital Nomads - public API",
      version: "1.0.0",
      description:
        "Read-only public endpoints exposed by istanbulnomads.com. Events are the only public data surface; everything else is rendered HTML or markdown.",
      contact: {
        name: "Istanbul Digital Nomads",
        url: `${SITE}/contact`,
      },
      license: {
        name: "Content usage signals live in robots.txt",
        url: `${SITE}/robots.txt`,
      },
    },
    servers: [{ url: SITE }],
    paths: {
      "/api/events": {
        get: {
          summary: "List published community events",
          description:
            "Returns events sorted by date ascending. Only `is_published = true` rows are included.",
          parameters: [
            {
              name: "type",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: ["meetup", "coworking", "workshop", "social"],
              },
              description: "Filter by event category.",
            },
            {
              name: "past",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["true", "false"] },
              description:
                "`true` returns events before now, `false` returns upcoming. Omit for all.",
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer", minimum: 1 },
              description: "Cap the number of rows returned.",
            },
          ],
          responses: {
            "200": {
              description: "Envelope containing the events array.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Event" },
                      },
                    },
                  },
                },
              },
            },
            "500": { $ref: "#/components/responses/Error" },
          },
        },
      },
      "/api/events/{id}": {
        get: {
          summary: "Fetch a single event by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": {
              description: "Envelope containing the event.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: { $ref: "#/components/schemas/Event" },
                    },
                  },
                },
              },
            },
            "404": { $ref: "#/components/responses/Error" },
          },
        },
      },
    },
    components: {
      schemas: {
        Event: {
          type: "object",
          required: [
            "id",
            "title",
            "description",
            "type",
            "date",
            "location_name",
            "is_published",
          ],
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string" },
            type: {
              type: "string",
              enum: ["meetup", "coworking", "workshop", "social"],
            },
            date: { type: "string", format: "date-time" },
            end_date: { type: ["string", "null"], format: "date-time" },
            location_name: { type: "string" },
            location_address: { type: ["string", "null"] },
            location_url: { type: ["string", "null"], format: "uri" },
            capacity: { type: ["integer", "null"], minimum: 1 },
            image_url: { type: ["string", "null"], format: "uri" },
            organizer_id: { type: "string", format: "uuid" },
            is_published: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        ErrorBody: {
          type: "object",
          required: ["error"],
          properties: { error: { type: "string" } },
        },
      },
      responses: {
        Error: {
          description: "Error response.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorBody" },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
