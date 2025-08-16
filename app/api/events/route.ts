import { prisma } from "@/app/lib/prisma";
import { error } from "console";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(10, "Title Should be at least 10 characters"),
  description: z.string().optional(),
  closeAt: z.string(),
});

export async function POST(req: Request, res: NextResponse) {
  try {

    const { data: session, status } = useSession();

    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
        outcome: null,
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

export async function PUT (req: Request, res: NextResponse) {
  try {
   
    const body = await req.json();
    const { id } = body;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        orders: true,
        trades: true,
      },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    event.outcome = body.outcome;
    await prisma.event.update({
      where: { id },
      data: event,
    });
    await event.save();
    
    // const validated = eventSchema.safeParse(body);
    // if (!validated.success) {
    //   return NextResponse.json({ error: validated.error }, { status: 400 });
    // }

    return NextResponse.json(event);

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
