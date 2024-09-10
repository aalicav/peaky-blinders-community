"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaUsers, FaLightbulb, FaRocket } from "react-icons/fa";

const MotionBox = motion(Box as any);

const AboutPage = () => {
  return (
    <Box bg="gray.900" minHeight="100vh" color="white" pt="60px">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16} align="stretch">
          {/* Seção de Introdução */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading as="h1" size="2xl" textAlign="center" mb={6}>
              Sobre a familia Peaky Blinders
            </Heading>
            <Text fontSize="xl" textAlign="center">
              Somos mais do que uma equipe, somos uma família que apoia criadores de conteúdo a brilhar nas lives do TikTok.
            </Text>
          </MotionBox>

          {/* Seção de Missão e Visão */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Heading as="h2" size="xl" mb={4}>
                Nossa Missão
              </Heading>
              <Text fontSize="lg">
                Ajudar novos talentos a crescerem e se destacarem em um dos ambientes digitais mais dinâmicos e competitivos do mundo.
              </Text>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Heading as="h2" size="xl" mb={4}>
                Nossa Visão
              </Heading>
              <Text fontSize="lg">
                Ser a principal agência de talentos para criadores de conteúdo do TikTok, reconhecida pela excelência e inovação.
              </Text>
            </MotionBox>
          </SimpleGrid>

          {/* Seção de Benefícios */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Heading as="h2" size="xl" textAlign="center" mb={8}>
              O que oferecemos
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              <BenefitCard
                icon={FaUsers}
                title="Comunidade Unida"
                description="Faça parte de uma família de criadores apaixonados e apoie-se mutuamente."
              />
              <BenefitCard
                icon={FaLightbulb}
                title="Workshops Exclusivos"
                description="Aprenda com os melhores em nossos workshops e treinamentos especializados."
              />
              <BenefitCard
                icon={FaRocket}
                title="Suporte Personalizado"
                description="Receba orientação individual para impulsionar sua carreira no TikTok."
              />
            </SimpleGrid>
          </MotionBox>

          {/* Call to Action */}
          <Flex justifyContent="center" mt={12}>
            <Button
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              size="lg"
              bg="turquoise.500"
              color="white"
              _hover={{ bg: "turquoise.600" }}
              px={8}
              fontSize="xl"
            >
              Quero Fazer Parte
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

const BenefitCard = ({ icon, title, description }: any) => (
  <VStack
    bg="gray.800"
    p={6}
    borderRadius="lg"
    boxShadow="md"
    align="center"
    spacing={4}
  >
    <Box as={icon} size="50px" color="turquoise.400" />
    <Heading as="h3" size="md" textAlign="center" color="turquoise.100">
      {title}
    </Heading>
    <Text textAlign="center">{description}</Text>
  </VStack>
);

export default AboutPage;