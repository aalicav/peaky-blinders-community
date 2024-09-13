"use client";

import { useState, useRef } from "react";
import {
  ButtonGroup,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  FormHelperText,
  RadioGroup,
  Radio,
  Stack,
  Text,
  Box,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import {
  Control,
  Controller,
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
  UseFormGetValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import axios from "axios";
import { CheckCircleIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import yup from "yup";
import memberSchema from "@/schemas/memberSchema";
import { IMember } from "@/models/Member";
import { FaUpload } from "react-icons/fa";

// Defina o esquema de validação com Yup
const inputFocusLight = {
  borderWidth: "1px",
  borderColor: "turquoise.300",
  boxShadow: "#1b5943 0px 7px 27px 0px",
};

const Form1 = ({
  register,
  errors,
  control,
  getValues,
}: {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<IMember>;
  control: Control<FormValues>;
  getValues: UseFormGetValues<FormValues>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const toast = useToast();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const validateConfirmPassword = () => {
    const password = getValues("password");
    if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem");
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  return (
    <Flex color="turquoise.300" flexDirection="column" gap="20px">
      <FormControl isInvalid={!!errors.personalName}>
        <FormLabel htmlFor="personalName" fontWeight={"normal"}>
          Nome Pessoal
        </FormLabel>
        <Input
          id="personalName"
          type="text"
          placeholder="Digite seu nome completo"
          _focus={inputFocusLight}
          {...register("personalName")}
        />
        <FormHelperText color="red.500">
          {errors.personalName?.message}
        </FormHelperText>
      </FormControl>

      <FormControl isInvalid={!!errors.email}>
        <FormLabel htmlFor="email" fontWeight={"normal"}>
          Coloque seu E-mail
        </FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu e-mail"
          _focus={inputFocusLight}
          {...register("email")}
        />
        <FormHelperText color="red.500">{errors.email?.message}</FormHelperText>
      </FormControl>

      <FormControl isInvalid={!!errors.password}>
        <FormLabel htmlFor="password" fontWeight={"normal"}>
          Senha
        </FormLabel>
        <InputGroup>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            _focus={inputFocusLight}
            {...register("password")}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleTogglePassword}>
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText color="red.500">
          {errors.password?.message}
        </FormHelperText>
      </FormControl>

      <FormControl isInvalid={!!confirmPasswordError}>
        <FormLabel htmlFor="confirmPassword" fontWeight={"normal"}>
          Confirmar Senha
        </FormLabel>
        <InputGroup>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirme sua senha"
            _focus={inputFocusLight}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={validateConfirmPassword}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleTogglePassword}>
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText color="red.500">{confirmPasswordError}</FormHelperText>
      </FormControl>

      <Flex
        alignItems="center"
        gap="10px"
        direction={{ base: "column", lg: "row" }}
      >
        <FormControl mt="2%" isInvalid={!!errors.birthDate}>
          <FormLabel htmlFor="birthDate" fontWeight={"normal"}>
            Data de Nascimento
          </FormLabel>
          <Input
            id="birthDate"
            type="date"
            _focus={inputFocusLight}
            {...register("birthDate")}
            colorScheme="dark"
          />
          <FormHelperText color="red.500">
            {errors.birthDate?.message}
          </FormHelperText>
        </FormControl>

        <FormControl mt="2%" isInvalid={!!errors.whatsapp}>
          <FormLabel htmlFor="whatsapp" fontWeight={"normal"}>
            Informe seu WhatsApp
          </FormLabel>
          <Controller
            control={control}
            name="whatsapp"
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                countrySelectorStyleProps={{
                  style: {
                    width: "max-content",
                  },
                }}
                style={{ width: "fit-content" }}
                className="phone-input"
                value={value}
                onChange={(phone) => {
                  onChange(phone);
                }}
                defaultCountry="br"
                placeholder="Número do whatsapp"
              />
            )}
          />{" "}
          <FormHelperText>
            {errors.whatsapp && errors.whatsapp.message}
          </FormHelperText>
        </FormControl>
      </Flex>
    </Flex>
  );
};

const Form2 = ({
  register,
  errors,
  control,
}: {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<IMember>;
  control: Control<FormValues>;
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  return (
    <Flex direction="column" color="turquoise.400">
      <FormControl isInvalid={!!errors.tiktokProfile}>
        <FormLabel htmlFor="tiktokProfile" fontWeight={"normal"}>
          Copie aqui o link do seu perfil do Tiktok
        </FormLabel>
        <Input
          id="tiktokProfile"
          placeholder="Link do seu perfil do Tiktok"
          _focus={inputFocusLight}
          {...register("tiktokProfile")}
        />
        <FormHelperText color="red.500">
          {errors.tiktokProfile?.message}
        </FormHelperText>
      </FormControl>

      <FormControl mt="2%" isInvalid={!!errors.tiktokUsage}>
        <FormLabel fontWeight={"normal"}>
          Usa o TikTok para trabalho ou entretenimento?
        </FormLabel>
        <Controller
          control={control}
          name="tiktokUsage"
          render={({ field: { onChange, value } }) => (
            <RadioGroup onChange={onChange} value={value}>
              <Stack direction="column">
                <Radio value="Trabalho" colorScheme="turquoise">
                  Trabalho
                </Radio>
                <Radio value="Entreternimento" colorScheme="turquoise">
                  Entreternimento
                </Radio>
              </Stack>
            </RadioGroup>
          )}
        />
        <FormHelperText color="red.500">
          {errors.tiktokUsage?.message}
        </FormHelperText>
      </FormControl>

      <FormControl mt="2%" isInvalid={!!errors.profileImage}>
        <FormLabel htmlFor="profileImage" fontWeight={"normal"}>
          Imagem de Perfil
        </FormLabel>
        <Controller
          control={control}
          name="profileImage"
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  onChange(e.target.files);
                  handleFileChange(e);
                }}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Button
                leftIcon={<FaUpload />}
                onClick={() => fileInputRef.current?.click()}
                colorScheme="turquoise"
                variant="outline"
                _hover={{ bg: "turquoise.100", color: "turquoise.700" }}
              >
                Escolher arquivo
              </Button>
            </>
          )}
        />
        {fileName && (
          <Text mt={2} fontSize="sm" color="turquoise.300">
            Arquivo selecionado: {fileName}
          </Text>
        )}
        <FormHelperText color="red.500">
          {errors.profileImage?.message?.toString()}
        </FormHelperText>
      </FormControl>
    </Flex>
  );
};

const Form3 = ({
  register,
  errors,
  control,
}: {
  register: UseFormRegister<any>;
  errors: FieldErrors<IMember>;
  control: Control<any>;
}) => {
  return (
    <Flex
      direction="column"
      color="turquoise.400"
      textShadow="0px, 4px, 30px, #1b5943"
    >
      <SimpleGrid columns={1} spacing={6}>
        <FormControl mt="2%" isInvalid={!!errors.belongedToOtherFamily}>
          <FormLabel fontWeight={"normal"}>
            Já pertenceu a alguma outra Familia no TikTok?
          </FormLabel>
          <Controller
            control={control}
            name="belongedToOtherFamily"
            render={({ field: { onChange, value } }) => (
              <RadioGroup onChange={onChange} value={String(value)}>
                <Stack direction="column">
                  <Radio value="true" colorScheme="turquoise">
                    Sim
                  </Radio>
                  <Radio value="false" colorScheme="turquoise">
                    Não
                  </Radio>
                </Stack>
              </RadioGroup>
            )}
          />
          <FormHelperText color="red.500">
            {errors.belongedToOtherFamily?.message}
          </FormHelperText>
        </FormControl>

        <FormControl mt="2%" isInvalid={!!errors.isStreamedAndAgened}>
          <FormLabel fontWeight={"normal"}>
            Se for Streamer, é agenciado?
          </FormLabel>
          <Controller
            control={control}
            name="isStreamedAndAgened"
            render={({ field: { onChange, value } }) => (
              <RadioGroup onChange={onChange} value={String(value)}>
                <Stack direction="column">
                  <Radio value={"true"} colorScheme="turquoise">
                    Sim
                  </Radio>
                  <Radio value={"false"} colorScheme="turquoise">
                    Não
                  </Radio>
                </Stack>
              </RadioGroup>
            )}
          />
          <FormHelperText color="red.500">
            {errors.isStreamedAndAgened?.message}
          </FormHelperText>
        </FormControl>

        <FormControl mt="2%" isInvalid={!!errors.brasaoReceivedDate}>
          <FormLabel htmlFor="brasaoReceivedDate" fontWeight={"normal"}>
            Data de recebimento do brasão da família
          </FormLabel>
          <Input
            id="brasaoReceivedDate"
            type="date"
            _focus={inputFocusLight}
            {...register("brasaoReceivedDate")}
          />
          <FormHelperText color="red.500">
            {errors.brasaoReceivedDate?.message}
          </FormHelperText>
        </FormControl>
      </SimpleGrid>
    </Flex>
  );
};

const Form4 = () => {
  return (
    <Flex direction="column" color="turquoise.400" gap={4}>
      <Text fontSize="lg" fontWeight="bold">
        Grupos da Família
      </Text>
      <Text>
        É importante entrar nos dois grupos abaixo. Clique nos botões para
        acessar os links.
      </Text>
      <Button rel="noopener noreferrer" colorScheme="whatsapp">
        <Link
          href="https://chat.whatsapp.com/JDbFMZWsrSy48jb5JxoyBr"
          target="_blank"
        ></Link>
        Grupo de RECADOS IMPORTANTES
      </Button>
      <Text fontSize="sm">
        Este grupo é apenas para recados importantes, não há conversas gerais.
      </Text>
      <Button rel="noopener noreferrer" colorScheme="whatsapp">
        <Link
          target="_blank"
          href="https://chat.whatsapp.com/CIqnvDtwxf6AdX1ac8XcSb"
        >
          Grupo Geral WhatsApp
        </Link>
      </Button>
      <Text fontSize="sm">
        Este é o grupo geral para conversas e interações.
      </Text>
    </Flex>
  );
};

type FormValues = yup.InferType<typeof memberSchema>;

export default function Multistep() {
  const {
    handleSubmit,
    register,
    trigger,
    control,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({
    resolver: yupResolver(memberSchema),
  });
  const toast = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    { title: "Informações Pessoais", description: "E-mail e contato" },
    { title: "Perfil TikTok", description: "Seu perfil na plataforma" },
    { title: "Informações Adicionais", description: "Detalhes finais" },
    { title: "Grupos da Família", description: "Links importantes" },
  ];

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const formData = new FormData();
      (Object.keys(data) as Array<keyof FormValues>).forEach((key) => {
        if (key === "profileImage" && data[key] instanceof FileList) {
          formData.append(key, data[key][0]);
        } else if (data[key] !== undefined) {
          formData.append(key, String(data[key]));
        }
      });

      const response = await axios.post("/api/members", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 400) {
        throw new Error(response.data?.error);
      }
      setIsSubmitted(true);
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Suas informações foram recebidas. Obrigado!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro. Por favor, tente novamente.";
      toast({
        title: "Erro ao enviar formulário.",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleNext = async () => {
    const fields: any[] = [
      ["email", "birthDate", "whatsapp", "password", "personalName"],
      ["tiktokProfile", "tiktokUsage", "profileImage"],
      ["belongedToOtherFamily", "isStreamedAndAgened", "brasaoReceivedDate"],
    ];

    const isValid = await trigger(fields[activeStep]);
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const MotionBox = motion(Box as any);

  return (
    <>
      <Flex
        flexDirection="column"
        width={{ base: "90%", md: "70%", lg: "40%" }}
        p={6}
        m="10px auto"
        color="#ffffff"
        as="form"
        onSubmit={handleSubmit(onSubmit, (errors) => {
          toast({
            title: "Erro ao enviar formulário.",
            description: Object.values(errors).join(", "),
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        })}
        background="rgba(9, 34, 42, 0.7)"
        borderRadius="16px"
        shadow="0px 4px 30px #1b5943"
        backdropFilter="blur(10px)"
        style={{ WebkitBackdropFilter: "blur(10px)" }}
        border="1px solid rgba(9, 34, 42, 0.5)"
        transition="all 0.3s ease-in-out"
        _hover={{
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 40px #1b5943",
        }}
        maxHeight="80vh"
        overflowY="auto"
      >
        {isSubmitted ? (
          <Flex direction="column" align="center" justify="center" py={10}>
            <CheckCircleIcon w={20} h={20} color="green.500" />
            <Text fontSize="2xl" fontWeight="bold" mt={4} textAlign="center">
              Formulário enviado com sucesso!
            </Text>
          </Flex>
        ) : (
          <>
            <Flex justify="center" align="center" mb={8}>
              {steps.map((step, index) => (
                <MotionBox
                  key={index}
                  initial={{ scale: 0.9 }}
                  animate={{
                    scale: activeStep === index ? 1 : 0.9,
                    opacity: activeStep === index ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                  mx={2}
                >
                  {activeStep === index ? (
                    <Box>
                      <Text fontWeight="bold" color="turquoise.300">
                        {index + 1}. {step.title}
                      </Text>
                      <Text fontSize="sm" color="turquoise.200">
                        {step.description}
                      </Text>
                    </Box>
                  ) : (
                    <Box
                      w="10px"
                      h="10px"
                      borderRadius="full"
                      bg={index < activeStep ? "turquoise.400" : "gray.300"}
                      boxShadow={
                        index < activeStep ? "0 0 5px turquoise" : "none"
                      }
                    />
                  )}
                </MotionBox>
              ))}
            </Flex>
            {activeStep === 0 && (
              <Form1
                register={register}
                errors={errors}
                control={control}
                getValues={getValues}
              />
            )}
            {activeStep === 1 && (
              <Form2 register={register} errors={errors} control={control} />
            )}
            {activeStep === 2 && (
              <Form3 register={register} errors={errors} control={control} />
            )}
            {activeStep === 3 && <Form4 />}
            <ButtonGroup mt="5%" w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    onClick={() => setActiveStep((prev) => prev - 1)}
                    isDisabled={activeStep === 0}
                    colorScheme="teal"
                    variant="solid"
                    w="7rem"
                    mr="5%"
                    _hover={{ bg: "teal.600" }}
                  >
                    Voltar
                  </Button>
                  {activeStep !== steps.length - 1 && (
                    <Button
                      w="7rem"
                      isDisabled={activeStep === steps.length - 1}
                      onClick={handleNext}
                      colorScheme="teal"
                      variant="outline"
                      _hover={{ bg: "teal.100", color: "teal.700" }}
                    >
                      Próximo
                    </Button>
                  )}
                </Flex>
                {activeStep === steps.length - 1 && (
                  <Button
                    w="7rem"
                    colorScheme="red"
                    variant="solid"
                    type="submit"
                    _hover={{ bg: "red.600" }}
                  >
                    Enviar
                  </Button>
                )}
              </Flex>
            </ButtonGroup>
          </>
        )}
      </Flex>
    </>
  );
}
