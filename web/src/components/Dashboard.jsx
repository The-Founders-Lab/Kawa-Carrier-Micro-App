import Orders from "@/components/Orders";
import Riders from "@/components/Riders";
import useGetAsyncHook from "@/getAsyncHook";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Dashboard() {
  const [pageLoading, setPageLoading] = useState(false);
  const { data: orderList, setReload: setOrderReload } = useGetAsyncHook(
    `${SERVER_URL}/orders`,
  );
  const { data: riderList, setReload: setRiderReload } = useGetAsyncHook(
    `${SERVER_URL}/riders`,
  );
  const { toast } = useToast();

  useEffect(() => {
    // NOTE: The use of polling here is NOT RECOMMENDED.
    // This is for testing purposes only
    const orderRefreshId = setInterval(() => {
      toast({
        title: "Syncing Orders",
        description: "Pulling fresh data",
      });
      setOrderReload((reload) => reload + 1);
    }, 10000);
    return () => clearInterval(orderRefreshId);
  }, []);

  function reload() {
    setOrderReload((reload) => reload + 1);
    setRiderReload((reload) => reload + 1);
  }

  function assignRider(orderId, riderId) {
    setPageLoading(true);
    fetch(`${SERVER_URL}/orders/assign-rider`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        riderId,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setPageLoading(true);
        if (data.response.statusCode !== 200) {
          setPageLoading(false);
          return toast({
            title: "Error",
            variant: "destructive",
            description:
              data?.message ||
              data?.response?.message ||
              "Something went wrong",
          });
        }

        toast({
          title: "Order assigned successfully",
          variant: "success",
          description: data?.message || data?.response?.message,
        });
        setPageLoading(false);
        reload();
      })
      .catch((error) => {
        console.log("error", error);
        toast({
          title: "Error",
          description:
            error?.message ||
            error?.response?.message ||
            "Something went wrong",
        });
        setPageLoading(false);
      });
  }

  function updateOrderStatus(orderId, status = "", otherUpdateData) {
    fetch(`${SERVER_URL}/orders/update-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        orderStatus: status,
        ...otherUpdateData,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.data.statusCode !== 200) {
          return toast({
            title: "Error",
            variant: "destructive",
            description: data?.message || "Something went wrong",
          });
        }

        toast({
          title: "Success",
          variant: "success",
          description: `Order "${status}" successfully`,
        });
        reload();
      })
      .catch((error) => {
        console.log("error", error);
        toast({
          title: "Error",
          description: error?.message || "Something went wrong",
        });
      });
  }

  if (!riderList || !orderList || pageLoading) {
    return <p>Loading</p>;
  }
  return (
    <div className="min-h-screen bg-gray-200">
      <header className="bg-black text-slate-100 py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">0x Carrier Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 space-y-8">
        <Orders
          orderList={orderList}
          assignRider={assignRider}
          riderList={riderList}
          updateOrderStatus={updateOrderStatus}
        />

        <Riders orderList={orderList} riderList={riderList} />
      </main>
    </div>
  );
}
