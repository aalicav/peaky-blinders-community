import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/Member";
import connectToDatabase from "@/db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";
import { GridFSBucket, MongoClient } from "mongodb";
import { Readable } from "stream";
import { File } from "buffer";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await req.formData();
    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        data[key] = value;
      } else {
        data[key] = value;
      }
    }

    // Verificar se já existe um membro com o mesmo e-mail
    const existingMember = await Member.findOne({ email: data.email });
    if (existingMember) {
      return NextResponse.json(
        { error: "Já existe um usuário com este e-mail" },
        { status: 400 }
      );
    }

    // Validar o comprimento do nome pessoal
    if (!data.personalName || data.personalName.length > 55) {
      return NextResponse.json(
        { error: "O nome pessoal não deve ter mais de 55 caracteres" },
        { status: 400 }
      );
    }

    // Definir valores padrão para coins e isJailed
    data.coins = 0;
    data.isJailed = false;

    // Salvar a imagem no GridFSBucket
    if (data.profileImage instanceof File) {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error("MONGODB_URI não está definido");
      }
      const client = await MongoClient.connect(mongoUri);
      const db = client.db();
      const bucket = new GridFSBucket(db);

      const file = data.profileImage;
      const buffer = await file.arrayBuffer();
      const fileStream = Readable.from(Buffer.from(buffer));

      const uploadStream = bucket.openUploadStream(file.name, {
        contentType: file.type,
      });

      await new Promise((resolve, reject) => {
        fileStream.pipe(uploadStream)
          .on("error", reject)
          .on("finish", resolve);
      });

      data.profileImageId = uploadStream.id.toString();
      delete data.profileImage;

      await client.close();
    }

    const newMember = await Member.create(data);
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    return NextResponse.json(
      { error: "Erro desconhecido ao criar membro" },
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