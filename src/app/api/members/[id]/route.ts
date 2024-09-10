import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/Member";
import Tiktok from "@tobyg74/tiktok-api-dl";
import connectToDatabase from "@/db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authResponse = authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const member = await Member.findById(params.id);
    if (!member) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }
    const memberWithDateBirthDate = {
      ...member.toJSON(),
      birthDate: new Date(member.birthDate),
      brasaoReceivedDate: member.brasaoReceivedDate ? new Date(member.brasaoReceivedDate) : null
    };
    return NextResponse.json(memberWithDateBirthDate);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar membro" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authResponse = authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const data = await req.json();
    const currentMember = await Member.findById(params.id);

    if (data.tiktokProfile && data.tiktokProfile !== currentMember?.tiktokProfile) {
      try {
        const tiktokProfile = data.tiktokProfile.split('@').pop();
        const userInfo = await Tiktok.Search(tiktokProfile, {
          type: "user",
          page: 1,
        });

        if (userInfo.status === "success" && userInfo.result) {
          data.tiktokUsername = userInfo?.result[0]?.nickname;
          data.tiktokProfilePicture = userInfo?.result[0]?.avatarThumb;
        }
      } catch (error) {
        console.error("Erro ao buscar informações do TikTok:", error);
      }
    }

    const updatedMember = await Member.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedMember) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }
    return NextResponse.json(updatedMember);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar membro" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authResponse = authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const deletedMember = await Member.findByIdAndDelete(params.id);
    if (!deletedMember) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Membro excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir membro" }, { status: 500 });
  }
}