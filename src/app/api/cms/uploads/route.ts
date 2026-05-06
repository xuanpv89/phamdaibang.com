import { ensureCmsAccess } from "@/lib/cms-auth";
import { getWispSignedUploadUrl } from "@/lib/wisp-rest";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const accessResponse = await ensureCmsAccess();

  if (accessResponse) {
    return accessResponse;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const { uploadURL } = await getWispSignedUploadUrl(file.name);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file, file.name);

    const uploadResponse = await fetch(uploadURL, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Image upload failed.");
    }

    const uploadResult = (await uploadResponse.json()) as {
      result?: { variants?: string[] };
    };
    const imageUrl = uploadResult.result?.variants?.[0];

    if (!imageUrl) {
      throw new Error("Wisp did not return an image URL.");
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    );
  }
}
