import axios from "axios";
import { locationHelper } from "../../../helpers/locationHelper";
import config from "../../../config";

const getCitiesFromApi = async (latitude: string, longitude: string) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await axios.get(url);
    const country = response.data.countryName;
    const cities = await axios.post('https://countriesnow.space/api/v0.1/countries/cities',{
        country:country
    })

    return cities.data.data
}

const getLocationInfoByQuardiant = async (latitude: string, longitude: string) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await axios.get(url);

    return {
        country: response.data.countryName,
        city: response.data.city,
        division: response.data.principalSubdivision,
        latitude: response.data.latitude,
        longitude: response.data.longitude
    }
    
}
const getTravelGeneralInfo = async (from:{latitude: string, longitude: string},to:{latitude: string, longitude: string}) => {
   
    
    const distance = locationHelper.getDistanceFromLatLonInKm(parseFloat(from.latitude), parseFloat(from.longitude), parseFloat(to.latitude), parseFloat(to.longitude));
    const travelTime = locationHelper.estimateTravelTime(distance.distance);

    const toLocation = await getLocationInfoByQuardiant(to.latitude, to.longitude);
    const fromLocation = await getLocationInfoByQuardiant(from.latitude, from.longitude);

    const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${toLocation.city}%2C${toLocation.country}&format=json&apiKey=${config.geophy.apiKey}`)
    const place_id = response?.data?.results[0]?.place_id

    

    const catagories = `entertainment.theme_park,natural.mountain,natural.water`

    const resources = await axios.get(`https://api.geoapify.com/v2/places?categories=${catagories}&filter=place:${place_id}&limit=10&apiKey=${config.geophy.apiKey}`)


    const resourseData = resources?.data?.features?.filter((item:any)=>Boolean(item.properties?.name)).map((item:any)=>{
        return {
            name:item.properties.name,
            city:item.properties.city,
            country:item.properties.country,
            address:item.properties.formatted,
            longitude:item.geometry.coordinates[0],
            latitude:item.geometry.coordinates[1],
            catagories:item.properties.categories
        }
    })

    return {
        from:fromLocation.city,
        to:toLocation.city,
        distance:{
            km:distance.km,
            mile:distance.mi
        },
        travelTime,
        suggestLocations:resourseData
    }
    
}
export const LocationService = {
    getCitiesFromApi,
    getLocationInfoByQuardiant,
    getTravelGeneralInfo
}