import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { getWorkerAnalyticsData } from "../../api/api";

const jsonData = {
  "filters": ["Today", "This Week", "This Month", "Last Six Months", "This Year", "All"],
  "data": {
    "Today": {
      "taskStatus": [
        { "name": "Done", "population": 2, "color": "#1E90FF" },
        { "name": "In Progress", "population": 5, "color": "#32CD32" },
        { "name": "Backlog", "population": 3, "color": "#FFA500" },
        { "name": "Archived", "population": 1, "color": "#FF4500" }
      ],
      "taskPriority": [
        { "name": "High", "population": 4, "color": "#FF6347" },
        { "name": "Medium", "population": 4, "color": "#FFD700" },
        { "name": "Low", "population": 3, "color": "#3CB371" }
      ],
      "taskCreation": {
        "labels": ["Morning", "Afternoon", "Evening"],
        "datasets": [{ "data": [3, 5, 2] }]
      },
      "taskAssignees": {
        "labels": ["John", "Jane", "Doe"],
        "datasets": [{ "data": [3, 4, 3] }]
      }
    },
    "This Week": {
      "taskStatus": [
        { "name": "Done", "population": 10, "color": "#1E90FF" },
        { "name": "In Progress", "population": 12, "color": "#32CD32" },
        { "name": "Backlog", "population": 5, "color": "#FFA500" },
        { "name": "Archived", "population": 2, "color": "#FF4500" }
      ],
      "taskPriority": [
        { "name": "High", "population": 7, "color": "#FF6347" },
        { "name": "Medium", "population": 12, "color": "#FFD700" },
        { "name": "Low", "population": 10, "color": "#3CB371" }
      ],
      "taskCreation": {
        "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "datasets": [{ "data": [3, 5, 4, 7, 6, 8, 2] }]
      },
      "taskAssignees": {
        "labels": ["John", "Jane", "Doe", "Smith"],
        "datasets": [{ "data": [5, 6, 4, 5] }]
      }
    },
    "This Month": {
      "taskStatus": [
        { "name": "Done", "population": 30, "color": "#1E90FF" },
        { "name": "In Progress", "population": 25, "color": "#32CD32" },
        { "name": "Backlog", "population": 10, "color": "#FFA500" },
        { "name": "Archived", "population": 5, "color": "#FF4500" }
      ],
      "taskPriority": [
        { "name": "High", "population": 15, "color": "#FF6347" },
        { "name": "Medium", "population": 25, "color": "#FFD700" },
        { "name": "Low", "population": 20, "color": "#3CB371" }
      ],
      "taskCreation": {
        "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
        "datasets": [{ "data": [10, 15, 20, 30] }]
      },
      "taskAssignees": {
        "labels": ["John", "Jane", "Doe", "Smith"],
        "datasets": [{ "data": [10, 8, 7, 10] }]
      }
    },
    "Last Six Months": {
      "taskStatus": [
        { "name": "Done", "population": 100, "color": "#1E90FF" },
        { "name": "In Progress", "population": 80, "color": "#32CD32" },
        { "name": "Backlog", "population": 50, "color": "#FFA500" },
        { "name": "Archived", "population": 20, "color": "#FF4500" }
      ],
      "taskPriority": [
        { "name": "High", "population": 40, "color": "#FF6347" },
        { "name": "Medium", "population": 60, "color": "#FFD700" },
        { "name": "Low", "population": 50, "color": "#3CB371" }
      ],
      "taskCreation": {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "datasets": [{ "data": [10, 20, 30, 40, 50, 60] }]
      },
      "taskAssignees": {
        "labels": ["John", "Jane", "Doe", "Smith"],
        "datasets": [{ "data": [25, 30, 20, 25] }]
      }
    },
    "This Year": {
      "taskStatus": [
        { "name": "Done", "population": 200, "color": "#1E90FF" },
        { "name": "In Progress", "population": 150, "color": "#32CD32" },
        { "name": "Backlog", "population": 70, "color": "#FFA500" },
        { "name": "Archived", "population": 30, "color": "#FF4500" }
      ],
      "taskPriority": [
        { "name": "High", "population": 80, "color": "#FF6347" },
        { "name": "Medium", "population": 100, "color": "#FFD700" },
        { "name": "Low", "population": 80, "color": "#3CB371" }
      ],
      "taskCreation": {
        "labels": ["Q1", "Q2", "Q3", "Q4"],
        "datasets": [{ "data": [50, 70, 80, 100] }]
      },
      "taskAssignees": {
        "labels": ["John", "Jane", "Doe", "Smith", "Emily"],
        "datasets": [{ "data": [50, 40, 35, 45, 30] }]
      }
    },
    "All": {
      "taskStatus": [
        { "name": "Done", "population": 500, "color": "#1E90FF" },
        { "name": "In Progress", "population": 300, "color": "#32CD32" },
        { "name": "Backlog", "population": 200, "color": "#FFA500" },
        { "name": "Archived", "population": 100, "color": "#FF4500" }
      ],
      "taskPriority": [
        { "name": "High", "population": 150, "color": "#FF6347" },
        { "name": "Medium", "population": 200, "color": "#FFD700" },
        { "name": "Low", "population": 150, "color": "#3CB371" }
      ],
      "taskCreation": {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "datasets": [{ "data": [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150] }]
      },
      "taskAssignees": {
        "labels": ["John", "Jane", "Doe", "Smith", "Emily", "Alice"],
        "datasets": [{ "data": [100, 90, 80, 70, 60, 50] }]
      }
    }
  }
}


const Analytics: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const filterQuery = activeFilter ? `?filter=${encodeURIComponent(activeFilter)}` : "";
        const response = await getWorkerAnalyticsData(filterQuery);
        console.log("API Response on worker analytics:", response.data);

        if (response?.data) {

          const taskStatusData = response?.data.tasksByStatus.map((status) => ({
            name: status.status,
            population: status.count,
            color: getColorForStatus(status.status),
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          }));

          const taskPriorityData = response?.data.tasksByPriority.map((priority) => ({
            name: priority.priority,
            population: priority.count,
            color: getColorForPriority(priority.priority),
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          }));
          const taskAssignOverTime = response?.data.tasksOverTime.map((entry) => ({
            label: `${entry.day}/${entry.month}/${entry.year}`,
            value: entry.count,
          }));

          const taskAssignerData = {
            labels: response?.data.tasksByAssigner.map((item) => item.name),
            datasets: [
              {
                data: response?.data.tasksByAssigner.map((item) => item.count),
              },
            ],
          };


          setAnalyticsData({
            ...response?.data,
            taskStatus: taskStatusData,
            taskPriority: taskPriorityData,
            taskCreation: taskAssignOverTime,
            taskAssignerData: taskAssignerData,
          });

          setError(null);

        } else {
          throw new Error("Invalid API response structure.");
        }


      } catch (error) {
        setError("Failed to fetch analytics data. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalyticsData()
  }, [activeFilter])
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

  const chartData = analyticsData?.taskStatus || [];




  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };


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
        {["Today", "This Week", "This Month", "Last Six Months", "This Year", "All"]?.map((filter) => (
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
            data={analyticsData.taskStatus}
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


      {/* Tasks Assigned by each assigner*/}
      <Text style={styles.chartTitle}>Tasks by Assigner</Text>
      <View style={styles.chartContainer}>
        {analyticsData?.taskAssignerData  ? (
          <BarChart
            data={analyticsData.taskAssignerData}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#f7f7f7",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.7,
            }}
            verticalLabelRotation={30}
            style={styles.chartStyle}
          />
        ) : (
          <Text style={styles.noDataText}>No task assigner data available</Text>
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
    marginBottom: 28
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
