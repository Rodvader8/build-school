import PlanForm from '@/components/PlanForm.jsx';

export default function Home() {
  return (
    <>
      <h1>Event planner</h1>
      <p className="lede">Describe an event and get back a plan as checked data, not loose text.</p>
      <PlanForm />
    </>
  );
}
