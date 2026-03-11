import { TrendingUp, ShieldCheck } from 'lucide-react'

export default function FinancialHealthScore() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Financial Health Score</h3>
        <ShieldCheck className="w-5 h-5 text-success" />
      </div>
      <div className="flex items-center justify-center py-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl font-bold text-success">78</span>
              <p className="text-sm text-text-secondary mt-1">/ 100</p>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-success text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +5 this week
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-text-secondary mt-4">
        Good! You're on track with your financial goals.
      </p>
    </div>
  )
}
