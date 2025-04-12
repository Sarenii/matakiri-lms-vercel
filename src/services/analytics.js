// src/services/analytics.js

// Mock API calls. Replace with real API endpoints.

export const getStudentAnalytics = async (studentId) => {
    // Fetch course progress data
    const courseProgress = [
      { date: '2023-09-01', progress: 20 },
      { date: '2023-10-01', progress: 40 },
      { date: '2023-11-01', progress: 60 },
      { date: '2023-12-01', progress: 80 },
      { date: '2024-01-01', progress: 100 },
    ];
  
    // Fetch category distribution data
    const categoryDistribution = [
      { name: 'Mathematics', value: 40 },
      { name: 'Science', value: 30 },
      { name: 'Arts', value: 20 },
      { name: 'Technology', value: 10 },
    ];
  
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    return { courseProgress, categoryDistribution };
  };
  