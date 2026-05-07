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

  return `${base || "produit"}-${Date.now()}.${extension}`;
}

async function ensureBucket() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return;

  await fetch(`${env.supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: env.supabaseServiceRoleKey,
      Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: env.supabaseStorageBucket,
      name: env.supabaseStorageBucket,
      public: true,
      file_size_limit: MAX_IMAGE_SIZE,
      allowed_mime_types: ALLOWED_TYPES
    })
  }).catch(() => undefined);
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return NextResponse.json({ ok: false, message: "Supabase n’est pas configuré." }, { status: 500 });
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

  await ensureBucket();

  const path = `products/${safeFileName(file.name)}`;
  const uploadUrl = `${env.supabaseUrl}/storage/v1/object/${env.supabaseStorageBucket}/${path}`;
  const uploadResponse = await fetch(uploadUrl, {
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
    return NextResponse.json({ ok: false, message: "Upload impossible. Vérifiez le bucket Supabase Storage." }, { status: 500 });
  }

  const publicUrl = `${env.supabaseUrl}/storage/v1/object/public/${env.supabaseStorageBucket}/${path}`;

  return NextResponse.json({
    ok: true,
    url: publicUrl,
    maxSizeMb: 2,
    allowedTypes: ["JPG", "PNG", "WebP"]
  });
}
