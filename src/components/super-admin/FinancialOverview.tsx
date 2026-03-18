import { useMemo, useState } from 'react';
import { DollarSign, FileText, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Due' | 'Overdue';
  description: string;
}

const mockInvoices: Invoice[] = [
  { id: 'INV-1001', date: '2026-03-01', amount: '$8,400', status: 'Paid', description: 'Monthly subscription - Enterprise' },
  { id: 'INV-1002', date: '2026-03-15', amount: '$2,750', status: 'Due', description: 'API usage overage' },
  { id: 'INV-1003', date: '2026-02-28', amount: '$1,200', status: 'Paid', description: 'Additional vehicle licenses' },
  { id: 'INV-1004', date: '2026-03-20', amount: '$3,100', status: 'Overdue', description: 'Data export & reporting service' },
];

export default function FinancialOverview() {
  const [search, setSearch] = useState('');

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((invoice) =>
      invoice.id.toLowerCase().includes(search.toLowerCase()) ||
      invoice.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalBalance = mockInvoices.reduce((acc, invoice) => {
    const value = Number(invoice.amount.replace(/[$,]/g, ''));
    return invoice.status === 'Paid' ? acc - value : acc + value;
  }, 0);

  return (
    <div className="glass-panel rounded-lg p-5 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="label-caps">Financial Oversight</p>
          <h3 className="text-lg font-semibold tracking-tight">Billing & Expense Reports</h3>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 bg-secondary/80 px-3 py-2 rounded-lg">
            <DollarSign className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Estimated Balance</div>
              <div className="text-sm font-semibold">${totalBalance.toLocaleString()}</div>
            </div>
          </div>
          <Button variant="secondary" className="gap-2">
            <FileText className="w-4 h-4" />
            Export report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-inner p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Subscription</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Plan: <span className="font-medium text-foreground">Enterprise</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Renewal: <span className="font-medium text-foreground">2026-04-01</span>
          </p>
        </div>

        <div className="glass-inner p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Payment History</span>
            </div>
            <Badge variant="outline" className="text-[10px]">
              3 Paid / 1 Pending
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">View details in the invoice table below or export data for accounting.</p>
        </div>

        <div className="glass-inner p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Expense Reports</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Keep track of recurring and one-time expenses across the organization.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Recent invoices</h4>
            <p className="text-xs text-muted-foreground">Review billing history and outstanding balances.</p>
          </div>

          <Input
            placeholder="Search invoices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-secondary border-border text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-3 font-medium text-xs">Invoice</th>
                <th className="text-left py-2 px-3 font-medium text-xs">Date</th>
                <th className="text-left py-2 px-3 font-medium text-xs">Amount</th>
                <th className="text-left py-2 px-3 font-medium text-xs">Status</th>
                <th className="text-right py-2 px-3 font-medium text-xs">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                  <td className="py-2.5 px-3 font-medium">{invoice.id}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{invoice.date}</td>
                  <td className="py-2.5 px-3 font-semibold">{invoice.amount}</td>
                  <td className="py-2.5 px-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        invoice.status === 'Paid'
                          ? 'bg-status-active/20 text-status-active border-status-active/30'
                          : invoice.status === 'Due'
                          ? 'bg-primary/20 text-primary border-primary/30'
                          : 'bg-status-emergency/20 text-status-emergency border-status-emergency/30'
                      }`}
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No invoices match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
