exports.distance = (lat1, lon1, lat2, lon2) => {
    const rayonEarth = 6371;

    lat1 = convertRadian(lat1);
    lat2 = convertRadian(lat2);
    lon1 = convertRadian(lon1);
    lon2 = convertRadian(lon2);

    let distanceLat = lat1 - lat2;
    let distanceLon = lon1 - lon2;

    let a = Math.pow(Math.sin(distanceLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(distanceLon/2), 2);
    let c = 2*Math.asin(Math.sqrt(a));

    return rayonEarth*c;
}

function convertRadian(value){
    return (Math.PI/100)*value;
}