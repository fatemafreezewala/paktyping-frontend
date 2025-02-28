import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import DefaultAuth from 'layouts/auth/Default';
import Card from 'components/card/Card';
import illustration from 'assets/img/auth/auth.png';
import { useNavigate } from 'react-router-dom';
import useAuthStore from 'constants/useAuthStore';
import { api } from 'constants/api';

function SignIn() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = () => setShow(!show);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await api.post('/users/login', { email, password });
      login(response.data.user, response.data.token);
      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/admin'); // Redirect to admin dashboard
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Login Error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Card marginTop={'5%'}>
        <Flex
          w="100%"
          mx={{ base: 'auto', lg: '0px' }}
          me="auto"
          h="100%"
          alignItems="center"
          justifyContent="center"
          mb={{ base: '30px', md: '60px' }}
          px={{ base: '25px', md: '0px' }}
          mt={{ base: '40px', md: '14vh' }}
          flexDirection="column"
        >
          <Flex
            zIndex="2"
            direction="column"
            w={{ base: '100%', md: '420px' }}
            maxW="100%"
            background="transparent"
            borderRadius="15px"
            mx={{ base: 'auto', lg: 'unset' }}
            me="auto"
            mb={{ base: '20px', md: 'auto' }}
          >
            <Box me="auto">
              <Heading color={textColor} fontSize="36px" mb="10px">
                Welcome to Paktyping
              </Heading>
              <Text
                mb="36px"
                ms="4px"
                color={textColorSecondary}
                fontWeight="400"
                fontSize="md"
              >
                Enter your email and password to sign in!
              </Text>
            </Box>
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="email"
                placeholder="mail@simmmple.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  variant="auth"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>

              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                isLoading={loading}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
            </FormControl>
          </Flex>
        </Flex>
      </Card>
    </DefaultAuth>
  );
}

export default SignIn;
