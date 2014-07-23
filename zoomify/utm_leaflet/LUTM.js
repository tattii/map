/*
 *
 * UTM (m)
 * x = a*lng + b
 * y = c*lat + d;
 */


var LUTM = function (){
	var a, b, c, d;


	/*
	 * p = {x: , y: , lat: , lng: }
	 */
	function setProjection (p1, p2){
		a = (p1.x - p2.x) / (p1.lng - p2.lng);
		b = p1.x - a*p1.lng;
		c = (p1.y - p2.y) / (p1.lat - p2.lat);
		d = p1.y - a*p1.lat;
	}

	function projectToUTM (lat, lng){
		return {
			x: a*lng + b,
			y: c*lat + d
		};
	}

	function projectToLatLng (x, y){
		return {
			lat: (y-d) / c,
			lng: (x-b) / a
		};
	}



	return {
		setProjection: function (p1, p2){
			setProjection(p1, p2);
		},
		projectToUTM: function (lat, lng){
			return projectToUTM(lat, lng);
		},
		projectToLatLng: function (x, y){
			return projectToLatLng(x, y);
		}
	};
}
