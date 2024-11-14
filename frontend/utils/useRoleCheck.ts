// import { useEffect, useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { useAuth } from './useAuth'; // Assuming useAuth fetches user info, including role

// export const useRoleCheck = (allowedRoles: string[]): boolean => {
//   const [hasAccess, setHasAccess] = useState(false);
//   const navigation = useNavigation();
//   const { user } = useAuth();

//   useEffect(() => {
//     if (allowedRoles.includes(user?.role)) {
//       setHasAccess(true);
//     } else {
//       setHasAccess(false);
//       navigation.navigate('NotAuthorized'); // Redirect to a "Not Authorized" screen
//     }
//   }, [allowedRoles, user, navigation]);

//   return hasAccess;
// };
