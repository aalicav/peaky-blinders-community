import React, { useEffect, useMemo, useRef, useState } from "react";
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
import DownloadOverlayImageButton from "../DownloadOverlayImageButton";
import EditProfileImageButton from "./EditProfileImageButton";
import { getClassImage } from "@/utils/classUtils";

const MotionBox = motion(Box as any);

interface MemberDetailsProps {
  member: IMember;
  onMemberUpdate: (updatedMember: Partial<IMember>) => void;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({
  member,
  onMemberUpdate,
}) => {
  const [profileImageId, setProfileImageId] = useState(member.profileImageId);

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

  const handleImageUpdate = (newImageId: string) => {
    setProfileImageId(newImageId);
    onMemberUpdate({ profileImageId: newImageId });
  };

  const getDaysInFamily = () => {
    const joinDate = new Date(member.brasaoReceivedDate ?? member.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        <DownloadOverlayImageButton
          memberName={member.tiktokUsername}
          memberClass={member.memberClass}
          profileImageId={member.profileImageId ?? ""}
          memberId={member._id}
          handleImageUpdate={handleImageUpdate}
        />{" "}
        <Text fontSize="2xl" fontWeight="bold" color="turquoise.300" mb={2}>
          {member.tiktokUsername}
        </Text>
        <Text fontSize="lg" color="gray.400" mb={2}>
          {member.personalName?.toUpperCase()}
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
          <HStack>
            <Text fontWeight="bold" color="gray.400">
              Dias na família:
            </Text>
            <Text color="turquoise.300" fontWeight="bold">
              {getDaysInFamily()}
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
