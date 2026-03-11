import { useState, useEffect } from 'react'
import { TrendingUp, ShieldCheck } from 'lucide-react'
import { getHealthScore } from '../../services/api'

export default function FinancialHealthScore() {
  const [healthData, setHealthData] = useState({
    score: 78,
    change: 5,
    message: 'Good! You\'re on track with your financial goals.'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHealthScore = async () => {
      try {
        setLoading(true)
        const data = await getHealthScore()
        if (data) {
          setHealthData({
            score: data.score || 78,
            change: data.change || 5,
            message: data.message || 'Good! You\'re on track with your financial goals.'
          })
        }
      } catch (err) {
        console.error('Failed to fetch health score:', err)
        setError('Unable to load health score')
      } finally {
        setLoading(false)
      }
    }

    fetchHealthScore()
  }, [])

  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Financial Health Score</h3>
          <ShieldCheck className="w-5 h-5 text-success" />
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
          <h3 className="text-lg font-semibold text-text-primary">Financial Health Score</h3>
          <ShieldCheck className="w-5 h-5 text-success" />
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
        <h3 className="text-lg font-semibold text-text-primary">Financial Health Score</h3>
        <ShieldCheck className="w-5 h-5 text-success" />
      </div>
      <div className="flex items-center justify-center py-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl font-bold text-success">{healthData.score}</span>
              <p className="text-sm text-text-secondary mt-1">/ 100</p>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-success text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +{healthData.change} this week
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-text-secondary mt-4">
        {healthData.message}
      </p>
    </div>
  )
}
