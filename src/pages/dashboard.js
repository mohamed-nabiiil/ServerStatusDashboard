import { useState, useEffect, useMemo } from "react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { mockServers } from "../data/mockServers";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [servers, setServers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("None");

  // Check user session
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/loginpage");
      } else {
        setServers(mockServers);
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  // Status badge generator
  const statusBadge = (status) => {
    const statusColors = {
      Up: "bg-green-500",
      Down: "bg-red-500",
      Degraded: "bg-yellow-500",
    };
    return (
      <span className={`px-3 py-1 rounded ${statusColors[status]} text-white`}>
        {status}
      </span>
    );
  };

  // Filter servers based on status
  const filteredServers = useMemo(() => {
    return filterStatus === "All"
      ? servers
      : servers.filter((server) => server.status === filterStatus);
  }, [filterStatus, servers]);

  // Sort servers based on selected criteria
  const sortedServers = useMemo(() => {
    const sortByResponseTime = (a, b) =>
      (parseInt(a.responseTime) || Infinity) -
      (parseInt(b.responseTime) || Infinity);
    const sortByUptime = (a, b) =>
      (parseFloat(b.uptime.replace("%", "")) || 0) -
      (parseFloat(a.uptime.replace("%", "")) || 0);

    if (sortOption === "Response Time")
      return [...filteredServers].sort(sortByResponseTime);
    if (sortOption === "Uptime") return [...filteredServers].sort(sortByUptime);
    return filteredServers;
  }, [sortOption, filteredServers]);

  // Logout function
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/loginpage" });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between pb-10">
        <h1 className="text-2xl font-bold">Server Status Dashboard</h1>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      {/* Filter and Sort Options */}
      <div className="flex space-x-4 mb-4">
        <div>
          <label htmlFor="statusFilter" className="mr-2">
            Filter by status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All</option>
            <option value="Up">Up</option>
            <option value="Down">Down</option>
            <option value="Degraded">Degraded</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOption" className="mr-2">
            Sort by:
          </label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="None">None</option>
            <option value="Response Time">Response Time</option>
            <option value="Uptime">Uptime</option>
          </select>
        </div>
      </div>

      {/* Server List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedServers.map((server) => (
          <div
            key={server.id}
            className="border p-4 rounded shadow-md hover:shadow-xl"
          >
            <h2 className="text-lg font-semibold">{server.name}</h2>
            <p>IP Address: {server.ipAddress}</p>
            <p>Response Time: {server.responseTime} ms</p>
            <p>Uptime: {server.uptime}</p>
            {statusBadge(server.status)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
