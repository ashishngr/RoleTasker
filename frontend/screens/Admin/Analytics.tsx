import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Modal, Dimensions } from "react-native";
import { BarChart, PieChart, LineChart } from "react-native-chart-kit";
import { adminStaticData } from "../../api/api";
import { getAdminAnalyticsData } from "../../api/api";

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [data, setData] = useState<any>(null); 

  useEffect(()=>{
    const fetchData = async() =>{
        try {
          const response = await getAdminAnalyticsData(); 
          console.log("response-------*>*", response); 
          setData(response)
        } catch (error) {
          console.error("Error fetching analytics data:", error);
        } finally {
          setLoading(false);
        }
    }
    fetchData()
  },[])
  

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminStaticData(); // Replace with actual API call
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const toggleModal = () => setModalVisible((prev) => !prev);

  const taskByStatusData = {
    labels : data?.tasksByStatus.map((item: any) => item._id),
    datasets: [
      {
        data: data?.tasksByStatus.map((item: any) => item.count),
      },
    ],
  }

  const tasksByPriorityData = data?.tasksByPriority.map((item: any) => ({
    name: item._id,
    count: item.count,
    color: item._id === "High" ? "#FF4500" : item._id === "Medium" ? "#FFD700" : "#32CD32",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  })); 

  const tasksByWorkerData = {
    labels: data?.tasksByWorker.map((item: any) => item.email),
    datasets: [
      {
        data: data?.tasksByWorker.map((item: any) => item.count),
      },
    ],
  };
  const tasksByCreatorData = {
    labels: data?.tasksByCreator.map((item: any) => item.ownerName),
    datasets: [
      {
        data: data?.tasksByCreator.map((item: any) => item.count),
      },
    ],
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Fetching Analytics...</Text>
      </View>
    );
  }
  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
      <Text style={styles.header}>Analytics Dashboard</Text>

      {/* Overview Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overview</Text>
        <View style={styles.cardContent}>
          <View style={styles.metricRow}>
            <Text style={styles.metricKey}>Active Users:</Text>
            <Text style={styles.metricValue}>{analytics?.activeUsers}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricKey}>Workers:</Text>
            <Text style={styles.metricValue}>{analytics?.worker}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricKey}>Assigners:</Text>
            <Text style={styles.metricValue}>{analytics?.assigners}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricKey}>Total Tasks:</Text>
            <Text style={styles.metricValue}>{analytics?.totalTasks}</Text>
          </View>
        </View>

        {/* View Task Metrics Button */}
        <TouchableOpacity onPress={toggleModal} style={styles.viewMetricsButton}>
          <Text style={styles.viewMetricsText}>View Task Metrics</Text>
        </TouchableOpacity>
      </View>
      {/* Charts */} 
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Tasks by Status</Text>
        <BarChart
          data={taskByStatusData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Tasks by Priority</Text>
        <PieChart
          data={tasksByPriorityData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor={"count"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[5, 5]}
          absolute
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Tasks by Worker</Text>
        <LineChart
          data={tasksByWorkerData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          data={tasksByCreatorData}
          width={screenWidth - 32}
          height={240}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
        />
         <Text style={styles.chartTitle}>Tasks by Creator</Text>
      </View>

      {/* Archived Tasks */}
      <View style={styles.archivedContainer}>
        <Text style={styles.archivedText}>
          Archived Tasks: {data?.archivedTasks || 0}
        </Text>
      </View>

      {/* Modal for Task Metrics */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Task Metrics</Text>
            <ScrollView style={styles.taskScroll}>
              {Object.entries(analytics || {}).map(([key, value]) => (
                <View key={key} style={styles.taskCard}>
                  <Text style={styles.taskKey}>{key}</Text>
                  <Text style={styles.taskValue}>{value}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
    
  );
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 12,
  },
  cardContent: {
    marginBottom: 16,
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
  viewMetricsButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  viewMetricsText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  taskScroll: {
    maxHeight: 300,
    paddingHorizontal: 8,
  },
  taskCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  taskKey: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007BFF",
  },
  taskValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FF6347",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  chartContainer: {
    marginBottom: 24,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#007BFF",
    textAlign: "center",
  },
  archivedContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  archivedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF5722",
  },
  scrollContainer :{
    marginBottom : 54
  }
});

export default Analytics;
