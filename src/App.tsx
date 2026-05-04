import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Home from './pages/Home'
import EmployeeList from './pages/EmployeeList'
import EnterHours from './pages/EnterHours'
import ReviewPrint from './pages/ReviewPrint'
import PastPayrolls from './pages/PastPayrolls'
import SimpleTotals from './pages/SimpleTotals'
import BusinessInfoPage from './pages/BusinessInfo'
import {
  fetchEmployees,
  persistEmployees,
  fetchPayrollRuns,
  persistPayrollRun,
  fetchBusinessInfo,
  persistBusinessInfo,
} from './utils/storage'
import { mergeEntries } from './utils/payroll'
import type { Employee, PayrollRun, BusinessInfo, Page, PayrollEntry } from './types'

function getCurrentWeekMonday(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  return monday.toISOString().split('T')[0]
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([])
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: '',
    ownerName: '',
    dadMode: true,
  })
  const [currentEntries, setCurrentEntries] = useState<PayrollEntry[]>([])
  const [weekOf, setWeekOf] = useState<string>(getCurrentWeekMonday())
  const [viewingRun, setViewingRun] = useState<PayrollRun | null>(null)

  useEffect(() => {
    Promise.all([fetchEmployees(), fetchPayrollRuns(), fetchBusinessInfo()])
      .then(([emps, runs, info]) => {
        setEmployees(emps)
        setPayrollRuns(runs)
        setBusinessInfo(info)
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }, [])

  function handleSetEmployees(newEmployees: Employee[]): void {
    setEmployees(newEmployees)
    persistEmployees(newEmployees).catch(console.error)
  }

  function handleSaveBusinessInfo(info: BusinessInfo): void {
    setBusinessInfo(info)
    persistBusinessInfo(info).catch(console.error)
  }

  function navigateTo(page: Page) {
    if (page !== 'review-print') setViewingRun(null)
    if (page === 'enter-hours') {
      setCurrentEntries(mergeEntries(employees, currentEntries))
    }
    setCurrentPage(page)
  }

  function handleViewRun(run: PayrollRun) {
    setViewingRun(run)
    setCurrentPage('review-print')
  }

  function handleSavePayroll(entries: PayrollEntry[], weekOfDate: string): void {
    const newRun: PayrollRun = {
      id: Date.now().toString(),
      weekOf: weekOfDate,
      dateSaved: new Date().toLocaleDateString(),
      entries,
      totalAmount: entries.reduce((sum, e) => sum + e.netPay, 0),
      employeeCount: entries.length,
    }
    setPayrollRuns(prev => [...prev, newRun])
    persistPayrollRun(newRun).catch(console.error)
    setCurrentEntries([])
    setWeekOf(getCurrentWeekMonday())
  }

  const dadMode = businessInfo.dadMode

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 animate-pulse">
            PP
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading PayPilot...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-md border border-gray-100">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Could not load data</h2>
          <p className="text-gray-500 text-lg mb-6">
            Something went wrong loading the app. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-6 font-semibold text-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            employees={employees}
            payrollRuns={payrollRuns}
            dadMode={dadMode}
            onNavigate={navigateTo}
          />
        )
      case 'employees':
        return (
          <EmployeeList
            employees={employees}
            onSave={handleSetEmployees}
            dadMode={dadMode}
          />
        )
      case 'enter-hours':
        return (
          <EnterHours
            employees={employees}
            currentEntries={currentEntries}
            weekOf={weekOf}
            dadMode={dadMode}
            onEntriesChange={setCurrentEntries}
            onWeekOfChange={setWeekOf}
            onNavigate={navigateTo}
          />
        )
      case 'review-print':
        return (
          <ReviewPrint
            entries={viewingRun ? viewingRun.entries : currentEntries}
            weekOf={viewingRun ? viewingRun.weekOf : weekOf}
            dadMode={dadMode}
            isHistorical={!!viewingRun}
            onSavePayroll={handleSavePayroll}
            onNavigate={navigateTo}
          />
        )
      case 'past-payrolls':
        return (
          <PastPayrolls
            payrollRuns={payrollRuns}
            dadMode={dadMode}
            onNavigate={navigateTo}
            onViewRun={handleViewRun}
          />
        )
      case 'simple-totals':
        return <SimpleTotals payrollRuns={payrollRuns} dadMode={dadMode} />
      case 'business-info':
        return (
          <BusinessInfoPage
            businessInfo={businessInfo}
            onSave={handleSaveBusinessInfo}
            dadMode={dadMode}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigateTo}
        dadMode={dadMode}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          ownerName={businessInfo.ownerName}
          businessName={businessInfo.businessName}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
