async function crearCuenta(nombre, email, password) {
    try {
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nombre, email, password}),
        });
        const data = await res.text();
        console.log("Respuesta del servidor:", data);

        if (res.ok) {
            console.log("Cuenta creada:", data.message || data);
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
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmar = document.querySelector("#confirmar").value;

    if (password !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }
    console.log("llamando a crearCuenta", nombre, email, password);
    crearCuenta(nombre, email, password)
});
