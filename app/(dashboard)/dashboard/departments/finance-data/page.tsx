import DepartmentPage from "@/components/DepartmentPage";

export default function FinanceDataDepartmentPage() {
  return (
    <DepartmentPage
      title="Finance & Data"
      description="Financial oversight, payments, and reliable school information."
      sections={["Fees & Payments", "Invoices", "Reports", "Data Management"]}
    />
  );
}
