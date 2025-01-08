# RoleTasker Mobile Application

RoleTasker is an innovative **task management mobile application** built using **React Native**. The application is designed to streamline task assignments and tracking by catering to three distinct types of users: **Admin**, **Assigner**, and **Worker**. With its user-friendly interface and role-specific features, RoleTasker ensures efficient collaboration and effective task handling.

---

## Demo Video 🎥

To see RoleTasker in action, watch the [recorded demo video](https://photos.app.goo.gl/dUKxF7q9P7wPwpZJ6).

---

## Technology Stack 🛠️

The RoleTasker application is powered by a modern and robust technology stack to ensure high performance, scalability, and a smooth user experience. Below are the technologies used:

| **Technology**        | **Purpose**                              | **Icon**  |
|------------------------|------------------------------------------|-----------|
| **React Native**       | Build the mobile application interface  | ⚛️        |
| **React Query**        | API management for state synchronization | 🔄       |
| **Expo Go**            | Development framework for quick testing | 📱        |
| **Node.js**            | Backend runtime environment             | 🌐       |
| **Express.js**         | Web framework for API implementation    | 🚀        |
| **JWT (JSON Web Token)** | Secure authentication and authorization | 🔒       |
| **MongoDB**            | NoSQL database for data storage         | 🗄️        |
| **TypeScript**         | Strongly-typed language for scalability | 🛡️       |

---

## 1. Assigner

The **Assigner** plays a pivotal role in creating and managing tasks within the application. Assigners are responsible for task delegation and ensuring tasks are assigned to the appropriate workers.

- **Responsibilities of an Assigner:**
  1. **Task Creation and Assignment:**  
     Assigners can create tasks and assign them to one or multiple workers based on the requirements.
  2. **Task Management:**  
     - Edit or update task details such as title, description, priority, and deadline.  
     - Delete tasks that are no longer relevant.
  3. **Dashboard for Analysis:**  
     - View task-related data in an interactive dashboard, providing insights into task status, progress, and other critical metrics.

- **Features on the Task Page:**
  - **Search Functionality:**  
    Search tasks using keywords from the task title or description, ensuring quick access to relevant tasks.
  - **Filter Options:**  
    Apply filters to narrow down the task list based on:
    - **Creation Date (`createdAt`)**
    - **Task Status (e.g., Pending, In Progress, Completed)**
    - **Priority Level**
    - **Specific Days** (e.g., tasks created on a specific date)

---

## 2. Worker

The **Worker** is the recipient of assigned tasks and plays an essential role in task execution. Workers are equipped with tools to interact with tasks and provide updates on their progress.

- **Responsibilities of a Worker:**
  1. **Task Interaction:**  
     After being assigned tasks by an Assigner, workers can update the task's status to reflect progress or completion.
  2. **Task Commentary:**  
     - Add comments to tasks for better communication or to highlight issues, progress, or feedback.

- **Features on the Worker’s Dashboard:**
  - Visualize assigned task data in an intuitive layout, helping workers prioritize and manage their workload effectively.

- **Features on the Task List:**
  - **Search and Filter Functionality:**  
    Workers can use the same search and filter options available to Assigners, including sorting by:
    - Title/Description keywords
    - Status, priority, and creation date

---

## 3. Admin

The **Admin** has the highest level of control within the RoleTasker application. They oversee all data, ensuring smooth operation and resolving issues when needed.

- **Responsibilities of an Admin:**
  1. **Full Data Access:**  
     Admins can view and manage all tasks, users, and associated data across the platform.
  2. **Task Oversight:**  
     - Access a comprehensive task listing page to monitor tasks across all users.  
     - Identify trends, address bottlenecks, and ensure tasks are distributed efficiently.

- **Features on the Task Listing Page:**
  - **Search Functionality:**  
    - Search tasks by text from titles or descriptions.  
    - Search tasks by the **owner's email** to view all tasks created by a specific user.  
    - Search tasks by the **worker's email** to filter tasks assigned to a particular worker.
  - **Sorting and Filtering Options:**  
    Admins can sort and filter tasks using multiple factors, such as:
    - Task creation date
    - Owner/Assignee details
    - Priority and status

- **Features on the Admin Dashboard:**
  - The Admin dashboard includes a variety of **graphical data visualizations** to provide actionable insights into:
    - Task creation trends
    - Completion rates
    - Worker performance
    - Overall platform usage

---

## Why RoleTasker?

RoleTasker is designed to tackle common challenges in task management by offering tailored tools for different user roles. It aims to:
- Enhance productivity with streamlined workflows.
- Promote collaboration through clear communication features.
- Provide actionable insights via dashboards and data visualization.

This application bridges the gap between task creation and execution, ensuring that every stakeholder has the tools they need to succeed.

---

## Conclusion

With its robust features and role-based functionality, RoleTasker is an all-in-one solution for task management. Whether you're an **Admin** overseeing the platform, an **Assigner** managing tasks, or a **Worker** executing them, RoleTasker empowers users to work efficiently and collaboratively.
