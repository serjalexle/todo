import AuthGuard from "@/shared/guards/AuthGuard";

const DashboardPage = () => {
  return (
    <AuthGuard>
      <h2>Dashboard</h2>
    </AuthGuard>
  );
};

export default DashboardPage;
