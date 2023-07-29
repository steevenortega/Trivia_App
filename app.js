let puntaje = 0;
let indicePreguntaActual = 0;
let preguntas = [];
const contenedorQuiz = document.getElementById('contenedor-quiz');
const botonSiguiente = document.getElementById('siguiente-pregunta');
const botonNuevaTrivia = document.getElementById('nueva-trivia');
const mostrarPuntaje = document.getElementById('puntaje');

// Accediendo a los nuevos elementos
const seleccionCategoria = document.getElementById('categoria');
const seleccionDificultad = document.getElementById('dificultad');
const seleccionTipo = document.getElementById('tipo');

// Función para obtener preguntas de la API de OpenTDB
function obtenerPreguntas(cantidad = 10, categoria, dificultad, tipo) {
    fetch(`https://opentdb.com/api.php?amount=${cantidad}&category=${categoria}&difficulty=${dificultad}&type=${tipo}`)
        .then(response => response.json())
        .then(data => {
            preguntas = data.results;
            mostrarPregunta();
        });
}

// Función para mostrar una pregunta
function mostrarPregunta() {
    const preguntasAleatorias = [];
    const pregunta = preguntas[indicePreguntaActual];   
    console.log(pregunta.correct_answer);
    preguntasAleatorias.push(pregunta.correct_answer);    
    
    try{
        preguntasAleatorias.push(pregunta.incorrect_answers[0]);
        preguntasAleatorias.push(pregunta.incorrect_answers[1]);
        preguntasAleatorias.push(pregunta.incorrect_answers[2]);        
    }
    catch{
        console.log("No se pudo agregar pregunta incorrecta")
    }
    shuffleArray(preguntasAleatorias);
    console.log(preguntasAleatorias);
    contenedorQuiz.innerHTML = ` 
    <h2>${pregunta.question}</h2>
    <button type="button"  class="respuesta btn btn-primary btn-lg btn-block">${preguntasAleatorias[0]}</button>
    <button type="button"  class="respuesta btn btn-primary btn-lg btn-block">${preguntasAleatorias[1]}</button>
    <button type="button"  class="respuesta btn btn-primary btn-lg btn-block">${preguntasAleatorias[2]}</button>
    <button type="button"  class="respuesta btn btn-primary btn-lg btn-block">${preguntasAleatorias[3]}</button>`
    // Agregar listener de eventos a todos los botones de respuesta
    document.querySelectorAll('.respuesta').forEach(boton => {
    boton.addEventListener('click', seleccionarRespuesta);
    
})};



// Función para desordenar las preguntas de forma aleatoria
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

   



// Función para manejar la selección de respuestas
function seleccionarRespuesta(e) {
    const botonSeleccionado = e.target;
    const respuestaCorrecta = preguntas[indicePreguntaActual].correct_answer;

    // Verificar si la respuesta seleccionada es correcta
    if (botonSeleccionado.innerText === respuestaCorrecta) {
        puntaje += 100;
        mostrarPuntaje.innerText = `Puntaje: ${puntaje}`;
    }

    // Pasar a la siguiente pregunta
    indicePreguntaActual++;
    if (indicePreguntaActual < preguntas.length) {
        mostrarPregunta();
    } else {
        contenedorQuiz.innerHTML = '<h2>Has completado la trivia</h2>';
    }
}

// Función para iniciar una nueva trivia
function iniciarNuevaTrivia() {
    puntaje = 0;
    indicePreguntaActual = 0;
    mostrarPuntaje.innerText = `Puntaje: ${puntaje}`;
    // Obtener preguntas basadas en la selección del usuario
    obtenerPreguntas(
        10, 
        seleccionCategoria.value, 
        seleccionDificultad.value, 
        seleccionTipo.value
    );
}

botonSiguiente.addEventListener('click', mostrarPregunta);
botonNuevaTrivia.addEventListener('click', iniciarNuevaTrivia);

// Iniciar la primera trivia
obtenerPreguntas();