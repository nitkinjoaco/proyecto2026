async function crearCuenta(email,password) {
    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password}),
        });
        const data = await res.json();
        console.log("Respuesta del servidor:", data);

        if (res.ok) {
            console.log("Cuenta creada:", data.message || data);
            window.location.href = "wireframe.html"
        }
        else{
            console.log("No se pudo crear la cuenta:", data.message || res.status);
        }
        }
        catch (err){
            console.error("Error de red o del servidor:",  err.message);
        }
        
    
}
crearCuenta("usuario@gmail.com", "123456");



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


const botoncuadrado = document.querySelector('.boton1');

botoncuadrado.addEventListener("click", () => {

    window.location.href = "ayuda.html"; 
});

const botoncuadrado1 = document.querySelector('.boton2');

botoncuadrado1.addEventListener("click", () => {

    window.location.href = "tierra.html"; 
});


const botoncuadrado12 = document.querySelector('.boton12');

botoncuadrado12.addEventListener("click", () => {

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