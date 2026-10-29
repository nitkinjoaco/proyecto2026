const API_URL = 'http://localhost:3000';

async function iniciarSesion(correo1, contraseña1) {
  try{
    const res = await fetch(`${API_URL}/api/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
  
        },
        body: JSON.stringify({ correo1, contraseña1}),
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
    

document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const correo1 = document.querySelector("#email").value;
    const contraseña1 = document.querySelector("#password").value;
   

    
    console.log("llamando a iniciarSesion", correo1, contraseña1);
    iniciarSesion( correo1, contraseña1)
});
    











