"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import MemberDetails from "@/components/MemberProfile/MemberDetails";
import MemberStats from "@/components/MemberProfile/MemberStats";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { IMember } from "@/models/Member";
import _ from "lodash";

const MotionBox = motion(Box as any);

interface DecodedToken {
  userId: string;
}

const MemberProfilePage = () => {
  const [member, setMember] = useState<IMember>();
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  const handleMemberUpdate = (updatedMember: Partial<IMember>) => {
    const memberToSave = _(member).mapValues((value, key) =>
      updatedMember[key as keyof IMember]
        ? updatedMember[key as keyof IMember]
        : value
    ).value();
    setMember(memberToSave);
  };

  useEffect(() => {
    const fetchMemberData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token) as DecodedToken;
        const response = await fetch(`/api/members/${decoded.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do membro");
        }

        const data = await response.json();
        setMember(data);
      } catch (error) {
        console.error("Erro ao buscar dados do membro:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do membro.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [router, toast]);

  if (isLoading) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.900"
      >
        <Spinner size="xl" color="turquoise.400" thickness="4px" />
      </Box>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <Box bg="gray.900" minHeight="100vh" pt="60px">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16} align="stretch">
          <MotionBox
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              as="h1"
              size="2xl"
              textAlign="center"
              mb={6}
              color="turquoise.300"
            >
              Seu Perfil
            </Heading>
          </MotionBox>

          <MemberDetails member={member} onMemberUpdate={handleMemberUpdate} />
          <MemberStats
            liveParticipations={member.liveParticipations.length}
            coins={member.coins}
            memberSince={member.createdAt}
            brasaoReceivedDate={member.brasaoReceivedDate}
          />
        </VStack>
      </Container>
    </Box>
  );
};

export default MemberProfilePage;
