
export default class HiLows {
    constructor() {     
    }


    barometer: HiLow;
    windSpeed: HiLow;
    inTemperature: HiLow;
    inHumidity: HiLow;
    temperature: HiLow;
    dewpoint: HiLow;
    windChill: HiLow;
    heatIndex: HiLow;
    thswIndex: HiLow;
    radiation: HiLow;
    uvHigh: HiLow;
    rainHigh: HiLow;
    humidity: HiLow;
    dateLoaded: Date;
    forecast: any;  
    rain1hour: number;

}

class HiLow {
    hourlyHi;
    dailyLow;
    dailyHi;
    monthLow;
    monthHi;
    yearLow;
    yearHi;
    dailyLowTime;
    dailyHighTime;
}