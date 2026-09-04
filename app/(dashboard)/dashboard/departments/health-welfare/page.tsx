import DepartmentPage from "@/components/DepartmentPage";

export default function HealthWelfareDepartmentPage() {
  return (
    <DepartmentPage
      title="Health & Welfare"
      description="Student wellbeing, health, safeguarding, and welfare support."
      sections={["Student Health", "Welfare Support", "Safeguarding", "Wellbeing"]}
    />
  );
}
