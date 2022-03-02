var geoLocation = {
   home: [],
   limit: 0.25,
   data: {},

   setGeoData(data) {
      this.data = data;
      /*
      var lat = data.coords.latitude;
      var lon = data.coords.longitude;
      this.distance = this.getDistanceFromLatLonInKm(this.home, lat, lon);
      */
   },

   getData() {
      return this.data;
   },

   getDistanceFromLatLonInKm(home, lat, lon) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(home[0]-lat);  // deg2rad below
      var dLon = this.deg2rad(home[1]-lon); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(home[0])) * Math.cos(this.deg2rad(home[1])) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
   },
    
   deg2rad(deg) {
      return deg * (Math.PI/180)
   }
};

export default geoLocation;