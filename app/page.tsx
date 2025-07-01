"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSettingsStore } from "@/lib/store";
import { LocationModal } from "@/components/LocationModal";
import { Settings2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { PasswordProtection } from "@/components/PasswordProtection";

import { Order } from "@/types/spire";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Client component to handle URL parameters
function TerritoryHandler() {
  const searchParams = useSearchParams();
  const { setTerritory } = useSettingsStore();

  useEffect(() => {
    const territoryCode = searchParams.get('territoryCode');
    if (territoryCode) {
      setTerritory(territoryCode);
    }
  }, [searchParams, setTerritory]);

  return null;
}

// Countdown timer component
function CountdownTimer({ lastFetchedAt }: { lastFetchedAt: Date }) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const refreshInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const nextRefresh = lastFetchedAt.getTime() + refreshInterval;
      const remaining = Math.max(0, nextRefresh - now);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastFetchedAt, refreshInterval]);

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <span className="text-lg text-gray-500">
      Next refresh in: {minutes.toString().padStart(1, '0')} minutes {seconds.toString().padStart(2, '0')} seconds
    </span>
  );
}

function OrderDisplay() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { territory } = useSettingsStore();
  const lastFetchedAt = useRef<Date>(new Date());
  const ordersPerPage = 10;

  const paginatedOrders = useMemo(() => {
    const pages = [];
    for (let i = 0; i < orders.length; i += ordersPerPage) {
      pages.push(orders.slice(i, i + ordersPerPage));
    }
    return pages;
  }, [orders]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const territory = useSettingsStore.getState().territory;
      const res = await fetch(`/api/orders?territoryCode=${territory}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setOrders(data.records || []);
      lastFetchedAt.current = new Date();
      setCurrentPage(0);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders from Spire');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

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
    switch (status) {
      case "L":
        return "bg-green-400";
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
    <main className="w-screen h-screen flex flex-col bg-gray-100 p-4 gap-4 relative">
      <Suspense>
        <TerritoryHandler />
      </Suspense>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Online Orders for {territory}</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setModalOpen(true)}
            title="Settings"
            variant={"default"}
            className="cursor-pointer"
          >
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
        <LocationModal open={modalOpen} onOpenChange={setModalOpen} />
      </header>

      <section className="grow">
        <Table className="h-full w-full text-2xl bg-white rounded-md border shadow table-auto">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 text-4xl">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-red-500 text-4xl">
                  Error: {error}
                  <br />
                  <span className="text-2xl text-gray-600 mt-2 block">
                    Please check Spire for accurate order information.
                  </span>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 text-4xl">
                  There are currently no online orders awaiting processing.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {paginatedOrders[currentPage]?.map((order) => (
                  <TableRow
                    key={order.id}
                    className={cn(
                      getStatusColor(order.status),
                      isNewOrder(order.created) ? "animate-pulse" : ""
                    )}
                  >
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
                {paginatedOrders[currentPage]?.length < 10
                  ? Array.from({
                      length: 10 - paginatedOrders[currentPage]?.length,
                    }).map((__, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-transparent">-</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))
                  : ""}
              </>
            )}
          </TableBody>
        </Table>
      </section>
      <footer className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {paginatedOrders.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentPage === index ? "bg-black text-white" : "bg-gray-400"
              )}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <p className="text-lg text-gray-500">
            Last updated: {lastFetchedAt.current.toLocaleString()}
          </p>
          <CountdownTimer lastFetchedAt={lastFetchedAt.current} />
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return <OrderDisplay />;
}
