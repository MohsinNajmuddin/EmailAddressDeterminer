import axios from "axios";
import { API_CONSTANTS } from "../constants/Constants";


const emailAddressDeterminerService = {};

emailAddressDeterminerService.getDerivedEmailAddress = async (params) => {
    const URL = API_CONSTANTS.BASE_URL + API_CONSTANTS.GET_DERIVED_EMAIL_ADDRESS;
    const response = await axios.post(URL, {
        ...params
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        const { response } = error;
        return response.data;
    });

    return response;
}


export default emailAddressDeterminerService;