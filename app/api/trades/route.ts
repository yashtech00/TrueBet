import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const eventId = searchParams.get("eventId");

        if (!userId && !eventId) {
            return NextResponse.json(
                { error: "UserId or eventId is required" },
                {status:400}
            )
        };
        const whereClause: any = {};
        if (userId) {
            whereClause.OR = [{ buyerId: userId }, {sellerId: userId} ]
        }
        if (eventId) {
            whereClause.eventId = eventId;
        }
        const trades = await prisma.trade.findMany({
            where: whereClause,
            include: {
                buyer: { select: { id: true, name: true } },
                seller: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(trades);
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Internal server error" },
            {status:500}
        )
        
    }
}