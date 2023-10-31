const request = require('supertest');
const { app, getDerivedEmailAddress } = require('../server');

const APP_CONSTANTS = require('../constants/constants');


describe('Unit Tests', () => {

  it('should derive an email address', () => {
    const userDetailsObj = {
      firstName: 'John',
      lastName: 'Doe',
      companyDomain: 'example.com',
    };
    const emailFormat =  APP_CONSTANTS.USER_NAME_TYPE_A;

    const derivedEmail = getDerivedEmailAddress(userDetailsObj, emailFormat);

    expect(derivedEmail).toBe('johndoe@example.com');
  });

  it('should respond with a derived email address with first name initials and last name', async () => {
    const userDetails = {
      firstName: 'John',
      lastName: 'Doe',
      companyDomain: 'babbel.com',
    };

    const expectedResponse = {
      derivedEmailAddress: 'jdoe@babbel.com',
    };

    const response = await request(app)
      .post('/deriveEmailAddress')
      .send(userDetails)
      .expect(200);

    expect(response.body).toEqual(expectedResponse);
  });

  it('should respond with a derived email address with first name and last name', async () => {
    const userDetails = {
      firstName: 'John',
      lastName: 'Doe',
      companyDomain: 'google.com',
    };

    const expectedResponse = {
      derivedEmailAddress: 'johndoe@google.com',
    };

    const response = await request(app)
      .post('/deriveEmailAddress')
      .send(userDetails)
      .expect(200);

    expect(response.body).toEqual(expectedResponse);
  });

  it('should respond with an error when email derivation is not possible', async () => {
    const userDetails = {
      firstName: 'NonExistent',
      lastName: 'User',
      companyDomain: 'example.com',
    };

    const expectedResponse = {
      error: 'Email derivation not possible',
    };

    const response = await request(app)
      .post('/deriveEmailAddress')
      .send(userDetails)
      .expect(404);

    expect(response.body).toEqual(expectedResponse);
  });
});
