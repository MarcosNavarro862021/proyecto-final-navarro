function Producto(id, nombre, serie, fabricante, año, rareza, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.serie = serie;
    this.fabricante = fabricante;
    this.año = año;
    this.rareza = rareza;
    this.imagen = imagen;
    
    this.obtenerBadgeRareza = function() {
        if (this.rareza === "Ultra Raro") {
            return "danger";
        } else if (this.rareza === "Muy Raro") {
            return "warning";
        } else if (this.rareza === "Raro") {
            return "info";
        } else {
            return "secondary";
        }
    };
    
    this.obtenerColorFabricante = function() {
        if (this.fabricante === "Galoob") {
            return "primary";
        } else if (this.fabricante === "Hasbro") {
            return "success";
        } else {
            return "info";
        }
    };
}

