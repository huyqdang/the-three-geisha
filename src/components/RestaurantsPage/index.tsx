import { Component, onMount } from 'solid-js'
import { mapLoader, defaultOption } from '../../utils/map'
import './restaurantsPage.css'

export const RestaurantPage: Component = () => {
    onMount(() => {
        mapLoader.load().then((google) => {
            new google.maps.Map(
                document.getElementById('map') as HTMLElement,
                defaultOption
            )
        })
    })

    return (
        <section>
            <input class="search-bar" placeholder="Search by address here" />
            <div class="g-map" id="map"></div>
        </section>
    )
}
