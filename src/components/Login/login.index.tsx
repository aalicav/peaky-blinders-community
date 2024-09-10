"use client";
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  password: Yup.string().required('Senha é obrigatória'),
});

export const LoginArea = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await LoginSchema.validate({ email, password }, { abortEarly: false });

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('token', data.token, { expires: 1 });
        router.push('/member-profile');
      } else {
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      } else {
        console.error('Erro no login:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center" bg="gray.800">
      <Box
        borderWidth={1}
        px={8}
        py={12}
        width="full"
        maxWidth="400px"
        borderRadius={8}
        textAlign="center"
        boxShadow="lg"
        bg="gray.700"
      >
        <VStack spacing={6}>
          <Heading color="turquoise.300">Entrar na sua conta</Heading>
          <Text color="gray.400">
            Ou <Link color="turquoise.300">comece seu teste de 14 dias</Link>
          </Text>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel color="gray.300">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="gray.600"
                  borderColor="gray.500"
                  color="white"
                  _hover={{ borderColor: "turquoise.300" }}
                  _focus={{ borderColor: "turquoise.300", boxShadow: "0 0 0 1px #00CED1" }}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel color="gray.300">Senha</FormLabel>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="gray.600"
                  borderColor="gray.500"
                  color="white"
                  _hover={{ borderColor: "turquoise.300" }}
                  _focus={{ borderColor: "turquoise.300", boxShadow: "0 0 0 1px #00CED1" }}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                colorScheme="turquoise"
                width="full"
                isLoading={isSubmitting}
              >
                Entrar
              </Button>
            </VStack>
          </form>
          <Link color="turquoise.300">Esqueceu sua senha?</Link>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginArea;
