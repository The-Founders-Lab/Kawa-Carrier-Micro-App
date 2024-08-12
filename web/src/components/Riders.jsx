import React from "react";
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

export default function Riders({ riderList }) {
  return (
    <Card className="border-yellow-200 shadow-lg">
      <CardHeader className="bg-yellow-100">
        <CardTitle className="text-yellow-800">Riders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-50">
              <TableHead className="text-yellow-700">Name</TableHead>
              <TableHead className="text-yellow-700">Availability</TableHead>
              <TableHead className="text-yellow-700">
                Assigned Order ID
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {riderList.map((rider) => (
              <TableRow key={rider._id} className="border-b border-yellow-100">
                <TableCell>
                  {rider.riderLastName} {rider.riderFirstName}
                </TableCell>
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
                <TableCell>
                  {(!rider.available && rider?.orderId) || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
