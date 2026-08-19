import AppointmentGrid from './components/AppointmentGrid'

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          <h1 className="text-2xl font-semibold text-blue-700 md:text-3xl">
            Progetto EHR Demo
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-8">
        <AppointmentGrid />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl p-4 text-sm text-slate-500 md:px-8 md:py-6">
          Fake EHR dashboard demonstration
        </div>
      </footer>
    </div>
  )
}

export default App
