import DepartmentPage from "@/components/DepartmentPage";

export default function AcademicsDepartmentPage() {
  return (
    <DepartmentPage
      title="Academics"
      description="Teaching, learning, and academic progress across the school."
      sections={["Sessions", "Classes", "Subjects", "Results"]}
    />
  );
}
