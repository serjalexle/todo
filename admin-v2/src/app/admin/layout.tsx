import AdminLayout from "@/widgets/layouts/AdminLayout/AdminLayout";
import React from "react";

interface IProps {
  children: React.ReactNode;
}

const AdminLayoutPage = ({ children }: IProps) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminLayoutPage;
