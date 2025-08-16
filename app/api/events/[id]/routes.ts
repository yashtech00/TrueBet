import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("id");
    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include : {
        orders: true,
        trades: true,
      },
    });
    return NextResponse.json(event);
  } catch (e) {
    console.error("Error fetching event:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    
  }
}