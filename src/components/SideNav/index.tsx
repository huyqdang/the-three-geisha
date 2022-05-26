import { Component, onMount } from 'solid-js'
import logo from '../../assets/Nextbite-Logo-Orange.png'
import '../../index.css'

export const SideNav: Component = () => {
    // return <nav class="side-nav"></nav>
    return (
        <div class="flex flex-col items-center h-full overflow-hidden text-black-400 bg-teal rounded">
            <a class="flex items-center w-full px-3 mt-8" href="#">
                <img src={logo} alt="nextbite" width="120px" />
            </a>
            <div class="w-full px-2">
                <div class="flex flex-col items-center w-full mt-10">
                    <a
                        class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-highlight hover:text-text-active"
                        href="#"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        <span class="ml-2 text-sm font-medium">Dasboard</span>
                    </a>
                    <a
                        class="flex items-center w-full h-12 px-3 mt-2 bg-highlight rounded"
                        href="#"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span class="ml-2 text-sm text-text-active font-medium">
                            Restaurants
                        </span>
                    </a>
                    <a
                        class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-highlight hover:text-text-active"
                        href="#"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span class="ml-2 text-sm font-medium">Points</span>
                    </a>
                </div>
            </div>
        </div>
    )
}
