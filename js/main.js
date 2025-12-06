let productosOriginales = [];
let productosFiltrados = [];
let favoritos = [];
let deseados = [];
let miColeccion = [];
let vistaActual = "catalogo";

const contenedorProductos = document.getElementById("contenedorProductos");
const mensajeVacio = document.getElementById("mensajeVacio");
const tituloSeccion = document.getElementById("tituloSeccion");

const btnCatalogo = document.getElementById("btnCatalogo");
const btnFavoritos = document.getElementById("btnFavoritos");
const btnDeseados = document.getElementById("btnDeseados");
const btnColeccion = document.getElementById("btnColeccion");

const filtroFabricante = document.getElementById("filtroFabricante");
const filtroSerie = document.getElementById("filtroSerie");

const badgeFavoritos = document.getElementById("badgeFavoritos");
const badgeDeseados = document.getElementById("badgeDeseados");
const badgeColeccion = document.getElementById("badgeColeccion");

const totalFavoritos = document.getElementById("totalFavoritos");
const totalDeseados = document.getElementById("totalDeseados");
const totalColeccion = document.getElementById("totalColeccion");
const btnLimpiarTodo = document.getElementById("btnLimpiarTodo");

function inicializarApp() {
    cargarDatosLocalStorage();
    cargarProductos();
    configurarEventos();
}

// Funcion para cargar los productos desde el archivo JSON
function cargarProductos() {
    fetch("data/micromachines.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            productosOriginales = data.map(function(item) {
                return new Producto(
                    item.id,
                    item.nombre,
                    item.serie,
                    item.fabricante,
                    item.año,
                    item.rareza,
                    item.imagen
                );
            });
            productosFiltrados = productosOriginales;
            mostrarProductos();
            actualizarContadores();
        })
        .catch(function(error) {
            Swal.fire({
                icon: "error",
                title: "Error al cargar productos",
                text: "No se pudieron cargar los Micro Machines. Por favor, recarga la página.",
                confirmButtonText: "Entendido"
            });
        });
}

// Funcion para mostrar los productos en el contenedor
function mostrarProductos() {
    contenedorProductos.innerHTML = "";
    
    let productosAMostrar = productosFiltrados;
    
    if (vistaActual === "favoritos") {
        productosAMostrar = productosFiltrados.filter(function(producto) {
            return estaEnLista(producto.id, favoritos);
        });
    } else if (vistaActual === "deseados") {
        productosAMostrar = productosFiltrados.filter(function(producto) {
            return estaEnLista(producto.id, deseados);
        });
    } else if (vistaActual === "coleccion") {
        productosAMostrar = productosFiltrados.filter(function(producto) {
            return estaEnLista(producto.id, miColeccion);
        });
    }
    
    if (productosAMostrar.length === 0) {
        mensajeVacio.classList.remove("d-none");
        return;
    } else {
        mensajeVacio.classList.add("d-none");
    }
    
    productosAMostrar.forEach(function(producto) {
        const esFavorito = estaEnLista(producto.id, favoritos);
        const esDeseado = estaEnLista(producto.id, deseados);
        const estaEnMiColeccion = estaEnLista(producto.id, miColeccion);
        
        let claseEstado = "";
        if (esFavorito) {
            claseEstado = "en-favoritos";
        } else if (esDeseado) {
            claseEstado = "en-deseados";
        } else if (estaEnMiColeccion) {
            claseEstado = "en-coleccion";
        }
        
        // HTML para la card del autito, dinamico con JS =D
        const cardHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6 fade-in">
                <div class="card card-producto ${claseEstado}">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <small class="text-muted">${producto.año}</small>
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">
                            <span class="badge bg-${producto.obtenerColorFabricante()} badge-fabricante">
                                ${producto.fabricante}
                            </span>
                            <span class="badge bg-secondary badge-fabricante">
                                ${producto.serie}
                            </span>                            
                            <span class="badge bg-${producto.obtenerBadgeRareza()}">
                                ${producto.rareza}
                            </span>
                        </p>
                        <div class="d-flex flex-column gap-2">
                            <button class="btn btn-sm ${esFavorito ? 'btn-danger' : 'btn-outline-danger'}" 
                                    onclick="toggleFavorito(${producto.id})">
                                ${esFavorito ? 'Eliminar de Favoritos' : 'Agregar a Favoritos'}
                            </button>
                            <button class="btn btn-sm ${esDeseado ? 'btn-warning' : 'btn-outline-warning'}" 
                                    onclick="toggleDeseado(${producto.id})">
                                ${esDeseado ? 'Eliminar de Deseados' : 'Agregar a Deseados'}
                            </button>
                            <button class="btn btn-sm ${estaEnMiColeccion ? 'btn-success' : 'btn-outline-success'}" 
                                    onclick="toggleColeccion(${producto.id})">
                                ${estaEnMiColeccion ? 'Eliminar de Coleccion' : 'Marcar como adquirido'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        contenedorProductos.innerHTML += cardHTML;
    });
}

// Funcion para verificar si el producto está en la lista
function estaEnLista(idProducto, lista) {
    return lista.includes(idProducto);
}

// Funcion para buscar un producto por su ID
function buscarProductoPorId(id) {
    return productosOriginales.find(function(producto) {
        return producto.id === id;
    });
}

// Funcion para agregar o eliminar un producto de la lista de Favoritos
function toggleFavorito(idProducto) {
    const producto = buscarProductoPorId(idProducto);
    
    if (estaEnLista(idProducto, favoritos)) {
        favoritos = favoritos.filter(function(id) {
            return id !== idProducto;
        });
        
        mostrarToast(producto.nombre + " eliminado de Favoritos", "#dc3545");
    } else {
        favoritos.push(idProducto);
        guardarEnLocalStorage();
        
        mostrarToast(producto.nombre + " agregado a Favoritos", "#dc3545");
    }
    
    guardarEnLocalStorage();
    mostrarProductos();
    actualizarContadores();
}

// Funcion para agregar o eliminar un producto de la lista de Deseados
function toggleDeseado(idProducto) {
    const producto = buscarProductoPorId(idProducto);
    
    if (estaEnLista(idProducto, deseados)) {
        deseados = deseados.filter(function(id) {
            return id !== idProducto;
        });
        
        mostrarToast(producto.nombre + " eliminado de Deseados", "#ffc107");
    } else {
        deseados.push(idProducto);
        guardarEnLocalStorage();
        
        mostrarToast(producto.nombre + " agregado a Deseados", "#ffc107");
    }
    
    guardarEnLocalStorage();
    mostrarProductos();
    actualizarContadores();
}

// Funcion para agregar o eliminar un producto de la lista de Coleccion
function toggleColeccion(idProducto) {
    const producto = buscarProductoPorId(idProducto);
    
    if (estaEnLista(idProducto, miColeccion)) {
        Swal.fire({
            title: "¿Eliminar de tu colección?",
            text: producto.nombre + " se quitará de tu colección",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#198754",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(function(result) {
            if (result.isConfirmed) {
                miColeccion = miColeccion.filter(function(id) {
                    return id !== idProducto;
                });
                
                guardarEnLocalStorage();
                mostrarProductos();
                actualizarContadores();
                
                mostrarToast(producto.nombre + " eliminado de tu colección", "#198754");
            }
        });
    } else {
        miColeccion.push(idProducto);
        guardarEnLocalStorage();
        
        Swal.fire({
            icon: "success",
            title: "¡Agregado a tu colección!",
            text: producto.nombre + " ahora está en tu colección",
            timer: 2000,
            showConfirmButton: false
        });
        
        mostrarProductos();
        actualizarContadores();
    }
}

// Funcion para mostrar un toast con el mensaje y el color
function mostrarToast(mensaje, color) {
    Toastify({
        text: mensaje,
        duration: 2500,
        gravity: "top",
        position: "right",
        backgroundColor: color
    }).showToast();
}

// Funcion para actualizar los contadores de las listas
function actualizarContadores() {
    badgeFavoritos.textContent = favoritos.length;
    badgeDeseados.textContent = deseados.length;
    badgeColeccion.textContent = miColeccion.length;
    
    totalFavoritos.textContent = favoritos.length;
    totalDeseados.textContent = deseados.length;
    totalColeccion.textContent = miColeccion.length;
}

// Funcion para guardar las listas en el localStorage
function guardarEnLocalStorage() {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    localStorage.setItem("deseados", JSON.stringify(deseados));
    localStorage.setItem("miColeccion", JSON.stringify(miColeccion));
}

function cargarDatosLocalStorage() {
    const favoritosGuardados = localStorage.getItem("favoritos");
    const deseadosGuardados = localStorage.getItem("deseados");
    const coleccionGuardada = localStorage.getItem("miColeccion");
    
    if (favoritosGuardados !== null) {
        favoritos = JSON.parse(favoritosGuardados);
    }
    
    if (deseadosGuardados !== null) {
        deseados = JSON.parse(deseadosGuardados);
    }
    
    if (coleccionGuardada !== null) {
        miColeccion = JSON.parse(coleccionGuardada);
    }
}

// Funcion para cambiar la vista actual
function cambiarVista(nuevaVista) {
    vistaActual = nuevaVista;
    
    const botones = document.querySelectorAll(".btn-nav");
    botones.forEach(function(boton) {
        boton.classList.remove("active");
    });
    
    if (nuevaVista === "catalogo") {
        btnCatalogo.classList.add("active");
        tituloSeccion.textContent = "Todos los Micro Machines";
    } else if (nuevaVista === "favoritos") {
        btnFavoritos.classList.add("active");
        tituloSeccion.textContent = "Favoritos";
    } else if (nuevaVista === "deseados") {
        btnDeseados.classList.add("active");
        tituloSeccion.textContent = "Lista de Deseados";
    } else if (nuevaVista === "coleccion") {
        btnColeccion.classList.add("active");
        tituloSeccion.textContent = "Mi Coleccion";
    }
    
    mostrarProductos();
}

// Funcion para aplicar los filtros de fabricante y serie
function aplicarFiltros() {
    const fabricanteSeleccionado = filtroFabricante.value;
    const serieSeleccionada = filtroSerie.value;
    
    productosFiltrados = productosOriginales.filter(function(producto) {
        let cumpleFabricante = true;
        let cumpleSerie = true;
        
        if (fabricanteSeleccionado !== "todos") {
            cumpleFabricante = producto.fabricante === fabricanteSeleccionado;
        }
        
        if (serieSeleccionada !== "todos") {
            cumpleSerie = producto.serie === serieSeleccionada;
        }
        
        return cumpleFabricante && cumpleSerie;
    });
    
    mostrarProductos();
}

// Funcion para configurar los eventos de los botones y los filtros
function configurarEventos() {
    btnCatalogo.addEventListener("click", function() {
        cambiarVista("catalogo");
    });
    
    btnFavoritos.addEventListener("click", function() {
        cambiarVista("favoritos");
    });
    
    btnDeseados.addEventListener("click", function() {
        cambiarVista("deseados");
    });
    
    btnColeccion.addEventListener("click", function() {
        cambiarVista("coleccion");
    });
    
    filtroFabricante.addEventListener("change", aplicarFiltros);
    filtroSerie.addEventListener("change", aplicarFiltros);
    
    btnLimpiarTodo.addEventListener("click", limpiarTodasLasListas);
}

// Funcion para limpiar todas las listas
function limpiarTodasLasListas() {
    Swal.fire({
        title: "⚠️ ¿Estás seguro?",
        text: "Esto eliminará TODAS tus listas (Favoritos, Deseados y Colección). Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar todo",
        cancelButtonText: "Cancelar"
    }).then(function(result) {
        if (result.isConfirmed) {
            favoritos = [];
            deseados = [];
            miColeccion = [];
            
            localStorage.removeItem("favoritos");
            localStorage.removeItem("deseados");
            localStorage.removeItem("miColeccion");
            
            mostrarProductos();
            actualizarContadores();
            
            Swal.fire({
                icon: "success",
                title: "Listas eliminadas",
                text: "Todas tus listas han sido limpiadas",
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// Funcion para inicializar la app
// Evento para cargar la app cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarApp);