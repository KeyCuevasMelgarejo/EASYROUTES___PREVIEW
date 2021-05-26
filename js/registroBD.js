jQuery(document).ready(function(){
    $(".accordion-titulo").click(function(e){
    e.preventDefault();
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'easyroutes'
    });
    connection.connect(function(err) {
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    var porRuta=document.getElementById("r").value;
    var porCoordenada=document.getElementById("coord").value;
    var post  = {ruta: porRuta, coordenadas: porCoordenada};
    $query = connection.query('INSERT INTO rutas SET ?',post,function(err,result) {
        if(err){
            console.log("Ha ocurrido un error al ejecutar el script");
            console.log(err);
            return;
            }
        console.log("Script ejecutado correctamente");
        console.log(query.sql);
    });
    // Close the connection
    connection.end(function(){
        // The connection has been closed
    });
    });
});
