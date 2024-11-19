const BASE_URL = "https://api.sunrisesunset.io/json";
const TIMEZONE = "CST";
const DAYS = ["today", "tomorrow"];

async function getSunriseSunset(day, lat, long) {
    if (!DAYS.includes(day)) {
        throw new Error("Invalid day");
    }
    const response = await fetch(`${BASE_URL}?lat=${lat}&lng=${long}&date=${day}&timezone=${TIMEZONE}`);
    console.log(`${BASE_URL}?lat=${lat}&lng=${long}&date=${day}&timezone=${TIMEZONE}`);
    const data = await response.json();
    return data;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


async function getInfo(coords, userLocation = false) {
    const [lat, long] = coords.split(",");
    DAYS.forEach(async (day) => {
        const divSection = document.getElementById(day);
        divSection.innerHTML = `<p>Loading...</p>`;

        const data = await getSunriseSunset(day, lat, long);
        if (data.status !== "OK") {
            console.error(`There was an error fetching the info for ${day}`, data.status);
            divSection.innerHTML = `<p>There was an error fetching the info for ${capitalize(day)}</p>`;
            return;
        }

        const userLocationText = userLocation ? " (Your Location)" : "";

        const info = `
        <h2 class='text-xl'>${capitalize(day) + userLocationText}</h2>
        <div class='grid grid-cols-2 grid-rows-auto w-full mt-2 gap-2'>
            <div class='flex flex-col justify-center items-start'>
                <p>Sunrise: ${data.results.sunrise}</p>
            </div>
            <div class='flex flex-col justify-center items-start'>
                <p>Sunset: ${data.results.sunset}</p>
            </div>
            <div class='flex flex-col justify-center items-start'>
                <p>Dawn: ${data.results.dawn}</p>
            </div>
            <div class='flex flex-col justify-center items-start'>
                <p>Dusk: ${data.results.dusk}</p>
            </div>
            <div class='flex flex-col justify-center items-start'>
                <p>Solar Noon: ${data.results.solar_noon}</p>
            </div>
            <div class='flex flex-col justify-center items-start'>
                <p>Day Length: ${data.results.day_length} Hours</p>
            </div>
            <div class='col-span-2 flex flex-col justify-center items-center mt-4'>
                <p class='flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />
                    </svg>
                    Timezone: Central Standard Time
                </p>
            </div>
        </div>
        `;

        divSection.innerHTML = info;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const location = document.getElementById("locationSelector");
    getInfo(location.value);
    location.addEventListener("change", (e) => getInfo(e.target.value));

    const button = document.getElementById("userLocation");
    button.addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const coords = position.coords.latitude+","+position.coords.longitude;
            getInfo(coords, true);
        });
    });
});