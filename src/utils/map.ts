import { Loader } from '@googlemaps/js-api-loader'

export const mapLoader = new Loader({
    apiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY || '',
    version: 'weekly',
    libraries: ['places'],
})

export const defaultOption = {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
}
