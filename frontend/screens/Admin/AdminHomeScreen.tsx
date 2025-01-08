// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// import { Ionicons, MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
// import { useAdminHomePageAnalytics } from "../../api/apiMutations";
// import { getPerformerData } from "../../api/api";

// const AdminHomeScreen: React.FC = () => {
//   const [analyticsData, setAnalyticsData] = useState({
//     activeUsers: 0,
//     workers: 0,
//     assigners: 0,
//     totalTasks: 0,
//     doneTasks: 0,
//     inProgressTasks: 0,
//     overdueTasks: 0,
//   });
//   const [performerData, setPerformerData] = useState<any>(null);

//   const { mutate: fetchAdminHomePageAnalytics, data: adminAnalyticsData, isLoading } =
//     useAdminHomePageAnalytics();

//   useEffect(() => {
//     fetchAdminHomePageAnalytics();
//   }, []);

//   useEffect(() => {
//     if (adminAnalyticsData) {
//       setAnalyticsData({
//         workers: adminAnalyticsData?.workers || 0,
//         assigners: adminAnalyticsData?.assigners || 0,
//         activeUsers: adminAnalyticsData?.activeUsers || 0,
//         totalTasks: adminAnalyticsData?.totalTasks || 0,
//         doneTasks: adminAnalyticsData?.doneTasks || 0,
//         inProgressTasks: adminAnalyticsData?.inProgressTasks || 0,
//         overdueTasks: adminAnalyticsData?.overdueTasks || 0,
//       });
//     }
//   }, [adminAnalyticsData]);

//   useEffect(() => {
//     const fetchPerformances = async () => {
//       try {
//         const data = await getPerformerData();
//         setPerformerData(data);
//       } catch (error) {
//         console.error("Error fetching analytics data:", error);
//       }
//     };
//     fetchPerformances();
//   }, []);

//   const renderAnalyticsCard = (icon, label, value, color, size) => {
//     const cardStyle = size === "large" ? styles.largeCard : styles.smallCard;

//     return (
//       <View style={[styles.card, cardStyle, { backgroundColor: color }]}>
//         <View style={styles.iconContainer}>{icon}</View>
//         <Text style={styles.cardValue}>{value}</Text>
//         <Text style={styles.cardLabel}>{label}</Text>
//       </View>
//     );
//   };

//   const renderCard = (title: string, icon: JSX.Element, data: any, backgroundColor: string) => (
//     <View style={[styles.performanceCard, { backgroundColor }]}>
//       <View style={styles.cardHeader}>
//         {icon}
//         <Text style={styles.cardTitle}>{title}</Text>
//       </View>
//       <View style={styles.performanceCardContent}>
//         <View style={styles.metricRow}>
//             <Text style={styles.metricKey}>Email:</Text>
//             <Text style={styles.metricValue}>{data.email}</Text>
//         </View>
//         <View style={styles.metricRow}>
//             <Text style={styles.metricKey}>Total Tasks:</Text>
//             <Text style={styles.metricValue}>{data.totalTasks}</Text>
//         </View> 
//         <View style={styles.metricRow}>
//             <Text style={styles.metricKey}>Done Tasks:</Text>
//             <Text style={styles.metricValue}>{data.doneTasks}</Text>
//         </View>
//         <View style={styles.metricRow}>
//             <Text style={styles.metricKey}>In Progres:</Text>
//             <Text style={styles.metricValue}>{data.inProgressTasks}</Text>
//         </View>
//         <View style={styles.metricRow}>
//             <Text style={styles.metricKey}>Completion Rate:</Text>
//             <Text style={styles.metricValue}>{data.taskPercentage}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   if (isLoading || !performerData) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <ActivityIndicator size="large" color="#4B9CD3" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.welcomeSection}>
//         <Ionicons name="rocket-outline" size={40} color="#FFD700" />
//         <Text style={styles.title}>Welcome to RoleTasker!</Text>
//         <Text style={styles.subtitle}>
//           Analyze your task management trends with ease and precision.
//         </Text>
//       </View>

//       <View style={styles.analyticsSection}>
//         {renderAnalyticsCard(
//           <Ionicons name="people-outline" size={28} color="#fff" />,
//           "Active Users",
//           analyticsData.activeUsers,
//           "#4CAF50",
//           "large"
//         )}
//         {renderAnalyticsCard(
//           <FontAwesome name="briefcase" size={28} color="#fff" />,
//           "Workers",
//           analyticsData.workers,
//           "#2196F3",
//           "small"
//         )}
//         {renderAnalyticsCard(
//           <MaterialIcons name="group" size={28} color="#fff" />,
//           "Assigners",
//           analyticsData.assigners,
//           "#FF9800",
//           "small"
//         )}
//         {renderAnalyticsCard(
//           <Ionicons name="clipboard-outline" size={28} color="#fff" />,
//           "Total Tasks",
//           analyticsData.totalTasks,
//           "#9C27B0",
//           "large"
//         )}
//         {renderAnalyticsCard(
//           <Ionicons name="checkmark-circle-outline" size={28} color="#fff" />,
//           "Done Tasks",
//           analyticsData.doneTasks,
//           "#00BCD4",
//           "small"
//         )}
//         {renderAnalyticsCard(
//           <Ionicons name="time-outline" size={28} color="#fff" />,
//           "In Progress",
//           analyticsData.inProgressTasks,
//           "#FFC107",
//           "small"
//         )}
//         {renderAnalyticsCard(
//           <Ionicons name="alert-circle-outline" size={28} color="#fff" />,
//           "Overdue Tasks",
//           analyticsData.overdueTasks,
//           "#F44336",
//           "large"
//         )}

//         <View style={styles.performanceSection}>
//         <Text style={styles.sectionHeader}>Performance Metrics</Text>
//         {renderCard(
//           "Best Performer",
//           <Ionicons name="medal-outline" size={28} color="#4CAF50" />,
//           performerData.bestPerformer,
//           "#E8F5E9"
//         )}
//         {renderCard(
//           "Worst Performer",
//           <FontAwesome5 name="thumbs-down" size={28} color="#F44336" />,
//           performerData.worstPerformer,
//           "#FFEBEE"
//         )}
//       </View>
//       </View>

      
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f4f6f9",
//   },
//   center: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   welcomeSection: {
//     alignItems: "center",
//     paddingVertical: 20,
//     backgroundColor: "#242F40",
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginTop: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#D1D5DB",
//     textAlign: "center",
//     paddingHorizontal: 20,
//     marginTop: 5,
//   },
//   analyticsSection: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     padding: 15,
//   },
//   card: {
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 10,
//     alignItems: "center",
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//   },
//   largeCard: {
//     width: "100%",
//     aspectRatio: 2,
//   },
//   smallCard: {
//     width: "48%",
//     aspectRatio: 1.5,
//   },
//   iconContainer: {
//     marginBottom: 10,
//   },
//   cardValue: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   cardLabel: {
//     fontSize: 14,
//     color: "#fff",
//     textAlign: "center",
//   },
//   performanceSection: {
//     marginTop: 10,
//   },
//   performanceCard: {
//     padding: 16,
//     backgroundColor: "#FFF",
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 4,
//     marginBottom: 16,
//     width: "125%",
//   },
//   performanceCardContent : {
//     marginBottom: 16,
//   },
//   metricRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   metricKey: {
//     fontSize: 16,
//     color: "#555",
//   },
//   metricValue: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#007BFF",
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginLeft: 8,
//     color: "#333",
//   },
//   cardBody: {
//     marginLeft: 36,
//   },
//   cardText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#555",
//     marginBottom: 4,
//   },
//   sectionHeader: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 16,
//     color: "#333",
//   },
// });

// export default AdminHomeScreen;
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { useAdminHomePageAnalytics } from "../../api/apiMutations";
import { getPerformerData } from "../../api/api";

const AdminHomeScreen: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState({
    activeUsers: 0,
    workers: 0,
    assigners: 0,
    totalTasks: 0,
    doneTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });
  const [performerData, setPerformerData] = useState<any>(null);

  const { mutate: fetchAdminHomePageAnalytics, data: adminAnalyticsData, isLoading } =
    useAdminHomePageAnalytics();

  useEffect(() => {
    fetchAdminHomePageAnalytics();
  }, []);

  useEffect(() => {
    if (adminAnalyticsData) {
      setAnalyticsData({
        workers: adminAnalyticsData?.workers || 0,
        assigners: adminAnalyticsData?.assigners || 0,
        activeUsers: adminAnalyticsData?.activeUsers || 0,
        totalTasks: adminAnalyticsData?.totalTasks || 0,
        doneTasks: adminAnalyticsData?.doneTasks || 0,
        inProgressTasks: adminAnalyticsData?.inProgressTasks || 0,
        overdueTasks: adminAnalyticsData?.overdueTasks || 0,
      });
    }
  }, [adminAnalyticsData]);

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const data = await getPerformerData();
        setPerformerData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
    fetchPerformances();
  }, []);

  const renderCard = (icon, title, value, color) => (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.cardIcon}>{icon}</View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );

  const renderPerformanceCard = (title, icon, data, color) => (
    <View style={[styles.performanceCard, { backgroundColor: color }]}>
      <View style={styles.cardHeader}>
        {icon}
        <Text style={styles.performanceCardTitle}>{title}</Text>
      </View>
      <View style={styles.performanceCardContent}>
      <View style={styles.metricRow}>
         <Text style={styles.metricKey}>Email:</Text>
           <Text style={styles.metricValue}>{data.email}</Text>
        </View>
        <View style={styles.metricRow}>
         <Text style={styles.metricKey}>Total Tasks:</Text>
         <Text style={styles.metricValue}>{data.totalTasks}</Text>
     </View> 
   <View style={styles.metricRow}>
        <Text style={styles.metricKey}>Done Tasks:</Text>
      <Text style={styles.metricValue}>{data.doneTasks}</Text>
 </View>
 <View style={styles.metricRow}>
         <Text style={styles.metricKey}>In Progres:</Text>
        <Text style={styles.metricValue}>{data.inProgressTasks}</Text>
    </View>
   <View style={styles.metricRow}>
          <Text style={styles.metricKey}>Completion Rate:</Text>
          <Text style={styles.metricValue}>{data.taskPercentage}</Text>
      </View>
      </View>
    </View>
  );

  if (isLoading || !performerData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4B9CD3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="rocket-outline" size={40} color="#FFD700" />
        <Text style={styles.headerTitle}>Welcome to RoleTasker</Text>
        <Text style={styles.headerSubtitle}>
          Manage tasks and monitor performance effortlessly.
        </Text>
      </View>

      <View style={styles.analyticsSection}>
        {renderCard(
          <Ionicons name="people-outline" size={30} color="#fff" />,
          "Active Users",
          analyticsData.activeUsers,
          "#4CAF50"
        )}
        {renderCard(
          <FontAwesome name="briefcase" size={30} color="#fff" />,
          "Workers",
          analyticsData.workers,
          "#2196F3"
        )}
        {renderCard(
          <MaterialIcons name="group" size={30} color="#fff" />,
          "Assigners",
          analyticsData.assigners,
          "#FF9800"
        )}
        {renderCard(
          <Ionicons name="clipboard-outline" size={30} color="#fff" />,
          "Total Tasks",
          analyticsData.totalTasks,
          "#9C27B0"
        )}
        {renderCard(
          <Ionicons name="checkmark-circle-outline" size={30} color="#fff" />,
          "Done Tasks",
          analyticsData.doneTasks,
          "#00BCD4"
        )}
        {renderCard(
          <Ionicons name="time-outline" size={30} color="#fff" />,
          "In Progress",
          analyticsData.inProgressTasks,
          "#FFC107"
        )}
        {renderCard(
          <Ionicons name="alert-circle-outline" size={30} color="#fff" />,
          "Overdue Tasks",
          analyticsData.overdueTasks,
          "#F44336"
        )}
      </View>

      <View style={styles.performanceSection}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        {renderPerformanceCard(
          "Best Performer",
          <Ionicons name="medal-outline" size={28} color="#4CAF50" />,
          performerData.bestPerformer,
          "#E8F5E9"
        )}
        {renderPerformanceCard(
          "Worst Performer",
          <FontAwesome5 name="thumbs-down" size={28} color="#F44336" />,
          performerData.worstPerformer,
          "#FFEBEE"
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 10,
    marginBottom : 62
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#242F40",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
    marginTop: 5,
  },
  analyticsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  cardTitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  performanceCardTitle : {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  performanceCardContent : {
    marginBottom: 16,
  },
  performanceSection: {
    marginTop: 20,
  },
  performanceCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
 metricRow: {
    flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 8,
      },
      metricKey: {
        fontSize: 16,
        color: "#555",
      },
      metricValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#007BFF",
      },
});

export default AdminHomeScreen;
