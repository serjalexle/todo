import AuthGuard from "@/shared/guards/AuthGuard";
import Dashboard from "@/widgets/dashboard/DashboardPage";

const DashboardPage = () => {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
};

export default DashboardPage;
