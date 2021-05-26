
function buscar(){
    //-----------------------------------------------------------------------
    //Procesos para dar la ubicacion del usuario y seguir segun su movimiento
    //-----------------------------------------------------------------------
    var registrandoPosicion = false,
        idRegistroPosicion, ultimaPosicionUsuario, marcadorUsuario, mapa, div = document.getElementById('mapa');
        mapa = new google.maps.Map(div, {
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: {
        //style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: false, //barra inferior que me muestra el kilometraje
        //center: new google.maps.LatLng(0,0),
        center: new google.maps.LatLng(-12.058735,-77.058949),
        mapTypeControl:false,//Desactiva la opcion de poder el mapa en modo satelital y cambiar de relieve
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    navigator.geolocation.getCurrentPosition(exitoRegistroPosicion);//Recordar colcar esto para saber la ubicacion actual

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
        //Cuadro de informacion al hacer clic
        var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">Tú</h1>'+
        '<div id="bodyContent">'+
        '<p><b>Desde aquí</b>, Eliges a donde moverte </p>' + '</div>'+
        '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        //No Mover!!
        marcadorUsuario = new google.maps.Marker({
            position: ultimaPosicionUsuario,
            title: 'Aquí estás',
            map: mapa
        });
        marcadorUsuario.addListener('click', function() {
            infowindow.open(mapa, marcadorUsuario);
        });
        //
        marcadorUsuario.setPosition(ultimaPosicionUsuario);
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
        ultimaPosicionUsuario = new google.maps.LatLng(0,0);
        if (marcadorUsuario) {
        marcadorUsuario.setMap(null);
        marcadorUsuario = null;
        }
    }
    //---------------------------------------------------------------------
    //Funciones para la opcion centrar o devolver a la posicion del usuario
    //---------------------------------------------------------------------
    function CenterControl(controlDiv, mapa) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Clic para volver a tu posición actual';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = '¿Dónde estoy';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
        mapa.setCenter(ultimaPosicionUsuario);
        });
    }
    // Create the DIV to hold the control and call the CenterControl() constructor
    // passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, mapa);

    centerControlDiv.index = 1;
    mapa.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
    //------------------------------------------------------------------
    //Funciones para usar una caja de texto e ingresar el lugar a buscar
    //------------------------------------------------------------------
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    mapa.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    mapa.addListener('bounds_changed', function() {
        searchBox.setBounds(mapa.getBounds());
    });

    var markers = [];
    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
        return;
        }
        // Clear out the old markers.
        markers.forEach(function(marker) {
        marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        //Variable para el historial
        var placesList = document.getElementById('places');
        places.forEach(function(place) {
        var icon = {
            url: 'imagenes/tires_chains2.png',
            size: new google.maps.Size(90, 90),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
            map: mapa,
            icon: icon,
            title: place.name,
            position: place.geometry.location
        }));
        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
        });
        mapa.fitBounds(bounds);
    });
    // [END region_getplaces]
    //------------------------------------------------------------------
    //Funciones para dibujar la rutas
    //------------------------------------------------------------------
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYLINE]
        },
        markerOptions: {icon: 'images/beachflag.png'},
    });
    drawingManager.setMap(mapa);
    //------------------------------------------------------------------
    //Funciones para obtener las coordenadas
    //------------------------------------------------------------------
    /*var selectedShape;
    function clearSelection () {
        if (selectedShape) {
            if (selectedShape.type !== 'marker') {
                selectedShape.setEditable(false);
            }
            selectedShape = null;
        }
    }*/
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
        var newShape = e.overlay;
        newShape.type = e.type;
    });
    google.maps.event.addListener(drawingManager, "overlaycomplete", function(event){
            overlayClickListener(event.overlay);
            $('#coord').val(event.overlay.getPath().getArray());
    });
    function overlayClickListener(overlay) {
        google.maps.event.addListener(overlay, "mouseup", function(event){
            $('#coord').val(overlay.getPath().getArray());
        });
    }
    /*google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
    google.maps.event.addListener(mapa, 'click', clearSelection);*/
    //------------------------------------------------------------------
    //Funciones para obtener una ubicacion al hacer clic
    //------------------------------------------------------------------
    var nuevos_marcadores = [];
    function limpiar_marcadores(lista){
        for(i in lista){
            //QUITAR MARCADOR DEL MAPA
            lista[i].setMap(null);
        }
    }

    google.maps.event.addListener(mapa, "click", function(event){

        var coordenadas = event.latLng.toString();
        coordenadas = coordenadas.replace("(", "");
        coordenadas = coordenadas.replace(")", "");
        var lista = coordenadas.split(",");
        var direccion = new google.maps.LatLng(lista[0], lista[1]);
        //acumulador=acumulador + direccion;
        var marcador = new google.maps.Marker({
            //titulo:prompt("Titulo del marcador?"),
            icon: {url: 'imagenes/tires_chains2.png'},
            position:direccion,
            map: mapa,
            animation:google.maps.Animation.DROP,
            draggable:false
        });
        //ALMACENAR UN MARCADOR EN EL ARRAY nuevos_marcadores
        nuevos_marcadores.push(marcador);
        //
        google.maps.event.addListener(marcador, "click", function(){
        });
        //BORRAR MARCADORES NUEVOS
        limpiar_marcadores(nuevos_marcadores);
        marcador.setMap(mapa);
    });
}
