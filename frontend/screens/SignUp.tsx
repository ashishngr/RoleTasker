// screens/SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { signUpApi, SignUpPayload } from '../api/api'; // Import mutation function


import Toast from 'react-native-toast-message'; // Toast for notifications
import { Picker } from '@react-native-picker/picker'; // Import Picker if not already imported


interface SignUpProps {
    navigation: any;
}

const SignUp: React.FC<SignUpProps> = ({navigation}) => {


    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<[string]>(['Worker']);

    React.useEffect(() => {
        console.log("Form State:", { firstName, lastName, email, password, role });
    }, [firstName, lastName, email, password, role]);



    // Define mutation for SignUp API call
    const mutation = useMutation({
        mutationFn: (payload: SignUpPayload) =>{
            console.log('Attempting to sign up with payload:', payload);
            return signUpApi(payload)
        } ,
        onSuccess: (data) => {
            console.log("SignUp Successful:", data);
            Toast.show({
                type: 'success',
                text1: 'Sign Up Successful!',
                text2: 'Your account has been created.',
            });
            console.log('SignUp successful', data);
            navigation.navigate('Home'); // Redirect to Sign In screen after successful sign-up
        },
        onError: (error: any) => {
            console.log("SignUp failed",error)
            Toast.show({
                type: 'error',
                text1: 'Sign Up Failed',
                text2: error.message || 'An error occurred while signing up.',
            });
            console.error('SignUp failed', error);
        }
    });

    const handleSubmit = () => {
        if (!firstName || !lastName || !email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in all the fields.',
            });
            return;
        }
        mutation.mutate({ firstName, lastName, email, password, role }); // Trigger the mutation
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Role:</Text>
                <Picker
                    selectedValue={role}
                    style={styles.picker}
                    onValueChange={(itemValue) => setRole(itemValue)}
                >
                    <Picker.Item label="Worker" value="Worker" />
                    <Picker.Item label="Assigner" value="Assigner" />
                    <Picker.Item label="Admin" value="Admin" />
                </Picker>
            </View>

            <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSubmit}
               
            >
                <Text style={styles.signUpButtonText}>
                    Sign Up
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signInText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    signUpButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    signInText: {
        fontSize: 16,
        color: '#007AFF',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default SignUp;
