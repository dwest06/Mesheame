// //////////////////////
// VARIABLES GLOBALES
// /////////////////////
// Canavs and context
let canvas = document.getElementById("mycanvas")
let context = canvas.getContext('2d');

// Points to use 
let points = []
// constrains
let constrains = []
// Image for background
let background = new Image()
// Triangles generated 
let triangles = []
// Connections
let connections = []

// To draw elements
let drawTri = true
let drawCon = true
// let darwCen = true
let drawGri = true


let point = (x,y) => {
	return {x: x, y: y}
}

let triangle = (point1, point2, point3, centerx, centery, id ) => {
	return {
		v1: point1,
		v2: point2,
		v3: point3,
		center: point(centerx,centery),
		id: id
	}
}

// //////////////////////
// CONFIGURACIONES
// /////////////////////

background.onload = function() {
	canvas.height = this.height
	canvas.width = this.width
}
let hack = document.getElementById("hackimg")
background.src = hack.src
background.style.opacity = 0.4


// //////////////////////
// FUNCIONES
// /////////////////////

let center = (x1, x2, x3, y1, y2, y3) => {
	return point( Math.floor((x1 + x2 + x3) / 3) , Math.floor((y1 + y2 + y3) / 3))
}

let insideConstrain = (x, y, rect) => {
	return x > rect[0] && x < rect[1] && y > rect[2] && y < rect[3]
}

let showTriangles = () => {
	let lista = document.getElementById("lista")
	// Para imprimir la lista de los triangulos

	for (let i of triangles) {

		var a = //"Triangulo #" + i.id.toString() + ", " + 
			i.v1.x.toString() + ", " + i.v1.y.toString() + ", " +
			i.v2.x.toString() + ", " + i.v2.y.toString() + ", " +
			i.v3.x.toString() + ", " + i.v3.y.toString() + ", " +
			i.center.x.toString() + ", " + i.center.y.toString()
		var p = document.createElement("p")
		p.innerHTML = a
		lista.append(p)

	}
}


let generateMesh = () => {

	// Se necesita una lista de puntos que representen el grafo
	// y una lista de rectangulos de restricciones

	// Convertimos el arreglo de puntos en arreglo de arreglo de coordenadas (?)
	// de la forma [[1,2],[1,3]...], para poder generar los triangulos.
	let auxpoints = []
	for(let k of points){
		auxpoints.push([k.x,k.y])
	}


	const del = Delaunator.from(auxpoints)
	// True si el triangulo esta dentro de alguna constrain
	// en ese caso, no se agrega al arreglo de triangulos.
	let opt = false

	// Ordenamos los triangulos y generamos un arreglo de triangulo.
	for (let i = 0; i < del.triangles.length; i += 3) {
		var p1 = points[del.triangles[i]]
		var p2 = points[del.triangles[i + 1]]
		var p3 = points[del.triangles[i + 2]]
		var centertri = center(p1.x, p2.x, p3.x, p1.y, p2.y, p3.y)
	
		for (let j of constrains) {
			if (insideConstrain(centertri.x, centertri.y, j)) {
				opt = true
				console.log(centertri, j)
	
			}
		}
		if (!opt)
			triangles.push(triangle(p1, p2, p3, centertri.x, centertri.y, i / 3));
	
		opt = false
	}
	showTriangles()
	drawTriangles()
	generateConnections()
}

let drawTriangles = () => { 
	// Comenzamos a dibujar las lineas de los triangulos
	// Junto con sus vertices.
	for (var trian of triangles) {
		// Dibujamos las lineas
		context.beginPath();
		context.strokeStyle = 'black';
		context.fillStyle = "black"
		context.moveTo(trian.v1.x, trian.v1.y)
		context.lineTo(trian.v2.x, trian.v2.y)
		context.lineTo(trian.v3.x, trian.v3.y)
		context.lineTo(trian.v1.x, trian.v1.y)
		context.stroke();
		
		// Dibujamos los vertices de color azul
		// context.fillStyle = "blue"
		// context.beginPath();
		// context.arc(trian.v2.x - 2, trian.v2.y - 2, 4, 0, 2 * Math.PI)
		// context.stroke();

		// context.beginPath();
		// context.arc(trian.v3.x - 2, trian.v3.y - 2, 4, 0, 2 * Math.PI)
		// context.stroke();

		// context.beginPath();
		// context.arc(trian.v1.x - 2, trian.v1.y - 2, 4, 0, 2 * Math.PI)
		// context.stroke();
	
		// Dibujamos los centros
		context.strokeStyle = '#CEFF1A';
		context.beginPath();
		context.arc(trian.center.x, trian.center.y, 4, 0, 2 * Math.PI);
		context.fill()
		context.stroke();

		// Colocamos el id del triangulo
		context.font = "18px Arial";
		context.strokeStyle = 'black';
		context.beginPath();
		context.fillText(trian.id.toString(), trian.center.x, trian.center.y - 5)
		context.stroke();
	}
	

}

let generateTrianglesImage = () => {
	let triangleImage = canvas.toDataURL("image/png");
	let imagenElement = document.getElementById("myimg")
	imagenElement.src = triangleImage
}



let generateConnections = () => {
	// Conexiones
	let con = document.getElementById("conexiones")
	
	// Comprobar si 2 triangulos son vecinos.
	// para que cumpla, 2 vertices tiene que ser iguales.
	let comprobarVecino = (t1, t2) => {
		let count = 0;
		let verticesTriangle1 = [t1.v1, t1.v2, t1.v3]
		let verticesTriangle2 = [t2.v1, t2.v2, t2.v3]
		for( let vertice1 of verticesTriangle1){
			for( let vertice2 of verticesTriangle2){
				if (vertice1.x === vertice2.x && vertice1.y === vertice2.y){
					count++;
				}
			}
			if( count ===  2){
				return true;
			}
		}
		return false
	}
	

	for (let i of triangles) {
		for (let j of triangles) {
			if (comprobarVecino(i, j) && i.id != j.id) {
				connections.push([i,j])
				var a = i.id.toString() + " -> " + j.id.toString()
				var p = document.createElement("p")
				p.innerHTML = a
				con.append(p)
			}
		}
	}
	
	drawConnections()
	
}

// Dibuja las conexiones
let drawConnections = () => {
	context.strokeStyle = '#f5e342';
	context.beginPath();
	for (let i of connections) {
		context.moveTo(i[0].center.x, i[0].center.y)
		context.lineTo(i[1].center.x, i[1].center.y)
	}
	context.stroke();
}

// /////////////////////////////////////////

// FIN FUNCIONES DE GENERACION DE TRIANGULOS

// ////////////////////////////////////////////

// Escribe las coordenadas en el canvas segun la posicion del mouse
function actualizarCanvas(message) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = '18pt Calibri';
	context.fillStyle = 'black';

	if (background.src != null) {
		context.drawImage(background,0,0)
	}
	
	drawTriangles()
	if (drawCon){
		drawConnections()
	}
	drawPoints()
	context.fillText(message, 10, 25);
}

// Obtiene las coordenadas del mouse a cada momento en el canvas 
function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: Math.floor(evt.clientX - rect.left),
		y: Math.floor(evt.clientY - rect.top)
	};
}

let drawPoints = () => {
	context.strokeStyle = '#f5e342';
	context.fillStyle = 'black';
	for(let point of points){
		context.beginPath()
		// context.moveTo(point.x, point.y);
		context.arc(point.x-3, point.y-3, 6, 0, 2 * Math.PI);
		context.fill();
		context.stroke();
	}
}

canvas.addEventListener('mousemove', function (evt) {
	var mousePos = getMousePos(evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	actualizarCanvas(message);
}, false);

// Cuando se Haga click en el canvas guardar 
canvas.addEventListener('click', (event) => {
	let mousePos = getMousePos(event);
	points.push(point(mousePos.x, mousePos.y))
	drawPoints()
})

document.getElementById("showConnections").addEventListener("change", function(event){
	drawCon = this.checked;
})

// ////////////////
// BOTONES
// ///////////////

let reset = () => {
	points = []
	triangles = []
	connections = []
	actualizarCanvas()
}
let borrar = () => {
	points.pop()
	triangles = []
	connections = []
	generateMesh()
	actualizarCanvas()

}


function main(){
	actualizarCanvas("Pon el mouse encima del canvas para empezar")
	

}

window.onload = main
