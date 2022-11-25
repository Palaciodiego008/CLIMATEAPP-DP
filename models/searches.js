import fetch from 'node-fetch'
import fs from 'fs'


class Searches {
    history = [];
    dbPath = './db/database.json';
    constructor() {
        this.readDB();
    }

    get historyCapitalized() {
        return this.history.map(place => {
            let words = place.split(' ');
            words = words.map(p => p[0].toUpperCase() + p.substring(1));

            return words.join(' ');
        })
    }


    async city(place = '') {

        try {

            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?types=place&language=es%2Cen&access_token=${process.env.MAPBOX_KEY}`)
            const data = await res.json();

            return data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]

            }))

        } catch (error) {
            return [];
        }

    }


    async weatherPlace(lag, lgn) {
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lag}&lon=${lgn}&appid=${process.env.OPENWEATHER_KEY}&units=metric`)
            const data = await res.json();

            let dt = {
                desc: data.weather[0].description,
                min: data.main.temp_min,
                max: data.main.temp_max,
                temp: data.main.temp

            }
            return dt;

        } catch (error) {
            return console.log(error);
        }
    }

    async addHistory(place = '') {
        if (this.history.includes(place.toLocaleLowerCase())) {
            return;
        }

        this.history = this.history.splice(0, 5);



        this.history.unshift(place.toLocaleLowerCase());


        this.saveDB();

    }

    async saveDB() {
        const payload = {
            history: this.history
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    async readDB() {
        if (!fs.existsSync(this.dbPath)) {
            return;
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.history = data.history;
    }



}

export default Searches;



