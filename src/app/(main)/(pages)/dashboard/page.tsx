import React from "react";

const DashboardPage = () => {
  // Dynamic Greeting based on time
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning 🌅"
      : currentHour < 18
        ? "Good Afternoon ☀️"
        : "Good Evening 🌙";

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen">
      {/* Header with Greeting */}
      <h1 className="text-4xl font-bold sticky top-0 z-10 p-6 bg-background/50 backdrop-blur-lg border-b text-foreground">
        {greeting}, Welcome to Your Dashboard!
      </h1>
    </div>
  );
};

export default DashboardPage;
