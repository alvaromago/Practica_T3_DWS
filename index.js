const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const server = http.createServer(); // Creación server

server.on("request", function (peticion, respuesta) {
	let urlCompleta = url.parse(peticion.url, true);
	let pathname = urlCompleta.pathname;
	let fichero = "";

	if (pathname === "/dni") {
		// Caso url es /dni
		fichero = "./instrucciones.html"; // Muestre esta página

		if (urlCompleta.query.num) {
			// Caso url tiene número dni
			const numDni = urlCompleta.query.num;
			const letraDni = letrasDni(numDni); // Se manda a la función para ver su letra
			respuesta.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			respuesta.write(`<h1>Tu DNI con su letra correspondiente:</h1> <h2>${numDni}${letraDni}</h2>`);
			respuesta.end();
		}
	} else if (pathname === "/escribir") {
		// Caso url es /escribir
		// Crea la carpeta "Copia" si no existe
		const carpetaCopia = "./Copia";
		if (!fs.existsSync(carpetaCopia)) {
			fs.mkdirSync(carpetaCopia);
		}

		// Crear el archivo "holaMundo.txt"
		const archivoHolaMundo = path.join(carpetaCopia, "holaMundo.txt");
		const nombreCompleto = "Álvaro Martín González";
		fs.writeFileSync(archivoHolaMundo, nombreCompleto);

		respuesta.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		respuesta.write("<h1>Se ha creado la carpeta 'Copia' y el archivo 'holaMundo.txt'</h1>");
		respuesta.end();
	} else if (pathname === "/") {
		// Caso página inicio
		respuesta.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		respuesta.write("<h1>Bienvenido a la página</h1>");
		respuesta.end();
	} else {
		// Cualquier otra url
		respuesta.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		respuesta.write("<h1>Archivo no encontrado</h1>");
		respuesta.end();
	}

	if (fichero !== "") {
		fs.readFile(fichero, function (err, datos) {
			// Escribe la página guardada en fichero
			respuesta.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			respuesta.write(datos);
			respuesta.end();
		});
	}
});

server.listen(8083, "127.0.0.3");
console.log("Servidor corriendo");

function letrasDni(num) {
	// Calcula la letra del dni a partir de los números
	// sacados de la url
	const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
	const indice = num % 23;
	return letras.charAt(indice);
}
