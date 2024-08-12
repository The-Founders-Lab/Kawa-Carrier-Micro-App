import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function Orders({ orderList, riderList, assignRider }) {
  return (
    <Card className="border-yellow-200 shadow-lg">
      <CardHeader className="bg-yellow-100">
        <CardTitle className="text-yellow-800">Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-50">
              <TableHead className="text-yellow-700">Order ID</TableHead>
              <TableHead className="text-yellow-700">User</TableHead>
              <TableHead className="text-yellow-700">Description</TableHead>
              <TableHead className="text-yellow-700">Status</TableHead>
              <TableHead className="text-yellow-700">Assign Rider</TableHead>
              <TableHead className="text-yellow-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.map((order) => (
              <TableRow key={order._id} className="border-b border-yellow-100">
                <TableCell>{order.orderId}</TableCell>
                <TableCell>
                  {order.data.user.firstName} {order.data.user.lastName}
                </TableCell>
                <TableCell>{order.data.itemDescription}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.data.orderStatus === "delivered"
                        ? "success"
                        : "secondary"
                    }
                    className={
                      order.data.orderStatus === "delivered"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }
                  >
                    {order.data.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(order.data.orderStatus === "pending" &&
                    !order.data.rider && (
                      <Select
                        onValueChange={(value) =>
                          assignRider(order.orderId, value)
                        }
                      >
                        <SelectTrigger className="w-[180px] border-yellow-300 focus:ring-yellow-500">
                          <SelectValue placeholder="Assign to rider" />
                        </SelectTrigger>
                        <SelectContent>
                          <option value="">Assign a rider</option>
                          {riderList
                            .filter((rider) => rider.available)
                            .map((rider) => (
                              <SelectItem key={rider._id} value={rider._id}>
                                {rider.riderFirstName} {rider.riderLastName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )) ||
                    "-"}
                </TableCell>
                <TableCell>
                  {order.data?.rider &&
                    order.data.orderStatus !== "delivered" && (
                      // TODO: next
                      <Button onClick={() => assignRider()}>Action</Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

{
  /*!order.data.rider && (
                    <select
                      onChange={(event) => {
                        console.log("change");
                        assignRider(order.orderId, event.target.value);
                      }}
                    >
                      {riderList
                        .filter((rider) => rider.available)
                        .map((rider) => (
                          <option key={rider._id} value={rider._id.toString()}>
                            {rider.riderFirstName} {rider.riderLastName}
                          </option>
                        ))}
                    </select>
                  )*/
}
