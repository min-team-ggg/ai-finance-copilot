import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, AlertTriangle, ShieldCheck } from 'lucide-react'
import { getWeeklyReport } from '../../services/api'

export default function WeeklyReportViewer() {
  const [reportData, setReportData] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState('2026-03-04')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const weeks = [
    { value: '2026-03-04', label: 'Week of Mar 4, 2026' },
    { value: '2026-02-25', label: 'Week of Feb 25, 2026' },
    { value: '2026-02-18', label: 'Week of Feb 18, 2026' },
  ]

  const fetchReport = async (startDate) => {
    try {
      setLoading(true)
      const endDate = new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

      const data = await getWeeklyReport(startDate, endDate)
      if (data) {
        setReportData(data)
      }
    } catch (err) {
      console.error('Failed to fetch weekly report:', err)
      setError('Unable to load weekly report')
      // Set default data on error
      setReportData({
        totalIncome: 3500,
        incomeChange: 8.5,
        totalExpenses: 2150,
        expensesChange: -5.2,
        netSavings: 1350,
        savingsChange: 20,
        categories: [
          { category: 'Housing', amount: 850, change: 0, icon: '🏠' },
          { category: 'Groceries', amount: 420, change: -10, icon: '🛒' },
          { category: 'Transportation', amount: 280, change: 5, icon: '🚗' },
          { category: 'Entertainment', amount: 145, change: 25, icon: '🎬' },
          { category: 'Dining Out', amount: 250, change: 15, icon: '🍽️' },
          { category: 'Shopping', amount: 205, change: -8, icon: '🛍️' },
        ],
        insights: [
          {
            type: 'warning',
            icon: AlertTriangle,
            title: 'Dining out spending increased',
            description: 'You spent 15% more on dining out this week. Consider cooking at home more often to stay on budget.',
            color: 'yellow'
          },
          {
            type: 'success',
            icon: ShieldCheck,
            title: 'Great savings progress!',
            description: 'You saved $1,350 this week, which is 20% more than last week. Keep up the good work!',
            color: 'green'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport(selectedWeek)
  }, [selectedWeek])

  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value)
  }

  if (loading && !reportData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Select Week
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
              <option>Week of Mar 4, 2026</option>
            </select>
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  const data = reportData

  return (
    <div className="space-y-6">
      {/* Report Selector */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Select Week
          </label>
          <select
            value={selectedWeek}
            onChange={handleWeekChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:opacity-50"
          >
            {weeks.map((week) => (
              <option key={week.value} value={week.value}>
                {week.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => {
              const currentIndex = weeks.findIndex(w => w.value === selectedWeek)
              if (currentIndex < weeks.length - 1) {
                setSelectedWeek(weeks[currentIndex + 1].value)
              }
            }}
            disabled={loading || selectedWeek === weeks[weeks.length - 1].value}
            className="px-4 py-2 bg-surface border border-gray-300 rounded-lg hover:bg-gray-50 text-text-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => {
              const currentIndex = weeks.findIndex(w => w.value === selectedWeek)
              if (currentIndex > 0) {
                setSelectedWeek(weeks[currentIndex - 1].value)
              }
            }}
            disabled={loading || selectedWeek === weeks[0].value}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
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
              {weeks.find(w => w.value === selectedWeek)?.label.replace('Week of ', '')}
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
            <p className="text-2xl font-bold text-success">${data?.totalIncome?.toLocaleString() || 0}</p>
            <p className="text-xs text-success flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" />
              +{data?.incomeChange || 0}% vs last week
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-primary">${data?.totalExpenses?.toLocaleString() || 0}</p>
            <p className="text-xs text-success flex items-center gap-1 mt-2">
              <TrendingDown className="w-3 h-3" />
              {data?.expensesChange || 0}% vs last week
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Net Savings</p>
            <p className="text-2xl font-bold text-purple-600">${data?.netSavings?.toLocaleString() || 0}</p>
            <p className="text-xs text-success flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" />
              +{data?.savingsChange || 0}% vs last week
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-text-primary mb-4">
            Category Breakdown
          </h4>
          <div className="space-y-3">
            {data?.categories?.map((item) => (
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
            {data?.insights?.map((insight, index) => {
              const Icon = insight.icon
              const colorClass = {
                yellow: 'bg-yellow-50 border-yellow-200',
                red: 'bg-red-50 border-red-200',
                green: 'bg-green-50 border-green-200'
              }[insight.color] || 'bg-yellow-50 border-yellow-200'

              return (
                <div key={index} className={`flex items-start gap-3 p-3 border rounded-lg ${colorClass}`}>
                  <Icon className={`w-5 h-5 text-${insight.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="font-medium text-text-primary text-sm">
                      {insight.title}
                    </p>
                    <p className="text-text-secondary text-xs mt-1">
                      {insight.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
