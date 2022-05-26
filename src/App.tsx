import { Component, onMount } from 'solid-js'
import { mapLoader, defaultOption } from './utils/map'
import styles from './App.module.css'

const App: Component = () => {
    onMount(() => {
        mapLoader.load().then((google) => {
            new google.maps.Map(
                document.getElementById('map') as HTMLElement,
                defaultOption
            )
        })
    })

    return (
        <div class={styles.App}>
            <header class={styles.header}>Testing Map</header>
            <div class={styles.Map} id="map"></div>
        </div>
    )
}

export default App
