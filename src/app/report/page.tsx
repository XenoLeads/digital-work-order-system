import type { Asset } from "@/types";
import WorkOrderForm from "@/components/WorkOrderForm";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL;

const Page = async () => {
  const response = await fetch(`${BACKEND_URL}/assets`, { cache: "no-store" });
  const json = await response.json();
  const assets: Asset[] = json.success ? json.data : [];

  return (
    <div className="text-white h-full w-full flex justify-center items-center">
      <WorkOrderForm assets={assets} />
    </div>
  );
};

export default Page;
