import * as yup from "yup";

// Schema de validação com yup para Member
export const memberSchema = yup.object().shape({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  birthDate: yup.date().required("Data de nascimento é obrigatória"),
  whatsapp: yup.string().required("WhatsApp é obrigatório"),
  tiktokProfile: yup
    .string()
    .url("Link inválido")
    .required("Link do perfil do Tiktok é obrigatório"),
  tiktokUsage: yup.string().required("Este campo é obrigatório"),
  belongedToOtherFamily: yup.string().required("Este campo é obrigatório"),
  isStreamedAndAgened: yup.string().required("Este campo é obrigatório"),
  brasaoReceivedDate: yup.date().required("Data de recebimento do brasão é obrigatória"),
});

// Tipo inferido para Member
export type Member = yup.InferType<typeof memberSchema>;

// Definição do enum MemberClass
export enum MemberClass {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

// Definição do tipo GetMembersResponse
export type GetMembersResponse = {
  data: {
    email: string;
    birthDate: string;
    username: string;
    whatsapp: string;
    tiktokProfile: string;
    tiktokUsage: TiktokUsage;
    belongedToOtherFamily: boolean;
    isStreamedAndAgened: boolean;
    joinedDate: string; // Data de quando o membro entrou
    livesParticipated: number; // Quantidade de lives que o membro participou
    memberClass: MemberClass; // Classe de membro baseada no tempo de inscrição
    profileImage: string; // URL para a imagem de perfil do membro
  }[];
};

export enum TiktokUsage {
  Entreternimento = "Entreternimento",
  Profissional = "Entreternimento",
}

// Função para calcular a classe do membro com base na data de inscrição
export const calculateMemberClass = (joinedDate: string): MemberClass => {
  const today = new Date();
  const joinDate = new Date(joinedDate);
  const diffTime = Math.abs(today.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // diferença em dias

  if (diffDays <= 90) {
    return MemberClass.BEGINNER;
  } else if (diffDays <= 365) {
    return MemberClass.INTERMEDIATE;
  } else {
    return MemberClass.ADVANCED;
  }
};
