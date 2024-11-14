import axios from 'axios';
import {getHeadersWithToken} from '../utils/getHeadersWithToken';
const API_BASE_URL = "https://945e-103-211-190-131.ngrok-free.app"; 
import StorageUtils from '../utils/storage_utils';

const apiClient = axios.create({
    baseURL: API_BASE_URL,  // Replace with your API base URL
});

// Common API call function 
export const apiCall = async <T>(url: string, method: string, data?: any): Promise<T> => {
    try {
      const isAuthRoute = url.includes("signIn") || url.includes("signUp");
      let token = await StorageUtils.getAPIToken();
      console.log("token-------------------------------------------------------      ||", token)
      console.log("Auth UR -------><<<<<<----------------", isAuthRoute)
      let headers: any = {
        "Content-Type": "application/json",
      };
      console.log("Headers with token", getHeadersWithToken())

      if (!isAuthRoute) {
        console.log("we are")
        headers = {
          ...headers,
          "x-auth-token" : token, // Get headers with token for all other requests
        };
        console.log("We are here in headers |||||||||||||||||||||||||---->", headers)
      }  
      const response = await apiClient({
        url,
        method,
        data,
        headers,  // Ensure headers are included here
      });
      
      return response.data;
      
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Something went wrong');
    }
};

export default apiClient;
