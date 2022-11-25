
import { inquirerMenu, pause, readInput, listPlaces } from "./helpers/inquirer.js" 
import Searches from "./models/searches.js";
import * as dotenv from 'dotenv';
dotenv.config();



const main = async () => {
    let opt = '';
    const search = new Searches();
    

    do {
        opt = await inquirerMenu();
       
        switch (opt) {
            case 1:
                
                const term = await readInput('City: ');
                const places =  await search.city(term);
                const idSelected = await listPlaces(places);

                if (idSelected === 0) continue;

                // Save in DB
             

                const placeSelected = places.find(p => p.id === idSelected);
                search.addHistory(placeSelected.name);
    
                const weather = await search.weatherPlace(placeSelected.lat, placeSelected.lng);

             
                console.clear();
    
                console.log('\n Information of the city \n'.green);
                console.log('City: ', placeSelected.name);
                console.log('Lat: ', placeSelected.lat);
                console.log('Lng: ', placeSelected.lng);
                console.log('Temperature: ', weather.temp);
                console.log('Minimum: ', weather.min);
                console.log('Maximum: ', weather.max);
                console.log('Description: ', weather.desc.toUpperCase().green);

             break;
            case 2:
                search.historyCapitalized.forEach((place, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${place}`);
                })
               

        }

        if (opt !== 0) await pause();

    
    } while (opt !== 0);

}

main();