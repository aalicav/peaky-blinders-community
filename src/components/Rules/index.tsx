"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, XCircle, Users, Gift, MessageSquare, Clock } from "lucide-react";

const MotionBox = motion(Box as any);

const RulesPage = () => {
  const bgColor = "gray.900";
  const cardBgColor = "gray.800";
  const textColor = "white";
  const accentColor = "turquoise.400";

  const rules = [
    {
      icon: Users,
      title: "Participação na Live",
      content: "A live ocorre semanalmente, toda terça-feira, promovendo interação e novas amizades. Apenas membros da família Peaky Blinders, amigos e convidados autorizados pelo Fábio podem participar das janelas. É essencial que todos os membros apareçam pelo menos uma vez por mês, justificando ausências. Faltas não justificadas podem resultar em penalidades.",
    },
    {
      icon: Gift,
      title: "Pedir Presentes",
      content: "Não é permitido pedir presentes aos membros, convidados ou amigos, exceto na brincadeira da prisão. Anúncios sobre eventos pessoais, batalhas oficiais ou leilões são permitidos. Lembre-se: faça seu network, mas não durante a live da família. Não faça nada esperando retorno, faça de coração para evitar mágoas.",
    },
    {
      icon: MessageSquare,
      title: "Postagens e Comportamento",
      content: "No grupo, poste apenas links de lives de membros da família, leilões ou prisões que você esteja participando. Descreva claramente o motivo da postagem. É proibido falar mal da família. Em caso de problemas, converse com um ADM para resolução. Queremos conexões legítimas, não apenas por interesse. Comportamentos inadequados serão analisados e podem resultar em penalizações.",
    },
    {
      icon: Clock,
      title: "Regras da Prisão e Penalidades",
      content: "Presos devem comparecer nas lives ou avisar com antecedência. Faltas não justificadas aumentam a pena em 100 moedas. Penalidades por faltas variam de 1 hora na solitária até exclusão da família, dependendo do número de faltas. Cumprir as regras é essencial para evitar restrições na participação de eventos por 2 a 4 semanas.",
    },
  ];

  return (
    <Box bg={bgColor} minHeight="100vh" color={textColor} pt="60px">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16} align="stretch">
          {/* Seção de Introdução */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading as="h1" size="2xl" textAlign="center" mb={6} color={accentColor}>
              Regras da Família Peaky Blinders
            </Heading>
            <Text fontSize="xl" textAlign="center">
              Nossas regras existem para manter um ambiente harmonioso e produtivo para todos os membros da família. Leia com atenção e siga-as para garantir uma experiência positiva para todos.
            </Text>
          </MotionBox>

          {/* Seção de Regras */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              {rules.map((rule, index) => (
                <RuleCard
                  key={index}
                  icon={rule.icon}
                  title={rule.title}
                  content={rule.content}
                  bgColor={cardBgColor}
                  accentColor={accentColor}
                />
              ))}
            </SimpleGrid>
          </MotionBox>

          {/* Seção de Vídeo */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Heading as="h2" size="xl" textAlign="center" mb={8} color={accentColor}>
              Assista ao nosso vídeo explicativo
            </Heading>
            <Flex justifyContent="center">
              <Box
                as="video"
                controls
                width="100%"
                maxWidth="560px"
                height="auto"
                borderRadius="xl"
                boxShadow="xl"
                src="https://ia601801.us.archive.org/23/items/familia-peanky-blinders-tiktok-rules/WhatsApp%20Video%202024-08-24%20at%2017.08.37_d0c64c03.mp4"
              />
            </Flex>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

const RuleCard = ({ icon, title, content, bgColor, accentColor }: any) => (
  <VStack
    bg={bgColor}
    p={6}
    borderRadius="lg"
    boxShadow="0 4px 6px rgba(0, 255, 195, 0.1)"
    align="flex-start"
    spacing={4}
    transition="all 0.3s ease"
    _hover={{ transform: "translateY(-5px)", boxShadow: "0 6px 8px rgba(0, 255, 195, 0.2)" }}
  >
    <Flex align="center">
      <Icon as={icon} boxSize={8} color={accentColor} mr={4} />
      <Heading as="h3" size="md" color={accentColor}>
        {title}
      </Heading>
    </Flex>
    <Text>{content}</Text>
  </VStack>
);

export default RulesPage;
