"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSettingsStore } from "@/lib/store";
import { LocationModal } from "@/components/LocationModal";
import { Settings2 } from "lucide-react";

import { Order } from "@/types/spire";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const { territory } = useSettingsStore();
  const lastFetchedAt = useRef<Date>(new Date());

  const ordersPerPage = 10;

  const fetchOrders = async () => {
    const territory = useSettingsStore.getState().territory;
    const res = await fetch(`/api/orders?territoryCode=${territory}`);
    const data = await res.json();
    setOrders(data.records);
    lastFetchedAt.current = new Date();
    setCurrentPage(0);
  };

  const paginatedOrders = useMemo(() => {
    const pages = [];
    for (let i = 0; i < orders.length; i += ordersPerPage) {
      pages.push(orders.slice(i, i + ordersPerPage));
    }
    return pages;
  }, [orders]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [territory]);

  useEffect(() => {
    if (paginatedOrders.length <= 1) return;
    const cycle = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % paginatedOrders.length);
    }, 10000);
    return () => clearInterval(cycle);
  }, [paginatedOrders]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100";
      case "complete":
        return "bg-green-100";
      case "cancelled":
        return "bg-red-100";
      default:
        return "bg-white";
    }
  };

  const isNewOrder = (date: string) => {
    return new Date(date) > lastFetchedAt.current;
  };

  const orderStatus = (status: string) => {
    switch (status) {
      case "C":
        return "Closed";
      case "L":
        return "Deposit";
      case "O":
        return "Open";
      case "P":
        return "Processed";
      case "S":
        return "Shipped";
      default:
        return status;
    }
  };

  return (
    <main className="w-screen h-screen flex flex-col bg-gray-100 p-4 relative">
      <header className="flex items-center justify-between pb-4">
        <h1 className="text-3xl font-bold">📦 Online Orders Dashboard</h1>
        <Button onClick={() => setModalOpen(true)} title="Settings">
          <Settings2 className="w-5 h-5" />
        </Button>
        <LocationModal open={modalOpen} onOpenChange={setModalOpen} />
      </header>

      <section className="grow overflow-hidden rounded-md border bg-white shadow">
        <Table className="w-full h-full text-2xl">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders[currentPage]?.map((order, index) => (
              <TableRow
                key={order.id}
                className={cn(
                  getStatusColor(order.status),
                  isNewOrder(order.created) ? "animate-pulse" : ""
                )}
                style={{ top: `${index * 10}%`, height: '10%'}}
              >
                {/* Order Number */}
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{order.customer.customerNo}</TableCell>
                <TableCell>
                  {new Date(order.created).toLocaleString()}
                </TableCell>
                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                <TableCell>{orderStatus(order.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
