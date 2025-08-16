import { prisma } from "@/app/lib/prisma";
import { RedisPub } from "@/app/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }
    const orders = await prisma.order.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (e) {
    console.error("Error fetching orders:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, eventId, side, price } = body;
    if (!userId || !eventId || !side || price == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrder = await prisma.order.create({
      data: { userId, eventId, side, price },
    });

    const oppositeSide = side === "YES" ? "NO" : "YES";

    const matchingOrder = await prisma.order.findFirst({
      where: {
        eventId,
        side: oppositeSide,
        price,
      },
      orderBy: { createdAt: "asc" },
    });

    if (matchingOrder) {
      const trade = await prisma.trade.create({
        data: {
          eventId,
          buyerId: side === "YES" ? userId : matchingOrder.userId,
          sellerId: side === "YES" ? matchingOrder.userId : userId,
          price,
        },
      });
      await prisma.order.delete({ where: { id: newOrder.id } });
        await prisma.order.delete({ where: { id: matchingOrder.id } });
        
        await RedisPub.publish("trade-updates",JSON.stringify({type:"TRADE",trade}))

      return NextResponse.json({ message: "Trade created" ,trade});
      }
       await RedisPub.publish("order_updates", JSON.stringify({ type: "ORDER", order: newOrder }));


    return NextResponse.json(newOrder);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
