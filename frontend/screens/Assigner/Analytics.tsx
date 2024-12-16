import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { getAssigneeAnalyticsData } from "../../api/api";

const Analytics: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const filterQuery = activeFilter ? `?filter=${encodeURIComponent(activeFilter)}` : "";
        const response = await getAssigneeAnalyticsData(filterQuery);
        console.log("API Response:", response);

        if (response?.data && response.data.length > 0) {
          const [data] = response?.data;
          console.log("Analytics Data = ", data)
          // Ensure that each of the necessary fields exists before accessing them 
          const taskStatusData = data.tasksByStatus.map((status) => ({
            name: status.status,
            population: status.count,
            color: getColorForStatus(status.status), // Custom function for colors
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          }));

          const taskPriorityData = data.tasksByPriority.map((priority) => ({
            name: priority.priority,
            population: priority.count,
            color: getColorForPriority(priority.priority), // Define colors for priorities
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          }));
          const taskCreationData = data.taskCreationOverTime.map((entry) => ({
            label: `${entry.day}/${entry.month}/${entry.year}`, // Format as "DD/MM/YYYY"
            value: entry.count, // Task count for the date
          }));
          const workerTaskCounts = data.tasksAssignedToWorkers.reduce((acc, task) => {
            acc[task.email] = (acc[task.email] || 0) + task.count;
            return acc;
          }, {});
          const tasksAssignedData = Object.entries(workerTaskCounts).map(([email, count]) => ({
            label: email, // Worker email
            value: count, // Total tasks assigned
          }));

          setAnalyticsData({
            ...data,
            taskStatus: taskStatusData,
            taskPriority: taskPriorityData,
            taskCreation: taskCreationData,
            tasksAssigned: tasksAssignedData,
          });


        } else {
          throw new Error("Invalid API response structure.");
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch analytics data. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [activeFilter]);

  const chartData = analyticsData?.taskStatus || [];

  const getColorForStatus = (status) => {
    switch (status) {
      case "Backlog":
        return "#FF6384";
      case "In Progress":
        return "#36A2EB";
      case "Done":
        return "#4BC0C0";
      default:
        return "#CCCCCC";
    }
  };
  const getColorForPriority = (priority) => {
    switch (priority) {
      case "High":
        return "#FF0000";
      case "Medium":
        return "#FFA500";
      case "Low":
        return "#008000";
      default:
        return "#CCCCCC";
    }
  };



  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };





  useEffect(() => {
    console.log("Analytics Data:", analyticsData);
  }, [analyticsData]);




  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics</Text>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {["today", "thisWeek", "thisMonth", "lastSixMonths", "thisYear", "all"]?.map((filter: string) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterChange(filter)}
          >
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks by Status */}
      <Text style={styles.chartTitle}>Tasks by Status</Text>
      <View style={styles.chartContainer}>
        {chartData.length > 0 ? (
          <PieChart
            data={chartData}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No task status data available</Text>
        )}
      </View>

      {/* Tasks by Priority */}
      <Text style={styles.chartTitle}>Tasks by Priority</Text>
      <View style={styles.chartContainer}>
        {analyticsData?.taskPriority && analyticsData.taskPriority.length > 0 ? (
          <PieChart
            data={analyticsData.taskPriority}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No task priority data available</Text>
        )}
      </View>

      {/* Task Creation Over Time */}
      <Text style={styles.chartTitle}>Task Creation Over Time</Text>
      <View style={styles.chartContainer}>
        {analyticsData?.taskCreation && analyticsData.taskCreation.length > 0 ? (
          <LineChart
            data={{
              labels: analyticsData.taskCreation.map((entry) => entry.label), // Dates
              datasets: [
                {
                  data: analyticsData.taskCreation.map((entry) => entry.value), // Task counts
                  color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Line color
                  strokeWidth: 2, // Line thickness
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
          />
        ) : (
          <Text style={styles.noDataText}>No task creation data available</Text>
        )}
      </View>

      {/* Tasks Assigned to Each Worker */}
      <Text style={styles.chartTitle}>Tasks Assigned to Workers</Text>
      <View style={styles.chartContainer}>
        {analyticsData?.tasksAssigned && analyticsData.tasksAssigned.length > 0 ? (
          <BarChart
            data={{
              labels: analyticsData.tasksAssigned.map((entry) => entry.label), // Worker emails
              datasets: [
                {
                  data: analyticsData.tasksAssigned.map((entry) => entry.value), // Task counts
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chartStyle}
          />
        ) : (
          <Text style={styles.noDataText}>No tasks assigned data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

// Chart configuration for colors and styling
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#f7f7f7",
  backgroundGradientTo: "#f7f7f7",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 64
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    margin: 5,
    elevation: 3,
  },
  activeFilterButton: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007AFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default Analytics;
