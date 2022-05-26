import { Component } from 'solid-js'
import { RestaurantPage } from './components/RestaurantsPage'
import './index.css'

const App: Component = () => {
    return (
        <main class="app-wrapper">
            <nav class="side-nav"></nav>
            <RestaurantPage />
        </main>
    )
}

export default App
