import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/Member";
import connectToDatabase from "@/db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";
import { scrapeTikTokProfile } from "@/utils/getProfilePhoto";

export async function POST(req: NextRequest) {
  // A rota POST não precisa de autenticação
  console.log("Função POST chamada");
  try {
    await connectToDatabase();
    console.log("Conectado ao banco de dados");
    const data = await req.json();

    // Buscar informações do TikTok
    if (data.tiktokProfile) {
      try {
        console.log(data.tiktokProfile);
        const userPhoto = await scrapeTikTokProfile(data.tiktokProfile);
        console.log(userPhoto)
        data.tiktokUsername = data.tiktokProfile.split("@")[1];
        if (userPhoto) {
          data.tiktokProfilePicture = userPhoto;
        }
      } catch (error) {
        console.error("Erro ao buscar informações do TikTok:", error);
      }
    }

    // Definir valores padrão para coins e isJailed
    data.coins = data.coins || 0;
    data.isJailed = data.isJailed || false;

    const newMember = await Member.create(data);
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    return NextResponse.json(
      { error: "Erro ao criar membro" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const authResponse = authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const members = await Member.find({});
    return NextResponse.json(members);
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    return NextResponse.json(
      { error: "Erro ao buscar membros" },
      { status: 500 }
    );
  }
}

// Adicione outras funções (PUT, DELETE) conforme necessário, usando o mesmo padrão do GET
