import FinancialHealthScore from '../components/Dashboard/FinancialHealthScore'
import SpendingSummary from '../components/Dashboard/SpendingSummary'
import BudgetWarnings from '../components/Dashboard/BudgetWarnings'
import SpendingChart from '../components/Charts/SpendingChart'
import ChatInterface from '../components/Chat/ChatInterface'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Dashboard</h2>
        <p className="text-text-secondary mt-1">Your financial overview and insights</p>
      </div>

      {/* Top Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <FinancialHealthScore />
        <SpendingSummary />
        <BudgetWarnings />
      </div>

      {/* Charts and Chat Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <ChatInterface />
      </div>
    </div>
  )
}
