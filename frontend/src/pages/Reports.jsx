import WeeklyReportViewer from '../components/Reports/WeeklyReportViewer'

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Reports</h2>
        <p className="text-text-secondary mt-1">Your weekly financial summaries</p>
      </div>

      {/* Weekly Report Viewer */}
      <WeeklyReportViewer />
    </div>
  )
}
