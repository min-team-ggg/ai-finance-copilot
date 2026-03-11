import { AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react'

export default function BudgetWarnings() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Budget Warnings</h3>
        <AlertTriangle className="w-5 h-5 text-warning" />
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-text-primary text-sm">Entertainment nearing limit</p>
            <p className="text-text-secondary text-xs mt-1">
              $145 of $150 spent (97%)
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-text-primary text-sm">Dining out over budget</p>
            <p className="text-text-secondary text-xs mt-1">
              $250 of $200 spent (125%)
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-text-primary text-sm">Groceries on track</p>
            <p className="text-text-secondary text-xs mt-1">
              $180 of $400 spent (45%)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
