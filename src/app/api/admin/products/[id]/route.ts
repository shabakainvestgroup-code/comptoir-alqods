import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { updateProduct } from "@/lib/productRepository";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const payload = await request.json();
  const product = await updateProduct(params.id, payload);
  return NextResponse.json({ ok: true, product });
}
