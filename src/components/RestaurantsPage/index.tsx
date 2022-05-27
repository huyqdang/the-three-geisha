import { Component, onMount } from 'solid-js'
import { mapLoader, defaultOption } from '../../utils/map'
import mockBrandData from '../../../mock_server/brand_mapping.json'
import './restaurantsPage.css'

const filterURL = `http://localhost:8080/locations/nearby`
const radius = 10 // in miles

const generateLogos = (imgSrcs: any) => {
    const logos = imgSrcs.reduce((acc: any, imgSrc: any) => {
        return acc + `<a href="#"><img src="${imgSrc}" onclick="console.log('clicked')"/></a>`
    }, '')
    return '<div class="marker-popup-wrapper">' + logos + '</div>'
}
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
                    fetch(
                        `${filterURL}?lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}&radius=${radius}`
                    )
                        .then((res) => {
                            return res.json()
                        })
                        .then((locations) => {
                            const dupMarkers = locations.reduce(
                                (acc: any, item: any) => {
                                    const longlatId = `${item.latitude}-${item.longitude}`
                                    if (acc[longlatId]) {
                                        acc[longlatId] = [
                                            ...acc[longlatId],
                                            item,
                                        ]
                                    } else {
                                        acc[longlatId] = [item]
                                    }
                                    return acc
                                },
                                {}
                            )

                            Object.keys(dupMarkers).map((key: any) => {
                                const locMarker = new google.maps.Marker({
                                    icon: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
                                    map: map,
                                    position: {
                                        lat: dupMarkers[key][0].latitude,
                                        lng: dupMarkers[key][0].longitude,
                                    },
                                })
                                const imgSrcs = dupMarkers[key].map(
                                    (marker: any) => {
                                        return mockBrandData[marker.brand_id]
                                            .logo_url
                                    }
                                )

                                const infoWindow = new google.maps.InfoWindow({
                                    content: generateLogos(imgSrcs),
                                })

                                infoWindow.open({
                                    anchor: locMarker,
                                    map,
                                    shouldFocus: false,
                                })
                                infoWindow.addListener('closeClick', () => {
                                    infoWindow.close()
                                })
                            })
                        })
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
