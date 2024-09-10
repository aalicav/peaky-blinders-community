import { Flex, Heading, Text } from "@chakra-ui/react";
import RegistrationForm from "../Form";

export const HomePage = () => {
  return (
    <Flex
      direction={{ base: "column", md: "row", lg: "row", xl: "row" }}
      alignItems="center"
      py={{ base: 20, lg: 8 }}
      backgroundImage="background.png"
      backgroundSize="cover"
      backgroundColor="rgba(0, 0, 0, 0.6)"
      backgroundPosition="top"
      height="100vh"
      backgroundBlendMode="overlay"
      width="100vw"
      px={{ base: 4, lg: 8 }}
    >
      <Flex
        direction="column"
        justify="center"
        height="fit-content"
        width={{ base: "100%", lg: "50%" }}
        px={8}
        mb={{ base: 8, lg: 0 }} // Adding margin-bottom on smaller screens
      >
        <Heading
          as="h1"
          fontSize={{ base: "1.875rem", md: "xxx-large" }}
          color="accent.300"
          textShadow="0px 4px 30px #1b5943"
        >
          Faça parte da familia Peaky Blinders
        </Heading>
        <Text color="white" fontSize={{ base: "lg", md: "xl" }}>
          Junte-se à família Peaky Blinders e faça parte dessa jornada
          incrível no tiktok
        </Text>
      </Flex>
      <RegistrationForm />
    </Flex>
  );
};
