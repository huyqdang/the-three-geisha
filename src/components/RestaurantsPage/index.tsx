import { Component, createEffect, createSignal, Index, onMount } from 'solid-js'
import { mapLoader, defaultOption } from '../../utils/map'
import mockBrandData from '../../../mock_server/brand_mapping.json'
import './restaurantsPage.css'

const filterURL = `http://localhost:8080/locations/nearby`
const radius = 10 // in miles

const generateLogos = (imgSrcs: any) => {
    const logos = imgSrcs.reduce((acc: any, imgSrc: any) => {
        return (
            acc +
            `<a href="#"><img src="${imgSrc}" onclick="console.log('clicked')"/></a>`
        )
    }, '')
    return '<div class="marker-popup-wrapper">' + logos + '</div>'
}

const generateStars = (qty: number) => {
    let stars = '⭐'
    for (let i = 0; i < qty - 1; i++) {
        stars = stars + '⭐'
    }
    return stars
}

const formatName = (authorName: string) => {
    const index = authorName.split('').indexOf(' ')
    return `~ ${authorName.slice(0, index)} ${authorName.slice(
        index + 1,
        index + 2
    )}.`
}

export const RestaurantPage: Component = () => {
    const [reviews, setReviews] = createSignal([])
    const [rating, setRating] = createSignal()
    const [name, setName] = createSignal()

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

    createEffect(async () => {
        const temp = []
        try {
            const data = await fetch(
                `http://localhost:8080/reviews?app_id=O9t735t013S`
            )
            if (!data.ok) {
                console.log('Shit aint working', data.status)
            }
            const responseJson = await data.json()
            const placeDetails = await fetch(
                `http://localhost:8080/getDetails?place_id=${responseJson[0].result.place_id}`
            )
            const place = await placeDetails.json()
            console.log('placeDetails', place)
            setReviews(place.result.reviews)
            setRating(place.result.rating)
            setName(place.result.name)
        } catch (err) {
            console.log('Error here...', err)
        }
    }, [reviews])

    return (
        <section class="mt-7">
            <input class="search-bar" placeholder="Search by address here" />
            <div class="map-container mt-8">
                <div class="g-map" id="map"></div>
                {reviews().length > 0 && (
                    <div class="h-full w-2/6 flex-none border-solid border-grey-200 border-2 rounded-xl ml-4 p-5">
                        <div class="font-bold text-xl w-full">{`${name()}`}</div>
                        <div class="font-bold text-xl w-full text-gray-400">{`${rating()} Stars`}</div>
                        <Index each={reviews()}>
                            {(review, i) => (
                                <div class="pb-4 pt-4">
                                    <div class="font-bold">{`${generateStars(
                                        review().rating
                                    )} • ${
                                        review().relative_time_description
                                    }`}</div>
                                    <div class="text-gray-400 font-semibold pt-1">
                                        {formatName(review().author_name)}
                                    </div>
                                    <div class="italic">{review().text}</div>
                                </div>
                            )}
                        </Index>
                    </div>
                )}
            </div>
        </section>
    )
}
