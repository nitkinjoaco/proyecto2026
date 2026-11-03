const API_URL = 'http://localhost:3000';

async function cambiarcontrasena(correo1, contraseña1, contraseñanueva) {
  try {
    const res = await fetch(`${API_URL}/api/cambiarcontrasena`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo1, contraseña1, contraseñanueva }),
    });
    const data = await res.json();
    console.log("Respuesta del servidor:", data);

    if (res.ok) {
      console.log("Contraseña cambiada:", data.message || data);
      alert(data.message);
      window.location.href = "wireframe.html";
    } else {
      console.log("No se pudo cambiar la contraseña:", data.message || res.status);
      alert(data.message);
    }
  } catch (err) {
    console.error("Error de red o del servidor:", err.message);
    alert("Ocurrio un error al conectar con el servidor");
  }
}

document.querySelector(".boton").addEventListener("click", () => {
  const correo1 = localStorage.getItem("correo");
  const contraseña1 = localStorage.getItem("contraseña");
  const contraseñanueva = document.querySelector('input[name="contraseñanueva"]').value;

  if (!contraseñanueva) {
    alert("Completá el campo");
    return;
  }

  cambiarcontrasena(correo1, contraseña1, contraseñanueva);
});





const botoncuadrado = document.querySelector('.boton');

botoncuadrado.addEventListener("click", () => {

    window.location.href = "wireframe.html"; 
});