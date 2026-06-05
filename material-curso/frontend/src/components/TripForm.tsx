import { useState, useEffect } from 'react'
import { Trip } from '../App'

interface TripFormProps {
  onSubmit: (trip: Omit<Trip, 'id'>) => void
  editingTrip?: Trip | null
}

function TripForm({ onSubmit, editingTrip }: TripFormProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    destination: '',
    price: '',
    departure_date: '',
    duration_days: '',
    available_seats: '20',
    image_url: '',
  })

  useEffect(() => {
    if (editingTrip) {
      setForm({
        title: editingTrip.title,
        description: editingTrip.description || '',
        destination: editingTrip.destination,
        price: String(editingTrip.price),
        departure_date: editingTrip.departure_date,
        duration_days: String(editingTrip.duration_days),
        available_seats: String(editingTrip.available_seats),
        image_url: editingTrip.image_url || '',
      })
    }
  }, [editingTrip])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title: form.title,
      description: form.description || null,
      destination: form.destination,
      price: parseFloat(form.price),
      departure_date: form.departure_date,
      duration_days: parseInt(form.duration_days),
      available_seats: parseInt(form.available_seats),
      image_url: form.image_url || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {editingTrip ? 'Editar Viaje' : 'Nuevo Viaje'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Destino *</label>
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio (€) *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de salida *</label>
          <input
            name="departure_date"
            type="date"
            value={form.departure_date}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duración (días) *</label>
          <input
            name="duration_days"
            type="number"
            value={form.duration_days}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Plazas disponibles</label>
          <input
            name="available_seats"
            type="number"
            value={form.available_seats}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">URL de imagen</label>
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://..."
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {editingTrip ? 'Guardar Cambios' : 'Crear Viaje'}
        </button>
      </div>
    </form>
  )
}

export default TripForm
