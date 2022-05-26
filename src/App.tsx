
import { Component } from 'solid-js'
import { RestaurantPage } from './components/RestaurantsPage'
import { SideNav } from './components/SideNav'
import './index.css'

const App: Component = () => {
    return (
        <main class="app-wrapper">
            <SideNav />
            <RestaurantPage />
        </main>
    )
}

export default App
