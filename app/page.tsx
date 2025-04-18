'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";

import { Order } from "@/types/spire";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const lastFetchedAt = useRef<Date>(new Date());

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.records);
    lastFetchedAt.current = new Date();
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100'
      case 'complete': return 'bg-green-100'
      case 'cancelled': return 'bg-red-100'
      default: return 'bg-white'
    }
  }

  const isNewOrder = (date: string) => {
    return new Date(date) > lastFetchedAt.current
  }

  const orderStatus = (status: string) => {
    switch (status) {
      case 'C': return 'Closed'
      case 'L': return 'Deposit'
      case 'O': return 'Open'
      case 'P': return 'Processed'
      case 'S': return 'Shipped'
      default: return status
    }
  }

  return (
    <main className="w-screen h-screen bg-gray-100 p-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">📦 Online Orders Dashboard</h1>

      <div className="rounded-md border bg-white shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: Order) => (
              <TableRow
                key={order.id}
                className={`transition-all duration-300 ${getStatusColor(order.status)} ${isNewOrder(order.created) ? 'animate-pulse' : ''}`}
              >
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{new Date(order.created).toLocaleString()}</TableCell>
                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                <TableCell className="font-medium">{orderStatus(order.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
