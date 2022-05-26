import { Component, onMount } from 'solid-js'
import { mapLoader, defaultOption } from '../../utils/map'
import './restaurantsPage.css'

export const RestaurantPage: Component = () => {
    onMount(() => {
        mapLoader.load().then((google) => {
            const map = new google.maps.Map(
                document.getElementById('map') as HTMLElement,
                defaultOption
            )
            const autocompleteInput = document.getElementsByClassName(
                'search-bar'
            )[0] as HTMLInputElement
            const autocomplete = new google.maps.places.Autocomplete(
                autocompleteInput,
                {
                    fields: ['address_components', 'geometry', 'name'],
                    types: ['address'],
                }
            )
            const marker = new google.maps.Marker({
                map: map,
                draggable: false,
            })
            autocomplete.addListener('place_changed', function () {
                marker.setVisible(false)
                const place = autocomplete.getPlace()
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert(
                        "No details available for input: '" + place.name + "'"
                    )
                    return
                }
                if (place.geometry.location) {
                    map.setCenter(place.geometry.location)
                    map.setZoom(13)
                    marker.setPosition(place.geometry.location)
                    marker.setVisible(true)
                }
            })
        })
    })
    return (
        <section class="mt-7">
            <input class="search-bar" placeholder="Search by address here" />
            <div class="g-map" id="map"></div>
        </section>
    )
}
