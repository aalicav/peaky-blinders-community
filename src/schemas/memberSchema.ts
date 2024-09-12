import * as Yup from "yup";
const FILE_SIZE = 2 * 1024 * 1024; // Tamanho máximo 5MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const memberSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  password: Yup.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .matches(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número")
    .required("Senha é obrigatória"),
  birthDate: Yup.date()
    .max(new Date(), "Data de nascimento não pode ser no futuro")
    .required("Data de nascimento é obrigatória"),
  whatsapp: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Número de WhatsApp inválido")
    .required("Número de WhatsApp é obrigatório"),
  tiktokProfile: Yup.string()
    .url("URL do perfil TikTok inválida")
    .required("Perfil TikTok é obrigatório"),
  tiktokUsage: Yup.string()
    .oneOf(["Trabalho", "Entreternimento"], "Uso do TikTok inválido")
    .required("Uso do TikTok é obrigatório"),
  belongedToOtherFamily: Yup.boolean(),
  isStreamedAndAgened: Yup.boolean(),
  profileImage: Yup.mixed()
    .required("Você precisa selecionar pelo menos um arquivo")
    .test(
      "is-fileList",
      "Você precisa enviar pelo menos um arquivo",
      (value: any) => {
        return value && value.length > 0;
      }
    )
    .test("fileSize", "O arquivo é muito grande. O tamanho máximo é 2MB", (value: any) => {
      return (
        value && Array.from(value).every((file: any) => file.size <= FILE_SIZE)
      );
    })
    .test("fileFormat", "Formato não suportado", (value: any) => {
      return (
        value &&
        Array.from(value).every((file: any) =>
          SUPPORTED_FORMATS.includes(file.type)
        )
      );
    }),
});

export default memberSchema;
