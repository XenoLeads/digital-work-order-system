const MetricCard = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div className="flex-1 text-center bg-neutral-800 rounded-sm p-4">
      <h1>{label}:</h1>
      <p>{value}</p>
    </div>
  );
};

export default MetricCard;
