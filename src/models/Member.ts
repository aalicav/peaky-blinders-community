import mongoose, { Schema, Document } from "mongoose";
import { encrypt, decrypt } from "@/utils/crypto";

export interface IMember {
  _id: string;
  email: string;
  birthDate: Date;
  whatsapp: string;
  tiktokProfile: string;
  password: string;
  tiktokUsage: string;
  belongedToOtherFamily: boolean;
  isStreamedAndAgened: boolean;
  tiktokUsername: string;
  tiktokProfilePicture: string;
  createdAt: Date;
  memberClass: string;
  liveParticipations: { date: Date }[];
  brasaoReceivedDate?: Date; // Nova propriedade opcional
  coins: number; // Nova propriedade
  isJailed: boolean; // Nova propriedade
  updateMemberClass: () => void;
  profileImageId?: string;
  profileImage: any;
  personalName: string; // Novo campo
}

const MemberSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    set: (v: string) => encrypt(v),
    get: (v: string) => decrypt(v),
  },
  birthDate: { type: Date, required: true },
  whatsapp: {
    type: String,
    required: true,
    set: (v: string) => encrypt(v),
    get: (v: string) => decrypt(v),
  },
  password: {
    type: String,
    required: true,
    set: (v: string) => encrypt(v),
    get: (v: string) => decrypt(v),
  },
  tiktokProfile: { type: String, required: true, maxlength: 900 }, // Atualizado para máximo de 900 caracteres
  tiktokUsage: { type: String, required: true },
  belongedToOtherFamily: { type: Boolean, required: true },
  isStreamedAndAgened: { type: Boolean, required: true },
  tiktokUsername: { type: String },
  tiktokProfilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
  memberClass: {
    type: String,
    enum: ["Beginner", "Intermediário", "Avançado"],
  },
  liveParticipations: [{ date: { type: Date } }],
  brasaoReceivedDate: { type: Date, optional: true }, // Nova propriedade opcional
  coins: { type: Number, default: 0 }, // Nova propriedade
  isJailed: { type: Boolean, default: false }, // Nova propriedade
  profileImageId: { type: String },
  personalName: { type: String, required: true, maxlength: 55 }, // Novo campo
});

// Garantir que os campos criptografados sejam descriptografados ao recuperar
MemberSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.email = decrypt(ret.email);
    ret.whatsapp = decrypt(ret.whatsapp);
    return ret;
  },
});

// Função para atualizar a classe do membro
MemberSchema.methods.updateMemberClass = function () {
  const daysSinceJoining =
    (Date.now() - this.brasaoReceivedDate.getTime()) / (1000 * 3600 * 24);
  if (daysSinceJoining <= 90) {
    this.memberClass = "Beginner";
  } else if (daysSinceJoining <= 365) {
    this.memberClass = "Intermediário";
  } else {
    this.memberClass = "Avançado";
  }
};

MemberSchema.pre("save", function (this: IMember, next) {
  this.updateMemberClass();
  next();
});

export default mongoose.models.Member ||
  mongoose.model<IMember>("Member", MemberSchema);
