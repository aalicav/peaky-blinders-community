import React from "react";
import {
  Box,
  Flex,
  Text,
  Badge,
  Avatar,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IMember } from "@/models/Member";

const MotionBox = motion(Box as any);

interface MemberDetailsProps {
  member: IMember;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ member }) => {
  const getBadgeColor = (memberClass: string) => {
    switch (memberClass.toLowerCase()) {
      case "beginner":
        return "green";
      case "intermediário":
        return "blue";
      case "avançado":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        direction="column"
        align="center"
        bg="gray.800"
        p={6}
        borderRadius="lg"
        boxShadow="xl"
      >
        <Avatar
          size="2xl"
          name={member.tiktokUsername}
          src={`/api/members/image/${member.profileImageId}`}
          mb={4}
        />
        <Text fontSize="2xl" fontWeight="bold" color="turquoise.300" mb={2}>
          {member.tiktokUsername}
        </Text>
        <Badge
          colorScheme={getBadgeColor(member.memberClass)}
          fontSize="md"
          mb={4}
        >
          {member.memberClass}
        </Badge>
        <VStack spacing={3} align="start" w="100%">
          <HStack>
            <Text fontWeight="bold" color="gray.400">
              Email:
            </Text>
            <Text color="white">{member.email}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold" color="gray.400">
              WhatsApp:
            </Text>
            <Text color="white">{member.whatsapp}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold" color="gray.400">
              Moedas:
            </Text>
            <Text color="turquoise.300" fontWeight="bold">
              {member.coins}
            </Text>
          </HStack>
          <Text fontWeight="bold" color="gray.400">
            Participações em Lives:
          </Text>
          <Text color="white">{member.liveParticipations.length}</Text>
          <HStack>
            <Text fontWeight="bold" color="gray.400">
              Status:
            </Text>
            <Badge colorScheme={member.isJailed ? "red" : "green"}>
              {member.isJailed ? "Preso" : "Livre"}
            </Badge>
          </HStack>
        </VStack>
      </Flex>
    </MotionBox>
  );
};

export default MemberDetails;
