import { NextResponse } from "next/server";
import { getPromotions } from "@/lib/promotions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const placement = url.searchParams.get("placement") || "";
  const promotions = await getPromotions({ activeOnly: true, placement });

  return NextResponse.json({
    ok: true,
    promotions
  });
}
