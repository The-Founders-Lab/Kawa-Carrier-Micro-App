import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Orders from "./Orders";

// Mock data for orders and riders

const orders = [
  {
    id: 1,
    user: "John Doe",
    description: "2x Pizza",
    status: "Pending",
    riderId: null,
  },
  {
    id: 2,
    user: "Jane Doe",
    description: "1x Burger, 1x Fries",
    status: "Assigned",
    riderId: 2,
  },
  {
    id: 3,
    user: "Mr Bob",
    description: "3x Tacos",
    status: "Pending",
    riderId: null,
  },
];
const riders = [
  { id: 1, name: "Mike Ross", available: true, orderId: null },
  { id: 2, name: "Rachel Zane", available: false, orderId: 2 },
  { id: 3, name: "Harvey Specter", available: true, orderId: null },
];

export default function Dashboard() {
  const [orderList, setOrderList] = useState(orders);
  const [riderList, setRiderList] = useState(riders);

  const assignRider = (orderId, riderId) => {
    setOrderList(
      orderList.map((order) =>
        order.id === orderId
          ? { ...order, status: "Assigned", riderId }
          : order,
      ),
    );
    setRiderList(
      riderList.map((rider) =>
        rider.id === riderId ? { ...rider, available: false, orderId } : rider,
      ),
    );
  };

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

        <Card className="border-yellow-200 shadow-lg">
          <CardHeader className="bg-yellow-100">
            <CardTitle className="text-yellow-800">Riders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-yellow-50">
                  <TableHead className="text-yellow-700">Name</TableHead>
                  <TableHead className="text-yellow-700">
                    Availability
                  </TableHead>
                  <TableHead className="text-yellow-700">
                    Assigned Order ID
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riderList.map((rider) => (
                  <TableRow
                    key={rider.id}
                    className="border-b border-yellow-100"
                  >
                    <TableCell>{rider.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={rider.available ? "success" : "secondary"}
                        className={
                          rider.available
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }
                      >
                        {rider.available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>{rider.orderId || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
