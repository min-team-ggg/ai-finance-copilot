import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', spent: 2100, budget: 2500 },
  { month: 'Feb', spent: 2300, budget: 2500 },
  { month: 'Mar', spent: 1950, budget: 2500 },
  { month: 'Apr', spent: 2200, budget: 2500 },
  { month: 'May', spent: 2600, budget: 2500 },
  { month: 'Jun', spent: 2453, budget: 3000 },
]

export default function SpendingChart() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Spending Overview</h3>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="spent" fill="#6366f1" name="Spent" radius={[4, 4, 0, 0]} />
            <Bar dataKey="budget" fill="#10b981" name="Budget" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
