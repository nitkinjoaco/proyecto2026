const API_URL = 'http://localhost:3000';

async function iniciarSesion(email, password) {
  try{
    const res = await fetch(`${API_URL}/api/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
  
        },
        body: JSON.stringify({ email, password}),
        }); 
        const data = await res.text();
        console.log("Respuesta del servidor:", data);

        if (res.ok) {
            console.log("Sesion iniciada:", data.message || data);
            window.location.href = "gestionar.html"
        }
        else{
            console.log("No se pudo iniciar sesion:", data.message || res.status);
            alert(data);
        }
        }
        catch (err){
            console.error("Error de red o del servidor:",  err.message);
            alert("Ocurrio un error al conectar con el servidor");
        }
}
    
    








const botoncuadrado = document.querySelector('.boton');

botoncuadrado.addEventListener("click", () => {

    window.location.href = "gestionar.html"; 
});


