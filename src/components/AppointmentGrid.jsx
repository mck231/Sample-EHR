import { useEffect, useState } from 'react'

const statusClasses = {
  booked: 'bg-blue-100 text-blue-700',
  fulfilled: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  noshow: 'bg-amber-100 text-amber-700',
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function AppointmentGrid() {
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchAppointments() {
      try {
        const response = await fetch('/.netlify/functions/getAppointments', {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('Unable to fetch appointments')
        }

        const payload = await response.json()
        const fhirAppointments = Array.isArray(payload?.publishedContent)
          ? payload.publishedContent
          : []

        setAppointments(fhirAppointments)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('We could not load appointments right now.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchAppointments()

    return () => {
      controller.abort()
    }
  }, [])

  if (isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
          <span>Loading appointments...</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error}
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Appointments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Description</th>
              <th className="px-3 py-3 font-medium">Start Time</th>
              <th className="px-3 py-3 font-medium">Participants</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {appointments.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-slate-500" colSpan={4}>
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((appointment, index) => {
                const participants = Array.isArray(appointment.participant)
                  ? appointment.participant
                      .map((participant) => participant?.actor?.display)
                      .filter(Boolean)
                      .join(', ')
                  : '—'
                const status = appointment.status || 'unknown'

                return (
                  <tr key={appointment.id || `${appointment.start}-${index}`}>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          statusClasses[status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {appointment.description || '—'}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{formatDate(appointment.start)}</td>
                    <td className="px-3 py-3 text-slate-700">{participants || '—'}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AppointmentGrid
