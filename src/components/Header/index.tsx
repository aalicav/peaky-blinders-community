"use client";

import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Button,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

export default function Header() {
  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleViewProfile = () => {
    router.push('/member-profile');
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue("#09222a", "gray.800")}
        color={useColorModeValue("white", "white")}
        minH={"60px"}
        w="100vw"
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={"center"}
        zIndex={1200}
        position="absolute"
        background={{ base: "transparent", md: "rgba(1, 146, 83, 0.05)" }}
        boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
        backdropFilter={{ base: "transparent", md: "blur(5px)" }}
        style={{ WebkitBackdropFilter: "blur(5px)" }}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            _hover={{
              bg: "accent.200",
            }}
            bgColor="accent.300"
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 2 }}
          justify={{ base: "start", md: "start" }}
          align={{ base: "center", md: "start" }}
        >
          <a href="/">
            <Image
              display={{ base: "none", md: "flex" }}
              src="familia2-logo.png"
              w="160px"
              h="80px"
              alt="family-logo"
            />
          </a>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {isLoggedIn ? (
            <>
              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                onClick={handleViewProfile}
                color="turquoise.300"
                _hover={{
                  color: "turquoise.200",
                }}
              >
                Ver Perfil
              </Button>
              <Button
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"turquoise.400"}
                onClick={handleLogout}
                _hover={{
                  bg: "turquoise.300",
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <Button
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"turquoise.400"}
              onClick={handleLogin}
              _hover={{
                bg: "turquoise.300",
              }}
            >
              Entrar
            </Button>
          )}
        </Stack>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Navegação</DrawerHeader>
            <DrawerBody>
              <MobileNav onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("accent.300", "gray.200");
  const linkHoverColor = useColorModeValue("accent.200", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box as="a" p={2} href={navItem.href ?? "#"} fontSize={"sm"}>
                <Text variant="menu-item">{navItem.label}</Text>
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as="a"
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = ({ onClose }: { onClose: (() => void) | undefined }) => {
  return (
    <Stack p={4}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} onClose={onClose} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, onClose }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? "#"}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: "none",
        }}
        onClick={onClose}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  onClose?: () => void;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Sobre",
    href: "about",
  },
  {
    label: "Mural do amor",
    href: "testimonials"
  },
  {
    label: "Regras da familia",
    href: "rules",
  },
];
