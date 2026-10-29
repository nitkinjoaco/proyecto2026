const API_URL = 'http://localhost:3000'; 


async function crearCuenta(nombre, correo, contraseña) {
  
    try {
        const res = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nombre, correo, contraseña}),
        });
        const data = await res.text();
        console.log("Respuesta del servidor:", data);

        if (res.ok) {
            console.log("Cuenta creada:", data.message || data);
            form.reset()
            window.location.href = "wireframe.html"
        }
        else{
            console.log("No se pudo crear la cuenta:", data.message || res.status);
            alert(data);
        }
        }
        catch (err){
            console.error("Error de red o del servidor:",  err.message);
        }
}


document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.querySelector("#nombre").value;
    const correo = document.querySelector("#email").value;
    const contraseña = document.querySelector("#password").value;
    const confirmar = document.querySelector("#confirmar").value;

    if (contraseña !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }
    console.log("llamando a crearCuenta", nombre, correo, contraseña);
    crearCuenta(nombre, correo, contraseña)
});
