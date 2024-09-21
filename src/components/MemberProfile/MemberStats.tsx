import React from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box as any);

interface MemberStatsProps {
  liveParticipations: number;
  coins: number;
  memberSince: Date | string;
  brasaoReceivedDate?: Date | string;
}

const MemberStats: React.FC<MemberStatsProps> = ({ liveParticipations, coins, memberSince, brasaoReceivedDate }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
        <Stat bg="gray.800" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel color="gray.400">Participações em Lives</StatLabel>
          <StatNumber color="turquoise.300">{liveParticipations}</StatNumber>
          <StatHelpText color="gray.500">Total de participações</StatHelpText>
        </Stat>
        <Stat bg="gray.800" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel color="gray.400">Moedas</StatLabel>
          <StatNumber color="turquoise.300">{coins}</StatNumber>
          <StatHelpText color="gray.500">Valor da fiança</StatHelpText>
        </Stat>
        <Stat bg="gray.800" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel color="gray.400">Brasão recebido em</StatLabel>
          <StatNumber color="turquoise.300">
            {brasaoReceivedDate ? new Date(brasaoReceivedDate).toLocaleDateString("pt-BR") : "Não recebido"}
          </StatNumber>
          <StatHelpText color="gray.500">Data de recebimento do brasão</StatHelpText>
        </Stat>
      </SimpleGrid>
    </MotionBox>
  );
};

export default MemberStats;