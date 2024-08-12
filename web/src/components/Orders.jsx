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
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.map((order) => (
              <TableRow key={order.id} className="border-b border-yellow-100">
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user}</TableCell>
                <TableCell>{order.description}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Pending" ? "secondary" : "success"
                    }
                    className={
                      order.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.status === "Pending" && (
                    <Select
                      onValueChange={(value) =>
                        assignRider(order.id, parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-[180px] border-yellow-300 focus:ring-yellow-500">
                        <SelectValue placeholder="Assign to rider" />
                      </SelectTrigger>
                      <SelectContent>
                        {riderList
                          .filter((rider) => rider.available)
                          .map((rider) => (
                            <SelectItem
                              key={rider.id}
                              value={rider.id.toString()}
                            >
                              {rider.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
