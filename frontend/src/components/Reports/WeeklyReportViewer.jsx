import { Calendar, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function WeeklyReportViewer() {
  return (
    <div className="space-y-6">
      {/* Report Selector */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Select Week
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
            <option>Week of Mar 4, 2026</option>
            <option>Week of Feb 25, 2026</option>
            <option>Week of Feb 18, 2026</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button className="px-4 py-2 bg-surface border border-gray-300 rounded-lg hover:bg-gray-50 text-text-primary text-sm">
            Previous
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm">
            Next
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Weekly Financial Report
            </h3>
            <p className="text-sm text-text-secondary flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              March 4 - March 10, 2026
            </p>
          </div>
          <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm">
            Export PDF
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Total Income</p>
            <p className="text-2xl font-bold text-success">$3,500</p>
            <p className="text-xs text-success flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" />
              +8.5% vs last week
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-primary">$2,150</p>
            <p className="text-xs text-success flex items-center gap-1 mt-2">
              <TrendingDown className="w-3 h-3" />
              -5.2% vs last week
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Net Savings</p>
            <p className="text-2xl font-bold text-purple-600">$1,350</p>
            <p className="text-xs text-success flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" />
              +20% vs last week
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-text-primary mb-4">
            Category Breakdown
          </h4>
          <div className="space-y-3">
            {[
              { category: 'Housing', amount: 850, change: 0, icon: '🏠' },
              { category: 'Groceries', amount: 420, change: -10, icon: '🛒' },
              { category: 'Transportation', amount: 280, change: 5, icon: '🚗' },
              { category: 'Entertainment', amount: 145, change: 25, icon: '🎬' },
              { category: 'Dining Out', amount: 250, change: 15, icon: '🍽️' },
              { category: 'Shopping', amount: 205, change: -8, icon: '🛍️' },
            ].map((item) => (
              <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-text-primary text-sm">{item.category}</p>
                    <p className="text-xs text-text-secondary">
                      {item.change > 0 ? (
                        <span className="text-danger flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {item.change}% increase
                        </span>
                      ) : (
                        <span className="text-success flex items-center gap-1">
                          <ArrowDownRight className="w-3 h-3" />
                          {Math.abs(item.change)}% decrease
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-text-primary text-sm">${item.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h4 className="text-md font-semibold text-text-primary mb-4">
            AI Insights
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text-primary text-sm">
                  Dining out spending increased
                </p>
                <p className="text-text-secondary text-xs mt-1">
                  You spent 15% more on dining out this week. Consider cooking at home more often to stay on budget.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text-primary text-sm">
                  Great savings progress!
                </p>
                <p className="text-text-secondary text-xs mt-1">
                  You saved $1,350 this week, which is 20% more than last week. Keep up the good work!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
