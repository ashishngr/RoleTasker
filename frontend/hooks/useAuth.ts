import { useMutation } from "@tanstack/react-query";
import {
  signUp,
  signIn,
  SignUpData,
  SignInData,
  AuthResponse,
} from "../api/apiClient";
import { useNavigation } from "@react-navigation/native";

export const useAuth = () => {
  const navigation = useNavigation();

  // Sign up mutation
  const { mutate: handleSignUp, isLoading: signUpLoading } = useMutation<
    AuthResponse,
    Error,
    SignUpData
  >(signUp, {
    onSuccess: () => {
      navigation.navigate("Home"); // Redirect to Home on success
    },
    onError: (error) => {
      console.error("Sign-up error:", error);
    },
  });

  // Sign in mutation
  const { mutate: handleSignIn, isLoading: signInLoading } = useMutation<
    AuthResponse,
    Error,
    SignInData
  >(signIn, {
    onSuccess: () => {
      navigation.navigate("Home"); // Redirect to Home on success
    },
    onError: (error) => {
      console.error("Sign-in error:", error);
    },
  });

  return {
    handleSignUp,
    signUpLoading,
    handleSignIn,
    signInLoading,
  };
};
