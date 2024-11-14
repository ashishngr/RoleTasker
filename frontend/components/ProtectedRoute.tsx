// import React from 'react';
// import { useRoleCheck } from '../hooks/useRoleCheck';
// import { View, Text } from 'react-native';

// interface ProtectedRouteProps {
//   allowedRoles: string[];
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
//   const hasAccess = useRoleCheck(allowedRoles);

//   return hasAccess ? <>{children}</> : <View><Text>Access Denied</Text></View>;
// };

// export default ProtectedRoute;
