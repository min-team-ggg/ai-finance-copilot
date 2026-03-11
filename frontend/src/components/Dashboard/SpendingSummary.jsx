import { Wallet, TrendingDown } from 'lucide-react'

export default function SpendingSummary() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Spending Summary</h3>
        <Wallet className="w-5 h-5 text-primary" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">This Month</span>
          <span className="text-2xl font-bold text-text-primary">$2,453</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">vs Last Month</span>
          <span className="text-success flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            -12%
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">Budget</span>
          <span className="text-text-primary">$3,000</span>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">Progress</span>
            <span className="text-sm font-medium text-text-primary">82%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: '82%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
