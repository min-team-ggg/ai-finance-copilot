import { useState, useEffect } from 'react'
import { AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react'
import { getInsights } from '../../services/api'

export default function BudgetWarnings() {
  const [warnings, setWarnings] = useState([
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Entertainment nearing limit',
      description: '$145 of $150 spent (97%)',
      color: 'yellow'
    },
    {
      type: 'danger',
      icon: AlertCircle,
      title: 'Dining out over budget',
      description: '$250 of $200 spent (125%)',
      color: 'red'
    },
    {
      type: 'success',
      icon: ShieldCheck,
      title: 'Groceries on track',
      description: '$180 of $400 spent (45%)',
      color: 'green'
    }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        setLoading(true)
        const data = await getInsights()
        if (data && data.warnings) {
          setWarnings(data.warnings)
        }
      } catch (err) {
        console.error('Failed to fetch budget warnings:', err)
        setError('Unable to load budget warnings')
      } finally {
        setLoading(false)
      }
    }

    fetchWarnings()
  }, [])

  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Budget Warnings</h3>
          <AlertTriangle className="w-5 h-5 text-warning" />
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
          <h3 className="text-lg font-semibold text-text-primary">Budget Warnings</h3>
          <AlertTriangle className="w-5 h-5 text-warning" />
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      </div>
    )
  }

  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200 text-warning',
    red: 'bg-red-50 border-red-200 text-danger',
    green: 'bg-green-50 border-green-200 text-success'
  }

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Budget Warnings</h3>
        <AlertTriangle className="w-5 h-5 text-warning" />
      </div>
      <div className="space-y-3">
        {warnings.map((warning, index) => {
          const Icon = warning.icon || AlertTriangle
          const colorClass = colorClasses[warning.color] || colorClasses.yellow

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 border rounded-lg ${colorClass}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 text-${warning.color}`} />
              <div>
                <p className="font-medium text-text-primary text-sm">{warning.title}</p>
                <p className="text-text-secondary text-xs mt-1">
                  {warning.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
