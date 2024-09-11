import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/utils/jwt";
import Member from "@/models/Member";
import connectToDatabase from "@/db/mongo";

export const maxDuration = 5

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const member = await Member.findOne({
      email: email,
      password: password,
    });
    if (!member) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const isPasswordValid = member.password === password;
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = generateToken({
      userId: member._id,
      email: member.email,
      roles: member.roles || ["member"],
    });

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
