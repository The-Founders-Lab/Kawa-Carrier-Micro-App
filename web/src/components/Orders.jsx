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

const orderStates = {
  processing: "processing",
  start: "start",
  pickup: "pickup",
  delivered: "delivered",
  delayed: "delayed",
};

const orderStatesSequence = {
  processing: [orderStates.start],
  start: [orderStates.pickup],
  pickup: [orderStates.delivered, orderStates.delayed],
  delayed: [orderStates.delivered],
};

const sampleOrderUpdate = {
  deliveryCode: 1000,
  orderStartCoord: {
    lat: 6.8214479,
    lng: 3.4497741,
  },
  riderPickUpCoord: {
    lat: 6.8214479,
    lng: 3.4497741,
  },
  riderDropOffCoord: {
    lat: 6.8214479,
    lng: 3.4497741,
  },
  deliveryImageLink: "",
};

export default function Orders({
  environmentMode,
  orderList,
  riderList,
  assignRider,
  updateOrderStatus,
}) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-black">
        <CardTitle className="text-slate-100">
          {environmentMode &&
            environmentMode[0].toUpperCase() + environmentMode?.slice(1)}{" "}
          Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
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
              <TableRow
                key={order.orderId}
                className="border-b border-slate-100"
              >
                <TableCell>{order.orderId}</TableCell>
                <TableCell>
                  {order.data.user.firstName} {order.data.user.lastName}
                </TableCell>
                <TableCell>{order.data.itemDescription}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.data.orderStatus === orderStates.delivered
                        ? "success"
                        : "secondary"
                    }
                    className={
                      order.data.orderStatus === orderStates.delivered
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }
                  >
                    {order.data.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(order.data.orderStatus === orderStates.processing &&
                    !order.data.rider && (
                      <Select
                        onValueChange={(value) =>
                          assignRider(order.orderId, value)
                        }
                      >
                        <SelectTrigger className="w-[180px] border-slate-800 focus:ring-slate-500">
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
                    order.data.orderStatus !== orderStates.delivered && (
                      <Select
                        onValueChange={(value) =>
                          updateOrderStatus(
                            order.orderId,
                            value,
                            sampleOrderUpdate,
                          )
                        }
                      >
                        <SelectTrigger className="w-[180px] border-slate-800 focus:ring-slate-500">
                          <SelectValue placeholder="Update Order Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <option value="">Choose a status</option>
                          {orderStatesSequence[order.data.orderStatus]?.map(
                            (validStatus) => (
                              <SelectItem key={validStatus} value={validStatus}>
                                {validStatus}
                              </SelectItem>
                            ),
                          )}
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
