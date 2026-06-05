import { useState, useEffect } from 'react'
import TripCard from './components/TripCard'
import TripForm from './components/TripForm'

export interface Trip {
  id: number
  title: string
  description: string | null
  destination: string
  price: number
  departure_date: string
  duration_days: number
  available_seats: number
  image_url: string | null
}

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${API_URL}/trips`)
      if (!res.ok) throw new Error('Error al cargar viajes')
      const data = await res.json()
      setTrips(data)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este viaje?')) return
    await fetch(`${API_URL}/trips/${id}`, { method: 'DELETE' })
    fetchTrips()
  }

  const handleCreate = async (trip: Omit<Trip, 'id'>) => {
    if (editingTrip) {
      await fetch(`${API_URL}/trips/${editingTrip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip),
      })
      setEditingTrip(null)
    } else {
      await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip),
      })
    }
    setShowForm(false)
    fetchTrips()
  }

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">✈️ VoyageR</h1>
              <p className="text-blue-100 mt-1">Tu agencia de viajes</p>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); setEditingTrip(null) }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              {showForm ? 'Cancelar' : '+ Nuevo Viaje'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <TripForm onSubmit={handleCreate} editingTrip={editingTrip} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Cargando viajes...</p>
          </div>
        )}

        {/* Trip Grid */}
        {!loading && trips.length === 0 && !error && (
          <p className="text-center text-gray-500 py-12">No hay viajes disponibles.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-12">
        <p>VoyageR — Aplicación base del curso de Kubernetes</p>
      </footer>
    </div>
  )
}

export default App
