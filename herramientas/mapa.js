(function($) {  
  var registrandoPosicion = false,
    idRegistroPosicion, ultimaPosicionUsuario, marcadorUsuario, mapa, div = document.getElementById('mapa');
  mapa = new google.maps.Map(div, {
    zoom: 13,
    center: new google.maps.LatLng(0, 0),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  function registrarPosicion() {
    if (registrandoPosicion) {
      registrandoPosicion = false;
      navigator.geolocation.clearWatch(idRegistroPosicion);
      limpiarUbicacion();
    } else {
      idRegistroPosicion = navigator.geolocation.watchPosition(exitoRegistroPosicion, falloRegistroPosicion, {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      });
    }
  }

  function exitoRegistroPosicion(position) {
    if (!registrandoPosicion) {
      // Es la primera vez 
      registrandoPosicion = true;
      ultimaPosicionUsuario = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      marcadorUsuario = new google.maps.Marker({
        position: ultimaPosicionUsuario,
        map: mapa
      });
    } else {
      var posicionActual = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      ultimaPosicionUsuario = posicionActual;
      marcadorUsuario.setPosition(posicionActual);
    }
    mapa.panTo(ultimaPosicionUsuario);
  }

  function falloRegistroPosicion() {
    alert('No se pudo determinar la ubicación');
    limpiarUbicacion();
  }

  function limpiarUbicacion() {
    ultimaPosicionUsuario = new google.maps.LatLng(0, 0);
    if (marcadorUsuario) {
      marcadorUsuario.setMap(null);
      marcadorUsuario = null;
    }
  }
  $('#localizar').on('click', function(e) {
    e.preventDefault();
    registrarPosicion();
  });
})(jQuery);