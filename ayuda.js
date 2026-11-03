const botoncuadrado = document.querySelector('.boton');

botoncuadrado.addEventListener("click", () => {

    window.location.href = "gestionar.html"; 
});

const botoncuadrado1 = document.querySelector('.boton2');

botoncuadrado1.addEventListener("click", () => {

window.location.href = "tierra.html";

});





const botoncuadrado13 = document.querySelector('.boton6');

botoncuadrado13.addEventListener("click", () => {

window.location.href = "mail.html"
});

const botoncuadrado14 = document.querySelector('.boton7');

botoncuadrado14.addEventListener("click", () => {

    window.location.href = "wireframe.html"
})

const boton = document.querySelector('.boton5');
const cuadrado = document.querySelector('.cuadrado14');

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


const nombreGuardado = localStorage.getItem("nombreUsuario");
  if (nombreGuardado) {
    document.getElementById("nombre-usuario").textContent = nombreGuardado;
  }