/*	UTM.js
 *		LatLng <-> UTM converter
 *		unit: meter
 *
 * 		2014.07.23 Yuta Tachibana
 **/

var UTM = function() {
	// Constant
	var a = 6378137.0,			// 長半径(WGS84)
		f = 1 / 298.257223563,	// 扁平率(WGS84)
		k = 0.9996;				// 縮尺係数
	var datum=(-45)/180*Math.PI , hemi=-1;			// 基準経度, N/S

	// Preliminary values
	var n = f / (2-f);
	var A = a / (1+n) * ( 1 + n*n/4 + n*n*n*n/64 );
	var alpha = [
		1/2 * n - 2/3 * n*n + 5/16 * n*n*n,
		13/48 * n*n - 3/5 * n*n*n,
		61/240 * n*n*n
	];
	var beta = [
		1/2 * n - 2/3 * n*n + 37/96 * n*n*n,
		1/48 * n*n + 1/15 * n*n*n,
		17/480 * n*n*n
	];


	/*
	 *
	 **/
	function setZone(str){

	}


	/* LatLng -> UTM 
	 *	
	 *	Note: lat, lng is degree
	 **/
	function latlngToUTM (lat, lng){
		var phi = lat / 180 * Math.PI,
			lambda = lng / 180 * Math.PI;

		var t = _sinh(
			_atanh( Math.sin(phi) ) 
			- (2*Math.sqrt(n)) / (1+n) * _atanh( (2*Math.sqrt(n)) / (1+n) * Math.sin(phi) )
		);
		var xi = Math.atan( t / Math.cos(lambda-datum) );
		var eta = _atanh( Math.sin(lambda-datum) / Math.sqrt(1+t*t) );

		var x_0 = 500000;
		var y_0 = (hemi == 1) ? 0 : 10000000;

		var x = x_0 + k*A * ( eta + _sigma(1, 3, function(j) {
			return alpha[j-1] * Math.cos(2*j*xi) * _sinh(2*j*eta);
		}));
		
		var y = y_0 + k*A * ( xi + _sigma(1, 3, function(j) {
			return alpha[j-1] * Math.sin(2*j*xi) * _cosh(2*j*eta);
		}));

		return { x:x, y:y };
	} 


	function _atanh(x) {
		return 1/2 * Math.log( (1+x)/(1-x) );
	}

	function _sinh(x) {
		return (Math.exp(x) - Math.exp(-x)) / 2;
	}
	
	function _cosh(x) {
		return (Math.exp(x) + Math.exp(-x)) / 2;
	}

	function _sigma(first, last, func){
		var sum = 0;
		for (var i = first; i <= last; i++){
			sum += func(i);
		}
		return sum;
	}


	return {
		datum: datum,
		hemi: hemi,
		latlngToUTM: function(lat, lng) {
			return latlngToUTM(lat, lng);
		}
	};

};
