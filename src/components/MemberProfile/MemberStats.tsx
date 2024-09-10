import React from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box as any);

interface MemberStatsProps {
  liveParticipations: number;
  coins: number;
  memberSince: string;
}

const MemberStats: React.FC<MemberStatsProps> = ({ liveParticipations, coins, memberSince }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Stat bg="gray.800" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel color="gray.400">Participações em Lives</StatLabel>
          <StatNumber color="turquoise.300">{liveParticipations}</StatNumber>
          <StatHelpText color="gray.500">Total de participações</StatHelpText>
        </Stat>
        <Stat bg="gray.800" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel color="gray.400">Moedas</StatLabel>
          <StatNumber color="turquoise.300">{coins}</StatNumber>
          <StatHelpText color="gray.500">Saldo atual</StatHelpText>
        </Stat>
        <Stat bg="gray.800" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel color="gray.400">Membro desde</StatLabel>
          <StatNumber color="turquoise.300">{new Date(memberSince).toLocaleDateString()}</StatNumber>
          <StatHelpText color="gray.500">Data de ingresso</StatHelpText>
        </Stat>
      </SimpleGrid>
    </MotionBox>
  );
};

export default MemberStats;