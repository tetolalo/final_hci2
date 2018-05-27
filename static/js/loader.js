//ArrayList Donde se guardan las preguntas para recomendacion
var pollQuestionsProcesed = [];
var kQuestionsProcesed = [];
var correctas = 0;
var malas = 0;

$(document).ready(function () {
    //Gets the RAW JSON
    $.getJSON('https://recomendacionpresidencial.firebaseapp.com/getDatabase', function (data) {

        var pollQuestionData = [];
        //Gets the key entries from the raw json
        pollQuestionData = Object.entries(data);
        //console.log(pollQuestionData);
        for (var i = pollQuestionData.length - 1; i >= 0; i--) {
            //Gets the iteated object from the entries array 
            tempContainer = pollQuestionData[i];
            //Gets the second object from the itrated object ( the second one has the information)
            tempData = tempContainer[1];
            //Inserts the object into the array
            pollQuestionsProcesed.push({
                pregunta: tempData.pregunta,
                vargas: tempData.vargas,
                calle: tempData.calle,
                fajardo: tempData.fajardo,
                petro: tempData.petro,
                duque: tempData.duque,
                tema: tempData.tema
            });
        }
        //console.log(pollQuestionsProcesed);
        addToDom();
    });

    $.getJSON('https://recomendacionpresidencial.firebaseapp.com/getKq', function (data) {
        var KQuestionData = [];
        //Gets the key entries from the raw json
        KQuestionData = Object.entries(data);

        //console.log(KQuestionData);
        for (var i = KQuestionData.length - 1; i >= 0; i--) {
            //Gets the iterated object from the entries array
            tempContainer = KQuestionData[i];
            //Gets the second object from the itrated object ( the second one has the information)
            tempData = tempContainer[1];
            //Inserts the object into the array
            kQuestionsProcesed.push({
                cultural: tempData.pregunta,
                uno: tempData.uno,
                dos: tempData.dos,
                tres: tempData.tres,
                cuatro: tempData.cuatro,
                correcta: tempData.correcta,
            });
        }
        console.log(kQuestionsProcesed);
        addToCultural();
    });
});

//Method that add the poll question arrays to the dom (Solo es a modo de ejemplo pues ya teniendo el array de preguntas deben aplicar su propia logica)
addToDom = function () {
    /*console.log("Callme");
    console.log("Array length: ", pollQuestionsProcesed.length);*/
    for (var i = pollQuestionsProcesed.length - 1; i >= 0; i--) {

        //console.log("Position: ", i);
        var pregunta = pollQuestionsProcesed[i].pregunta;
        var vargas = pollQuestionsProcesed[i].vargas;
        var calle = pollQuestionsProcesed[i].calle;
        var fajardo = pollQuestionsProcesed[i].fajardo;
        var petro = pollQuestionsProcesed[i].petro;
        var duque = pollQuestionsProcesed[i].duque;
        var tema = pollQuestionsProcesed[i].tema;

        preguntasTema[i] = pollQuestionsProcesed[i].tema;

        afinidadFajardo.push(fajardo);
        afinidadCalle.push(calle);
        afinidadDuque.push(duque);
        afinidadLleras.push(vargas);
        afinidadPetro.push(petro);

        var seccion_pregunta = document.createElement('div');
        seccion_pregunta.className = 'pregunta';
        seccion_pregunta.innerHTML = `
        <div class= "preguntas-container">
            <h1>${'Tema: ' + tema}</h1> 
            <p>${'<b>Pregunta</b>: ' + pregunta}</p>     
        </div> 
        <div class= "buttons-container">
            <button class= "disagree">Desacuerdo</button> 
            <button class= "agree">De acuerdo</button>
        </div>
        `;

        //El innerHtml remplaza lo que tenga previamente el elemento (body para este caso), por ende solo veran la lista de los ultimos del ciclo. Para hacer buen uso de eso les recomiendo utilizar los appends y no innerHtml, pero ya es el gusto de cada quien.
        document.getElementById("wrapper").appendChild(seccion_pregunta);
    }

    preguntasTema.reverse();

    document.querySelectorAll('.buttons-container').forEach(((btn, index) => {
        var disagree = btn.querySelector('.disagree');
        disagree.addEventListener('click', () => {
            sumarD(index, preguntasTema[index]);
        });

        var agree = btn.querySelector('.agree');
        agree.addEventListener('click', () => {
            sumarA(index, preguntasTema[index]);
        });
    }));

    hacerSumatorias();

    var seccion_resultado = document.createElement('section');
    seccion_resultado.className = 'resultado-candidato';
    seccion_resultado.innerHTML = `
    <div class= "resultado-container">
        <button class= "resultado">Resultado</button>
    </div>
    `;

    document.getElementById("wrapper").appendChild(seccion_resultado);

    var resultado = document.querySelector('.resultado');
    resultado.addEventListener('click', () => {
        evaluacionAfinidad();

        var textoR = document.createElement('h1');
        textoR.innerHTML = `${recomendacion[0].nombreC}`;
        seccion_resultado.appendChild(textoR);
    });

}

addToCultural = function () {
    for (var i = kQuestionsProcesed.length - 1; i >= 0; i--) {

        var cultural = kQuestionsProcesed[i].cultural;
        var uno = kQuestionsProcesed[i].uno;
        var dos = kQuestionsProcesed[i].dos;
        var tres = kQuestionsProcesed[i].tres;
        var cuatro = kQuestionsProcesed[i].cuatro;
        var correcta = kQuestionsProcesed[i].correcta;

        console.log(uno);

        var seccion_preguntaCultura = document.createElement('div');
        seccion_preguntaCultura.className = 'preguntaCultura';
        seccion_preguntaCultura.innerHTML = `
    <div class= "cultura-container">
        <ul>
            <li>${'<b>Pregunta</b>: ' + cultural}</li> 
        </ul>
        <form id="quiz">
            <input type = "radio" value="${uno}"></input>
            <label>"${uno}"</label><br>
            <input type = "radio" value="${dos}"></input>
            <label>"${dos}"</label><br>
            <input type = "radio" value="${tres}"></input>
            <label>"${tres}"</label><br>
            <input type = "radio" value="${cuatro}"></input>
            <label>"${cuatro}"</label>
        </form>
    </div>
    `;

        document.getElementById("formulario-cultura").appendChild(seccion_preguntaCultura);
    }
    //evaluarCulturales();
}
/*
>>>>>>>>>>>>> ESTÁ FUNCION ES PARA QUE QUE HAGAS LA COMPARACIÓN ENTRE LA RESPUESTA SELECCIONADA DEL USUARIO Y LA RESPUESTA CORRECTA DEL DB
pues me falta un btn de submit que es donde se va a hacer todode l event listener
function evaluarCulturales() {
    for (var i = kQuestionsProcesed.length - 1; i >= 0; i--) {
        if (kQuestionsProcesed[i].correcta.trim() === respuesta del usuario del form.trim()) {
            correctas ++;
        } else {
            malas ++;
        }
    }
}*/