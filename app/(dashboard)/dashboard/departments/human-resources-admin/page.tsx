import DepartmentPage from "@/components/DepartmentPage";

export default function HumanResourcesAdminDepartmentPage() {
  return (
    <DepartmentPage
      title="Human Resources & Admin"
      description="Staff management and people-focused school administration."
      sections={["Staff Directory", "Roles & Responsibilities", "Leave & Attendance", "Administration"]}
    />
  );
}
