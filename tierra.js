const API_URL = 'http://localhost:3000'; 


fetch(`${API_URL}/api/actual`)
.then((respuesta) => {
    if(!respuesta.ok) {
        throw new Error("Error HTTP: " + respuesta.status);
    }
    return respuesta.text();
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

fetch(`${API_URL}/api/historico`)
.then((respuesta) => {
if(!respuesta.ok) {
    throw new Error("Error HTTP: " + respuesta.status);
}
    return respuesta.json();
})
.then((datos) => {
    console.log("Historial recibido", datos);

historial = datos;
dibujar();
})

.catch ((error) => {
    console.error("Error al cargar el historial:", error)
});


const boton = document.querySelector('.boton5');
const cuadrado = document.querySelector('.cuadrado15');

boton.addEventListener('click', () => {
    if (cuadrado.classList.contains('mostrar')) {
        cuadrado.classList.remove('mostrar');
    } else {
        cuadrado.classList.add('mostrar');
    }
});  
cuadrado.addEventListener('mouseleave', () => {
    cuadrado.classList.remove('mostrar');
});

const botoncuadrado = document.querySelector('.boton1');

botoncuadrado.addEventListener("click", () => {

    window.location.href = "ayuda.html"; 
});

const botoncuadrado1 = document.querySelector('.boton');

botoncuadrado1.addEventListener("click", () => {

    window.location.href = "gestionar.html"; 
});

