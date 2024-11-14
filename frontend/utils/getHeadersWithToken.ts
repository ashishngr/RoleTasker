// Assuming StorageUtils is a utility that provides access to stored data, including the API token.
import StorageUtils from "./storage_utils";

export const getHeadersWithToken = async() => {
  // Retrieve the token from storage
  const token = await StorageUtils.getAPIToken(); 
  console.log("Token in get headers token ::=", token)
  // If no token is found, handle accordingly (you can throw an error or return an empty object, etc.)
  if (!token) {
    console.warn("No API token found in storage.");
    return {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": "", // If there's no token, an empty string can be used, or you can handle this more gracefully
      },
    };
  }

  // Return the headers with the token
  console.log("Token from storage", token);
  return {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token
    },
  };
};


