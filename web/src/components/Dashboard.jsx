import Orders from "@/components/Orders";
import Riders from "@/components/Riders";
import useGetAsyncHook from "@/hooks/useGetAsyncHook";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { RefreshCw } from "lucide-react";
import Header from "./Header";
import * as utils from "@/utils";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const ENVIRONMENTS = {
  test: "test",
  live: "live",
};

export default function Dashboard() {
  const [environmentMode, setEnvironmentMode] = useState(ENVIRONMENTS.test);
  const { data: orderList, setReload: setOrderReload } = useGetAsyncHook(
    `${SERVER_URL}/orders?environment=${environmentMode}`,
  );
  const { data: riderList, setReload: setRiderReload } = useGetAsyncHook(
    `${SERVER_URL}/riders`,
  );
  const [pageIsLoading, setPageIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // NOTE: The use of polling here is NOT RECOMMENDED.
    // This is for testing purposes only
    const orderRefreshId = setInterval(() => {
      toast({
        title: (
          <p className="flex gap-x-1 items-center">
            <RefreshCw fontSize={5} className="text-yellow-500" /> Syncing
            Orders
          </p>
        ),
      });
      setOrderReload((reload) => reload + 1);
    }, 5000);
    return () => clearInterval(orderRefreshId);
  }, []);

  function reload() {
    setOrderReload((reload) => reload + 1);
    setRiderReload((reload) => reload + 1);
    setPageIsLoading(false);
  }

  async function assignRider(orderId, riderId) {
    try {
      setPageIsLoading(true);
      const data = await utils.assignRider(orderId, riderId);
      setPageIsLoading(false);
      toast({
        title: "Order assigned successfully",
        variant: "success",
        description: data?.message || data?.response?.message,
      });
      reload();
    } catch (error) {
      setPageIsLoading(false);
      console.log("error while assigning rider", error);
      toast({
        title: "Error",
        description:
          error?.message || error?.response?.message || "Something went wrong",
      });
    }
  }

  async function updateOrderStatus(orderId, status = "", otherUpdateData) {
    try {
      setPageIsLoading(true);
      await utils.updateOrderStatus(orderId, status, otherUpdateData);
      setPageIsLoading(false);
      toast({
        title: "Success",
        variant: "success",
        description: `Order "${status}" successfully`,
      });
      reload();
    } catch (error) {
      setPageIsLoading(false);
      console.log("error", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: error?.message || "Something went wrong",
      });
    }
  }

  async function handleEnvironmentChange() {
    setPageIsLoading(true);
    setEnvironmentMode(
      environmentMode === ENVIRONMENTS.test
        ? ENVIRONMENTS.live
        : ENVIRONMENTS.test,
    );
    reload();
    setPageIsLoading(false);
    toast({
      title: "Success",
      variant: "success",
      description: "Environment switched successfully",
    });
  }

  if (!riderList || !orderList || pageIsLoading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-gray-200">
      <main className="container mx-auto p-4 pb-32 space-y-8">
        <Header
          environmentMode={environmentMode}
          handleEnvironmentChange={handleEnvironmentChange}
        />
        <Orders
          environmentMode={environmentMode}
          orderList={orderList}
          assignRider={assignRider}
          riderList={riderList}
          updateOrderStatus={updateOrderStatus}
        />

        <Riders orderList={orderList} riderList={riderList} />
      </main>
      <footer className="text-center py-5">
        &copy; 2024. KAWA - The Founders Lab
      </footer>
    </div>
  );
}
