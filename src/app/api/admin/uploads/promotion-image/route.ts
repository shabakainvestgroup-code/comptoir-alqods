import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { env } from "@/lib/env";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function safeFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "jpg";
  const base = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "promotion"}-${Date.now()}.${extension}`;
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return NextResponse.json({ ok: false, message: "Supabase n'est pas configuré." }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Aucun fichier reçu." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ ok: false, message: "Format refusé. Utilisez JPG, PNG ou WebP." }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ ok: false, message: "Image trop lourde. Taille maximale : 2 Mo." }, { status: 400 });
  }

  const path = `promotions/${safeFileName(file.name)}`;
  const uploadResponse = await fetch(`${env.supabaseUrl}/storage/v1/object/${env.supabaseStorageBucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: env.supabaseServiceRoleKey,
      Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
      "Content-Type": file.type,
      "x-upsert": "false"
    },
    body: file
  });

  if (!uploadResponse.ok) {
    return NextResponse.json({ ok: false, message: "Upload impossible. Vérifiez Supabase Storage." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    url: `${env.supabaseUrl}/storage/v1/object/public/${env.supabaseStorageBucket}/${path}`
  });
}
