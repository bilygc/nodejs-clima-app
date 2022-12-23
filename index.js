import * as dotenv from 'dotenv'
import colors from 'colors';
import  { leerInput, inquirerMenu, pausa, listarLugares } from "./helpers/inquirer.js"
import Busquedas from "./models/busquedas.js";

dotenv.config();


const main  = async () =>{
    let opcion;
    const busquedas = new Busquedas();

    do{

        console.log();
        opcion = await inquirerMenu();

        switch(opcion){
            case 1:
                const termino = await leerInput('Introduzca la ciudad a buscar');

                const lugares = await busquedas.ciudad(termino);

                const idLugar = await listarLugares(lugares)

                if (idLugar === '0') continue;

                const lugarSel = lugares.find( l => l.id === idLugar);

                const { nombre, lat, lng } = lugarSel;

                busquedas.agregarHistorial(nombre);

                const weather = await busquedas.getClima(lat, lng, process.env.OPENWEATHER_KEY);
                
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:'.green,nombre );
                console.log('Lat:'.green, lat);
                console.log('Lng:'.green, lng);
                console.log('Condiciones de cielo:'.green, weather.description );
                console.log('Temperatura Actual:'.green, weather.temp );
                console.log('Mínima:'.green, weather.minimum);
                console.log('Máxima:'.green, weather.maximum);
                console.log('Humedad:'.green, weather.humidity);
                console.log('Viento:'.green, weather.wind);
                
            break;

            case 2:
                // busquedas.historial.forEach((lugar,i) =>{
                //     const idx = i +1;
                //     console.log(`${(idx+'.').toString().green} ${lugar}`);
                // });

                busquedas.historialCapitalizado;
            break;
        }
        
        if(opcion !== 0) await pausa();

    }while(opcion !== 0)
}

main();