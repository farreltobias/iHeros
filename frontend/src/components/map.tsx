'use client'

import { MapContainer, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

export const Map: React.FC = () => {
  return (
    <MapContainer
      center={[0, 0]}
      zoomControl={false}
      className="w-screen h-screen [filter:brightness(0.6)_invert(1)_contrast(3)_hue-rotate(200deg)_saturate(0.3)_brightness(0.7)]"
      minZoom={3}
      maxZoom={4}
      zoom={3}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}
