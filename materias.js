var readline = require('readline');
var fs = require('fs');
var materias = JSON.parse(fs.readFileSync("materias.json"));

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// INICIO DE PROGRAMA
//===================================
function init() {
    pregunta();
}

function pregunta() {
    rl.question(`Elige una opcion: \n
                1: Agrega Materia\n
                2: Busca Materia\n
                3: Regresa Materias Disponibles\n
                4: Regresa Materias Acreditadas\n
                exit: END PROGRAM\n
                =================\n`, function(opcion) {
        opciones(opcion);
    });
}

// SELECCION DE OPCIONES
//===================================
function opciones(op) {
    switch(op) {
        case '1':
            agregaMateria();
            break;
        case '3':
            materiasDisponibles();
            break;
        case '4':
            materiasAcreditadas();
            break;
        case 'exit':
            fs.writeFile('materias.json',JSON.stringify(materias));
            rl.close();
            console.log(materias);
            break;
    }
}

// AGREGAR UNA MATERIA
//===================================
function agregaMateria() {
    rl.question('( nombre : ',function(nombre) {
        rl.question('clave: ',function(clave) {
            rl.question('semestre: ',function(semestre) {
                if(Number.isInteger(parseInt(semestre))) {
                    rl.question('dependencias (claves de materias separadas por ","): ', function(dependencias) {
                        rl.question('status (AC, NC): ',function(status) { 
                            if(status.toUpperCase() == 'AC' || status.toUpperCase() == 'NC') {
                                if( status.toUpperCase() == 'AC'){
                                    rl.question('calificacion: ', function(calificacion) {
                                        addMateria(nombre, clave, semestre, dependencias, status, calificacion);
                                    })    
                                }else{
                                    addMateria(nombre, clave, semestre, dependencias, status, null);
                                }
                            }else {
                                console.log('ERROR: status '+ status + ' must be AC or NC');
                                return; 
                            }
                        })
                    })
                }else {
                    throw new Error('ERROR: semestre must be an integer');
                }
                
            })
        })
    });
}

function addMateria(nombre, clave, semestre, dependencias, status, calificacion) {
    var deps = {};

    dependencias = dependencias.split(',');

    if(dependencias[0]){
        for (var i = 0; i < dependencias.length; i++) {
            var dep = materias[dependencias[i]];
            // No existe esa dependencia
            if(!dep){
                throw new Error('ERROR: No existe la materia: ' + dependencias[i]);
            }
            var dependencia = {
                nombre: dep.nombre,
                clave: dep.clave,
                status: dep.status
            }
            deps[dependencias[i]] = dependencia; 
        }
    }
    if(clave in materias){
        throw new Error('ERROR: Materia repetida: ' + clave);
    }
    var mat = {
        nombre: nombre,
        clave: clave,
        semestre: semestre,
        calificacion: calificacion,
        status: status,
        dependencias: deps
    }
    materias[clave] = mat;
    console.log(`Se creo la materia \n  ${mat}\n ================ \n`);
    init();
}


// REGRESA MATERIAS DISPONIBLES
//===================================
function materiasAcreditadas() {
    var acreds = '';
    console.log('\n Materias ACREDITADAS \n ================= \n');
    for(mat in materias){
        if(materias[mat].status.toUpperCase() == 'AC'){
            console.log(materias[mat].nombre); 
        }
    }
    console.log('\n=====================\n');
    init();
}

// REGRESA MATERIAS ACREDITADAS
//===================================
function materiasDisponibles() {
    var acreds = '';
    console.log('\n Materias Disponibles \n ================= \n');
    for(mat in materias){
        if(materias[mat].status.toUpperCase() == 'NC'){
            var disp = true;
            for(dep in materias[mat].dependencias){
                if(materias[mat].dependencias[dep].status.toUpperCase() != 'AC'){
                    disp = false;
                    break;
                }
            }
            if(disp){
                console.log(materias[mat].nombre);
            } 
        }
    }
    console.log('\n=====================\n');
    init();
}

init();