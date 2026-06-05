import { Trip } from '../App'

interface TripCardProps {
  trip: Trip
  onDelete: (id: number) => void
  onEdit: (trip: Trip) => void
}

function TripCard({ trip, onDelete, onEdit }: TripCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      {trip.image_url && (
        <img
          src={trip.image_url}
          alt={trip.destination}
          className="w-full h-48 object-cover"
        />
      )}
      {!trip.image_url && (
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
          <span className="text-5xl">🌍</span>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900">{trip.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {trip.duration_days} días
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1">📍 {trip.destination}</p>

        {trip.description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{trip.description}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-green-600">{trip.price}€</p>
            <p className="text-xs text-gray-400">por persona</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">📅 {formatDate(trip.departure_date)}</p>
            <p className="text-xs text-gray-400">{trip.available_seats} plazas</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={() => onEdit(trip)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onDelete(trip.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripCard
