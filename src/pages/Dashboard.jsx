import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile, simulateTokenExpiry } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import LogPanel from "../components/LogPanel"; 

const Dashboard = () => {
  const { logout } = useAuth();

  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Auth System Dashboard</h1>
        
        {/* Layout Grid: Trái (Main) - Phải (Logs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CỘT TRÁI: Nội dung chính */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">User Status</h2>
              
              {isLoading && <div className="text-gray-500">Loading user data...</div>}

              {error ? (
                 <div className="bg-red-50 p-4 rounded text-red-600 border border-red-200">
                   <p className="font-bold">Access Denied / Fetch Error</p>
                   <p className="text-sm">{error.response?.data?.message || "Unknown error"}</p>
                 </div>
              ) : (
                user && (
                  <div className="bg-green-50 p-4 rounded border border-green-200">
                    <p className="text-green-800 font-medium">✅ Data Fetched Successfully</p>
                    <div className="mt-2 text-sm text-gray-700">
                        <p>Name: <span className="font-bold">{user.name}</span></p>
                        <p>Email: {user.email}</p>
                        <p>ID: {user.id}</p>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Test Controls</h2>
              <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    <strong>Bước 1:</strong> Bấm nút bên dưới để làm hỏng Token trong bộ nhớ.
                  </div>
                  <button
                    onClick={() => {
                      simulateTokenExpiry();
                    }}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition"
                  >
                    ⚡ Corrupt Access Token
                  </button>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                    <strong>Bước 2:</strong> Bấm Refetch. Quan sát bảng Log bên phải thấy nó tự động Refresh.
                  </div>
                  <button
                    onClick={() => refetch()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                  >
                    🔄 Refetch Data
                  </button>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded shadow"
            >
              Logout
            </button>
          </div>

          {/* CỘT PHẢI: Log Panel */}
          <div className="flex flex-col h-full">
            <div className="sticky top-8">
                <LogPanel />
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Live logs from Axios Interceptor & Auth State
                </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;