import { prisma } from "@/app/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(10, "Title Should be at least 10 characters"),
  description: z.string().optional(),
  closeAt: z.string(),
});

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();

    const validated = eventSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    const { title, description, closeAt } = validated.data;
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        closeAt: new Date(closeAt),
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (e) {
    console.error("Error creating event:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(events);
  } catch (e) {
    console.error("Errors fetching events:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
