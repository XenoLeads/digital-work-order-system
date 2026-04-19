import { NextResponse } from "next/server";
import { deactivateAsset } from "@/lib/assets";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
  }

  const parameters = await params
  if (!parameters.id) NextResponse.json({ success: false, message: "Invalid Id" })
  const deactivatedAsset = await deactivateAsset(parameters.id)
  return NextResponse.json({ success: true, data: deactivatedAsset })
}