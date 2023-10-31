import { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { APP_CONSTANTS } from '../constants/Constants';
import { Form, useField } from "react-final-form";
import emailAddressDeterminerService from '../service/EmailAddressDeterminerService';


export const EmailAddressDeterminerForm = () => {

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");


  const onSubmit = async (values) => {
    const response = await emailAddressDeterminerService.getDerivedEmailAddress(values);
    if (response?.derivedEmailAddress) {
      const successMessage = "Derived Email Address: " + response.derivedEmailAddress;
      setMessage(successMessage);
      setStatus(APP_CONSTANTS.SUCCESS_STATUS);
    } else {
      setMessage(response.error);
      setStatus(APP_CONSTANTS.ERROR_STATUS);
    }
  };

  const validate = (values) => {
    const domainRegex = new RegExp(/^(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/);
    const nameRegex = new RegExp(/^[A-Za-z ',-]+$/);
  
    const errors = {};
    if (!values.firstName) {
      errors.firstName = APP_CONSTANTS.REQUIRED;
    } else if (!nameRegex.test(values.firstName)) {
      errors.firstName = APP_CONSTANTS.FIRST_NAME_ERROR_MESSAGE;
    }
    if (!values.lastName) {
      errors.lastName = APP_CONSTANTS.REQUIRED;
    } else if (!nameRegex.test(values.lastName)) {
      errors.lastName = APP_CONSTANTS.LAST_NAME_ERROR_MESSAGE;
    }
    if (!values.companyDomain) {
      errors.companyDomain = APP_CONSTANTS.REQUIRED;
    } else if (!domainRegex.test(values.companyDomain)) {
      errors.companyDomain = APP_CONSTANTS.COMPANY_DOMAIN_ERROR_MESSAGE;
    }
    return errors;
  };

  return (
    <Box w={500} p={4} m="80px auto">
      <Heading as="h1" size="xl" textAlign="center">
        {APP_CONSTANTS.TITLE}
      </Heading>
      <Box as="p" textAlign="center" marginTop="30px">
        {APP_CONSTANTS.DESCRIPTION}
      </Box>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({
          handleSubmit,
          form,
          submitting,
          pristine,
        }) => (
          <Box
            as="form"
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="1px 1px 3px rgba(0,0,0,0.3)"
            onSubmit={handleSubmit}
            marginTop="30px"
          >
            <InputControl name="firstName" label="First Name" />
            <InputControl name="lastName" label="Last Name" />
            <InputControl name="companyDomain" label="Company Domain" placeholder="domain.com" />
            <ButtonGroup spacing={4}>
              <Button
                isLoading={submitting}
                loadingText="Submitting"
                type="submit"
              >
                {APP_CONSTANTS.SUBMIT}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  form.reset();
                  setStatus("");
                  setMessage("");
                }}
                isDisabled={submitting || pristine}
              >
                {APP_CONSTANTS.RESET}
              </Button>
            </ButtonGroup>
          </Box>
        )}
      />
      {
        status && (
          <Alert variant="solid" marginTop="20px" status={status}>
            <AlertIcon />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )
      }

    </Box>
  )
}


const Control = ({ name, ...rest }) => {
  const {
    meta: { error, touched }
  } = useField(name, { subscription: { touched: true, error: true } });
  return <FormControl {...rest} isInvalid={error && touched} />;
};

const Error = ({ name }) => {
  const {
    meta: { error }
  } = useField(name, { subscription: { error: true } });
  return <FormErrorMessage>{error}</FormErrorMessage>;
};

const InputControl = ({ name, label, placeholder }) => {
  const { input, meta } = useField(name);
  return (
    <Control name={name} my={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        {...input}
        isInvalid={meta.error && meta.touched}
        id={name}
        placeholder={placeholder || label}
        maxLength={50}
      />
      <Error name={name} />
    </Control>
  );
};
