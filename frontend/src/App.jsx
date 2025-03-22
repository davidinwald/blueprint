import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  extendTheme,
} from "@chakra-ui/react";
import { healthCheck } from "./api/api";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function App() {
  const [status, setStatus] = useState("Loading...");
  const toast = useToast();

  const checkHealth = async () => {
    try {
      const response = await healthCheck();
      setStatus(response.status);
      toast({
        title: "API Status",
        description: "Backend is healthy!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setStatus("Error");
      toast({
        title: "API Error",
        description: "Failed to connect to backend",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box p={8}>
        <VStack spacing={8}>
          <Heading>Take Home Assessment</Heading>
          <Text>Backend Status: {status}</Text>
          <Button colorScheme="blue" onClick={checkHealth}>
            Check Health
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
