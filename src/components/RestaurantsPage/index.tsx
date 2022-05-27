import { Component, onMount } from 'solid-js'
import { mapLoader, defaultOption } from '../../utils/map'
import mockBrandData from '../../../mock_server/brand_mapping.json'
import './restaurantsPage.css'

const filterURL = `http://localhost:8080/locations/nearby`
const radius = 10 // in miles

const generateLogos = (imgSrcs: any) => {
    const logos = imgSrcs.reduce((acc: any, imgSrc: any) => {
        return acc + `<img src="${imgSrc}" />`
    }, '')
    return '<div class="marker-popup-wrapper">' + logos + '</div>'
}
export const RestaurantPage: Component = () => {
    const filterURL = `http://localhost:8080/locations/nearby`
    const radius = 10 // in miles
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
                    fetch(
                        `${filterURL}?lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}&radius=${radius}`
                    )
                        .then((res) => {
                            return res.json()
                        })
                        .then((data) => {
                            console.log(data)
                        })
                }
            })
        })
    })
    return (
        <section class="mt-7">
            <input class="search-bar" placeholder="Search by address here" />
            <div class="map-container">
                <div class="g-map" id="map"></div>
                <div class="h-full w-2/6 flex-none border-solid border-grey-200 border-2 rounded-xl ml-4 p-4">
                    <a class="font-bold text-lg">More Info</a>
                </div>
            </div>
        </section>
    )
}
