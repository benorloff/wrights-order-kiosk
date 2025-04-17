import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export default function Home() {
  return (
    <main className="w-screen h-screen bg-gray-100 p-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">📦 Online Orders Dashboard</h1>

      <div className="rounded-md border bg-white shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {orders.map((order: any) => (
              <TableRow
                key={order.id}
                className={`transition-all duration-300 ${getStatusColor(order.status)} ${isNewOrder(order.date) ? 'animate-pulse' : ''}`}
              >
                <TableCell>
                  {order.customer.lastName}, {order.customer.firstName[0]}.
                </TableCell>
                <TableCell>{order.customer.companyName}</TableCell>
                <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                <TableCell className="font-medium">{order.status}</TableCell>
              </TableRow>
            ))} */}
            <TableRow>
              <TableCell>Doe, J.</TableCell>
              <TableCell>Acme Corp</TableCell>
              <TableCell>2023-10-01 12:00</TableCell>
              <TableCell className="font-medium">Pending</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Smith, A.</TableCell>
              <TableCell>Globex Inc</TableCell>
              <TableCell>2023-10-02 14:30</TableCell>
              <TableCell className="font-medium">Shipped</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
