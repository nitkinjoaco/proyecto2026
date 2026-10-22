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

document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    crearCuenta(email,password)
});


const botoncuadrado = document.querySelector('.boton');

botoncuadrado.addEventListener("click", () => {

    window.location.href = "gestionar.html"; 
});
