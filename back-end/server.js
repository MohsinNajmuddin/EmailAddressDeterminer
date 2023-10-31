const express = require('express');
const cors = require('cors');
const sampleDataSet = require("./sample-data/sample-data.json");
const APP_CONSTANTS = require('./constants/constants')

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());



const companiesEmailFormat = {}


const determineCompaniesEmailFormat = () => {
  for (let name in sampleDataSet) {
    const emailAddress = sampleDataSet[name];
    const [userName, companyDomain] = emailAddress.split("@");
    if (!companiesEmailFormat[companyDomain]) {
      const [firstName, lastName] = name.split(" ");
      const userNameTypeA = firstName.toLowerCase() + lastName.toLowerCase();
      const userNameTypeB = (firstName[0]).toLowerCase() + lastName.toLowerCase();

      if (userName === userNameTypeA) {
        companiesEmailFormat[companyDomain] = APP_CONSTANTS.USER_NAME_TYPE_A;
      } else if (userName === userNameTypeB) {
        companiesEmailFormat[companyDomain] = APP_CONSTANTS.USER_NAME_TYPE_B;
      }
    }
  }
}

const getDerivedEmailAddress = (userDetailsObj, emailFormat) => {
  const {firstName, lastName, companyDomain} = userDetailsObj;
  let userName = '';

  if (emailFormat === APP_CONSTANTS.USER_NAME_TYPE_A) {
    userName = firstName.toLowerCase() + lastName.toLowerCase();
  } else {
    userName = (firstName[0]).toLowerCase() + lastName.toLowerCase();
  }

  return userName + "@" + companyDomain.toLowerCase();
}

app.post('/deriveEmailAddress', (req, res) => {
  let { firstName, lastName, companyDomain } = req.body;

  firstName = firstName.replace(/\s/g, '');
  lastName = lastName.replace(/\s/g, '');

  const userDetailsObj = {
    firstName,
    lastName,
    companyDomain
  };

  if (companiesEmailFormat[companyDomain.toLowerCase()]) {
    const derivedEmailAddress = getDerivedEmailAddress(userDetailsObj, companiesEmailFormat[companyDomain]);
    res.status(200).json({
      derivedEmailAddress
    });
  } else {
    res.status(404).json({ error: 'Email derivation not possible' });
  }
});


app.listen(PORT, () => {
  console.log("Server Listening on PORT: ", PORT);
  determineCompaniesEmailFormat();
});


module.exports = {
  getDerivedEmailAddress,
  app
}