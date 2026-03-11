import { useState, useEffect } from 'react'
import { Wallet, TrendingDown } from 'lucide-react'
import { getInsights } from '../../services/api'

export default function SpendingSummary() {
  const [spendingData, setSpendingData] = useState({
    thisMonth: 2453,
    vsLastMonth: -12,
    budget: 3000,
    progress: 82
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSpendingData = async () => {
      try {
        setLoading(true)
        const data = await getInsights()
        if (data) {
          setSpendingData({
            thisMonth: data.spending?.thisMonth || 2453,
            vsLastMonth: data.spending?.vsLastMonth || -12,
            budget: data.spending?.budget || 3000,
            progress: data.spending?.progress || 82
          })
        }
      } catch (err) {
        console.error('Failed to fetch spending data:', err)
        setError('Unable to load spending data')
      } finally {
        setLoading(false)
      }
    }

    fetchSpendingData()
  }, [])

  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Spending Summary</h3>
          <Wallet className="w-5 h-5 text-primary" />
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Spending Summary</h3>
          <Wallet className="w-5 h-5 text-primary" />
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Spending Summary</h3>
        <Wallet className="w-5 h-5 text-primary" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">This Month</span>
          <span className="text-2xl font-bold text-text-primary">${spendingData.thisMonth.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">vs Last Month</span>
          <span className="text-success flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            {spendingData.vsLastMonth}%
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">Budget</span>
          <span className="text-text-primary">${spendingData.budget.toLocaleString()}</span>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">Progress</span>
            <span className="text-sm font-medium text-text-primary">{spendingData.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${spendingData.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
