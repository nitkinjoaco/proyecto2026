const { error } = require("node:console");

fetch("/api/ultima")
.then((respuesta) => {
    if(!respuesta.ok) {
        throw new error("Error HTTP: " + respuesta.status);
    }
    return respuesta.json();
})
.then((datos) => {
    console.log("Ultima medicion:", datos);
})

.then((datos) => {
    document.getElementById("Ultima").textContent = datos.valor;
})
.catch ((error) => {
    console.error("Error:", error)
});






const botoncuadrado = document.querySelector('.boton1');

botoncuadrado.addEventListener("click", () => {

    window.location.href = "ayuda.html"; 
});

const botoncuadrado1 = document.querySelector('.boton');

botoncuadrado1.addEventListener("click", () => {

    window.location.href = "gestionar.html"; 
});

