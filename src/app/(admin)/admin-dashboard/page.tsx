"use client";

import React, { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the chart components we need
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
);
import { Spinner } from "@nextui-org/react";

import { useGetAllUsers } from "@/src/hooks/user.hooks";
import { useFetchRecipes } from "@/src/hooks/post.hooks";

const AdminDashboard = () => {
  const { data: usersData, isLoading: usersLoading } = useGetAllUsers();
  const { data: recipeData, isLoading: recipesLoading } = useFetchRecipes();

  // Get reported users with their report numbers
  const reportedUsers = useMemo(() => {
    return (
      usersData?.data?.filter((user: { report: number }) => user.report > 0) ||
      []
    );
  }, [usersData]);

  // Get reported recipes with their report numbers
  const reportedRecipes = useMemo(() => {
    return (
      recipeData?.filter((recipe: { report: number }) => recipe.report > 0) ||
      []
    );
  }, [recipeData]);

  if (usersLoading || recipesLoading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Spinner color="white" size="lg" className="my-8" />
      </div>
    );
  }

  // Data for the scatter plot
  const chartData = {
    datasets: [
      {
        label: "Reported Users",
        data: reportedUsers.map((user: { report: any }, _index: any) => ({
          x: "Users",
          y: user.report, // Use the user's report number
        })),
        backgroundColor: "#FF6384", // Color for users
        pointRadius: 6,
      },
      {
        label: "Reported Recipes",
        data: reportedRecipes.map((recipe: { report: any }, _index: any) => ({
          x: "Recipes",
          y: recipe.report, // Use the recipe's report number
        })),
        backgroundColor: "#36A2EB", // Color for recipes
        pointRadius: 6,
      },
    ],
  };

  // Options for the scatter plot
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "category" as const, // Explicitly set the type to "category"
        labels: ["Users", "Recipes"], // Custom labels for the categories on the x-axis
        title: {
          display: true,
          text: "Categories",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Report Count",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Reported Users and Recipes with Report Numbers",
      },
    },
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Scatter Plot */}
      <div className="w-full max-w-md">
        <Scatter data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminDashboard;
