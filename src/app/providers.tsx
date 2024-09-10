// app/providers.tsx
"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// Definindo as fontes personalizadas
const fonts = {
  heading: "'Montserrat', sans-serif", // Fonte para cabeçalhos
  body: "'Inter', sans-serif", // Fonte para o corpo do texto
  mono: "'JetBrains Mono', monospace", // Fonte monoespaçada
};



const colors = {
  brand: {
    50: "#f0f0f0",
    100: "#e0e0e0",
    200: "#d1d1d1",
    300: "#b1b1b1",
    400: "#8f8f8f",
    500: "#6a0dad", // Primário - Roxo médio
    600: "#00274d", // Alternativa Primária - Azul-marinho
    700: "#34d1bf", // Alternativa Primária - Verde-água
    800: "#121212", // Secundário - Preto profundo
    900: "#000000", // Variante mais escura do secundário
  },
  accent: {
    50: "#e0fff9",
    100: "#c2ffeb",
    200: "#00ffc5", // Acento - Turquesa
    300: "#4dae97", // Acento - Turquesa
    400: "#ff6f61", // Acento Alternativo - Coral
    500: "#ffdc00", // Acento Alternativo - Amarelo
  },
  complementary: {
    50: "#f7f5f2",
    100: "#f0f0f0",
    200: "#e0e0e0",
    300: "#d0d0d0",
    400: "#a0c4ff", // Complementar - Azul suave
    500: "#ffffff", // Secundário - Branco
  },
  turquoise: {
    50: "#e6fff7", // Tom mais claro de turquesa
    100: "#b3ffe0", // Tom claro de turquesa
    200: "#00ffc5", // Acento - Turquesa
    300: "#4dae97", // Acento - Turquesa
    400: "#39a383", // Turquesa médio
    500: "#2d8a6c", // Turquesa padrão
    600: "#237055", // Turquesa mais escuro
    700: "#1b5943", // Turquesa mais escuro ainda
    800: "#143e30", // Tom escuro de turquesa
    900: "#0d271c", // Tom mais escuro de turquesa
  },
};
const breakpoints = {
  sm: "30em", // 480px
  md: "48em", // 768px
  lg: "62em", // 992px
  xl: "80em", // 1280px
};

// Definindo o tema personalizado
const theme = extendTheme({
  breakpoints,
  colors,
  fonts,
  styles: {
    global: {
      body: {
        bg: "complementary.500", // Fundo padrão do corpo
        color: "brand.800", // Cor padrão do texto
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: "accent.200",
          color: "white",
          _hover: {
            bg: "accent.300", // Mudança de cor ao passar o mouse
          },
        },
        outline: {
          borderColor: "brand.500",
          color: "brand.500",
          _hover: {
            bg: "brand.500",
            color: "white",
          },
        },
      },
    },
    Badge: {
      variants: {
        solid: {
          bg: "accent.400", // Amarelo
          color: "black",
        },
      },
    },
    Text: {
      variants: {
        "menu-item": {
          color: "accent.300",
          fontSize: "1.125rem",
          cursor: 'pointer',
          fontWeight: "light",
          _hover: {
            color: "accent.200",
          },
        },
      },
    },
    Input: {
      focusBorderColor: "accent.200",
    }
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
