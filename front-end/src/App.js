import React from 'react';
import {
  ChakraProvider,
  theme,
  CSSReset
} from '@chakra-ui/react';

import { EmailAddressDeterminerForm } from './components/EmailAddressDeterminerForm';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <EmailAddressDeterminerForm />
    </ChakraProvider>
  );
}

export default App;
