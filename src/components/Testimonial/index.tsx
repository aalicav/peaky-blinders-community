"use client"
import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Container,
  Button,
  Icon,
  Avatar,
  Spinner,
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  _id: string;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
}

const MotionBox = motion(Box as any);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <MotionBox
      bg="gray.800"
      p={8}
      rounded="xl"
      shadow="xl"
      borderWidth="1px"
      borderColor="gray.700"
      maxW="400px"
      mx="auto"
      textAlign="center"
    >
      <Avatar size="xl" name={testimonial.author} mb={4} />
      <Text fontSize="xl" fontWeight="bold" mb={2} color="turquoise.300">
        {testimonial.author}
      </Text>
      <Text fontSize="md" color="gray.200" mb={4}>
        &ldquo;{testimonial.content}&rdquo;
      </Text>
      <Flex justify="center" align="center" mb={2}>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            as={Star}
            color={i < testimonial.rating ? 'turquoise.400' : 'gray.600'}
            fill={i < testimonial.rating ? 'turquoise.400' : 'gray.600'}
            w={4}
            h={4}
          />
        ))}
      </Flex>
      <Text fontSize="sm" color="gray.500">
        {new Date(testimonial.createdAt).toLocaleDateString()}
      </Text>
    </MotionBox>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{ ...style, display: "block", left: "-30px" }}
      onClick={onClick}
    >
      <Icon as={ChevronLeft} w={8} h={8} color="turquoise.400" />
    </Box>
  );
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{ ...style, display: "block", right: "-30px" }}
      onClick={onClick}
    >
      <Icon as={ChevronRight} w={8} h={8} color="turquoise.400" />
    </Box>
  );
};

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const [sliderRef, setSliderRef] = useState<Slider | null>(null);

  const fetchTestimonials = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/testimonials?page=${page}&limit=5`);
      setTestimonials(prev => [...prev, ...response.data.data]);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      controls.start({ opacity: 1, y: 0 });
    } catch (error) {
      console.error('Erro ao buscar depoimentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(currentPage);
  }, []);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchTestimonials(currentPage + 1);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  if (isLoading && testimonials.length === 0) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center" bg="gray.900">
        <Spinner size="xl" color="turquoise.400" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box
      py={20}
      bg="gray.900"
      minHeight="100vh"
      pt="120px"
    >
      <Container maxW="6xl">
        <VStack spacing={12}>
          <MotionBox
            initial={{ opacity: 0, y: -50 }}
            animate={controls}
            transition={{ duration: 0.5 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              textAlign="center"
              mb={4}
              color="turquoise.300"
              fontFamily="'Montserrat', sans-serif"
            >
              O que nossos membros dizem
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              textAlign="center"
              color="gray.300"
              fontFamily="'Inter', sans-serif"
              maxW="2xl"
              mx="auto"
            >
              Descubra como a Família Peaky Blinders tem impactado a vida de nossos membros
            </Text>
          </MotionBox>

          <Box width="100%" maxW="800px" mx="auto" position="relative">
            <Slider ref={(slider) => setSliderRef(slider)} {...settings}>
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </Slider>
          </Box>

          {currentPage < totalPages && (
            <Button
              onClick={handleLoadMore}
              isLoading={isLoading}
              bg="turquoise.500"
              color="white"
              _hover={{ bg: "turquoise.600" }}
            >
              Ver mais
            </Button>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Testimonials;
