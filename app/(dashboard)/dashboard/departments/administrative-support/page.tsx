import DepartmentPage from "@/components/DepartmentPage";

export default function AdministrativeSupportDepartmentPage() {
  return (
    <DepartmentPage
      title="Administrative & Support"
      description="Daily school operations and services that support the community."
      sections={["Admissions", "Procurement", "Facilities", "School Operations"]}
    />
  );
}
