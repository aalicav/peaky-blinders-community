'use client'

import { Button, Link as ChakraLink, Box, Text } from "@chakra-ui/react";
import { FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box as any);

export function TikTokButton() {
  return (
    <MotionBox
      position="fixed"
      bottom="20px"
      right="20px"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
    >
      <ChakraLink href="https://www.tiktok.com/@familiapeaky.blinders" isExternal>
        <Button
          leftIcon={<FaTiktok />}
          colorScheme="pink"
          variant="solid"
          size="lg"
          borderRadius="full"
          boxShadow="lg"
          position="relative"
          overflow="hidden"
        >
          <Box as="span" display="inline-block" mr={2}>
            TikTok
          </Box>
          <Text
            as={motion.span}
            position="absolute"
            top="0"
            left="100%"
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="pink.500"
            initial={{ x: "100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: "0.3s" }}
          >
            Siga a família no TikTok
          </Text>
        </Button>
      </ChakraLink>
    </MotionBox>
  );
}