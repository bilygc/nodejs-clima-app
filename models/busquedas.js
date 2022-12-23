import axios from 'axios';
import fs from 'fs'

class Busquedas{
    
    historial = [];
    bdPath = './db/data.json';

    constructor(){
        this.leerDB();
    }

    get paramsMapBox(){
        return {
            'language':'es',
            'access_token':process.env.MAPBOX_KEY || '',
            'limit':5
        };
    }

    get historialCapitalizado(){
        
        let capitalizeCity = [];

        this.historial.forEach(city =>{
            capitalizeCity.push(city.split(" ").map( word => word[0].toUpperCase()+word.substr(1)).join(" "));
        });

        this.historial = capitalizeCity;
        this.historial.forEach((city, i) => {
            const idx = i +1;
            console.log(`${(idx+'.').toString().green} ${city}`)
        });
    }

    async getClima(lat = 0, lon = 0, apiKey ='', units = 'metric', lang = 'es'){

        try{

            const instance = axios.create({
                baseURL:'https://api.openweathermap.org/data/2.5/weather',
                params:{
                    lat,
                    lon,
                    appid:apiKey,
                    units,
                    lang
                }
            });

            const { data } = await instance.get();
            
            return {
                description: data.weather[0].description,
                temp: data.main.temp,
                minimum: data.main.temp_min,
                maximum: data.main.temp_max,
                humidity: data.main.humidity,
                wind: data.wind.speed
            }

        }catch(err){
            console.log(`Error: ${err}`);
        }
    }

    async ciudad(ciudad = ''){
        
        
        try{

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
                params: this.paramsMapBox
            });
            
            const {data} = await instance.get();

            return data.features.map( feature => ({
                id: feature.id,
                nombre: feature.place_name,
                lng: feature.center[0],
                lat: feature.center[1]
            }));

        }catch(err){
            console.log(err);
        }

    }

    agregarHistorial(lugar = ''){
        
        if(this.historial.includes(lugar.toLowerCase() )) return;



        this.historial = [...this.historial.splice(0,5)];
        this.historial.unshift(lugar.toLowerCase());
        this.guardarDB();
    }

    guardarDB(){
        const payload= {
            historial:this.historial
        }

        fs.writeFileSync(this.bdPath, JSON.stringify(payload));
    }

    leerDB(){
        
        if(fs.existsSync(this.bdPath)){

            const aux = fs.readFileSync(this.bdPath,{encoding:'utf-8'});
    
            const db = JSON.parse(aux);
            //console.log(db);
    
            this.historial = [... db.historial];
        }else{
            console.error('No existe el archivo de BD');
        }
        

    }

    
}

export default Busquedas;