import Orders from "@/components/Orders";
import Riders from "@/components/Riders";
import useGetAsyncHook from "@/getAsyncHook";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

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

  const reload = () => {
    setOrderReload((reload) => reload + 1);
    setRiderReload((reload) => reload + 1);
  };

  const assignRider = (orderId, riderId) => {
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
        console.log("hmm", data);
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

        console.log("update successful", data);
        toast({
          title: "Success",
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
  };

  if (!riderList || !orderList || pageLoading) {
    return <p>Loading</p>;
  }
  console.log(orderList);
  console.log(riderList);
  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-yellow-400 text-yellow-900 py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">0x Carrier Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 space-y-8">
        <Orders
          orderList={orderList}
          assignRider={assignRider}
          riderList={riderList}
        />

        <Riders riderList={riderList} />
      </main>
    </div>
  );
}
