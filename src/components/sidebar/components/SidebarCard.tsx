import { Flex } from '@chakra-ui/react';

export default function SidebarDocs() {
  const bgColor = 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)';

  return (
    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={bgColor}
      borderRadius="30px"
      me={{ base: '20px' }}
      position="relative"
    ></Flex>
  );
}
