var arrayPateintsLenght = 10;
var patients = new Array(arrayPateintsLenght);
$('#table-range').html(arrayPateintsLenght);
$('#table-range-value').val(arrayPateintsLenght);

addPatient("Jan", "Nowak", "123456789");
addPatient("Anna", "Wesołek", "123789456");
addPatient("Tadeusz", "Wajha", "123123123");
addPatient("Arek", "Owczarek", "789789789");
addPatient("Marta", "Kijanka", "45678913");

reDrawTable();

function calculateIndex(pesel) {
    index = 0;
    pesel = pesel.toString();

    for(let i = 0; i < pesel.length; i++) {
        index += pesel[i] * i;
    }

    return index % patients.length;
}

function putToTable(patient) {
    patients[calculateIndex(patient.pesel)] = patient;
}

function findExistingIndex(pesel) {
    let index = calculateIndex(pesel);
    let newIndex = index;

   do {
        if(patients[newIndex] != undefined) {
            if(patients[newIndex].pesel == pesel) {
                return newIndex;
            } else {
                newIndex = (newIndex+ 1) % patients.length;
            }
        } else {
            return false;
        }
   } while (newIndex != index);

    return false;
}

function findDeletingIndex(pesel) {
    let index = calculateIndex(pesel);
    let newIndex = index;
    
   do {
        if(patients[newIndex] != undefined) {
            if(patients[newIndex].pesel == pesel) {
                return newIndex;
            } else {
                newIndex = (newIndex+ 1) % patients.length;
            }
        } else {
            newIndex = (newIndex+ 1) % patients.length;
        }
   } while (newIndex != index );

    return false;
}

function findEmptyIndex(pesel) {
    let index = calculateIndex(pesel);
    let newIndex = index;

   do {
        if(patients[newIndex] == undefined) {
            return newIndex;
        } else {
            if(patients[newIndex].pesel == pesel) {
                return false;
            }
            newIndex = (newIndex+ 1) % patients.length;
        }
   } while (newIndex != index);

    return false;
}

function reDrawTable() {

    $('#main-table-body').empty();

    for(let i = 0; i < patients.length; i++) {

        let patient = patients[i];
    
        $('#main-table-body').append(
            [
                '<tr id="'+ i +'">',
                    '<th scope="row">' + (i+1) + '</th>',
                    '<td>' + (patient == undefined ? '---' : patient.name) + '</td>',
                    '<td>' + (patient == undefined ? '---' : patient.surname) + '</td>',
                    '<td>' + (patient == undefined ? '---' : patient.pesel) + '</td>',
                '</tr>'
            ].join('\n')
        );
    }
}

function searchPatient(pesel) {

    reDrawTable();

    if(Number.isInteger(index = findExistingIndex(pesel))) {
        $('#' + index).css('background-color','green');
    } else {
        alert("Nie ma podanego rekordu w bazie !");
    }
}

function deletePatient(pesel) {

    if(Number.isInteger(index = findDeletingIndex(pesel))) {
        patients[index] = undefined;
    } else {
        alert("Nie ma podanego rekordu w bazie !");
    }
    reDrawTable();
    $('#' + index).css('background-color','red'); 
}

function addPatient(name, surname, pesel) {
    if(Number.isInteger(index = findEmptyIndex(pesel))) {
        patients[index] = new Patient(name, surname, pesel);
    } else {
        alert("Brak miejsca !");
    }

    reDrawTable();
    $('#' + index).css('background-color','green');
    showCalculations(pesel);
}

function showCalculations(pesel) {
    let valueStr = "";
    let value = 0;

    for(let i = 0; i < pesel.length ;i++) {
        if (i != (pesel.length -1)) {
            valueStr += i + " * " + '<span class=\"green\">' + pesel[i] + "</span> + ";
        }
        else {
            valueStr += i + " * " + '<span class=\"green\">' + pesel[i] + "</span> = ";
        }
        value += pesel[i] * i;
    }

    $('#hash-spec-calc').html([
        'PESEL: ' + '<span class=\"green\">'+ pesel + '</span><br>',
        valueStr + value + '<br>',
        'Indeks = ' + value + " % " + patients.length + " = " + value % patients.length
    ].join('\n'));
}

document.getElementById("table-range-value").oninput = function() {
    $('#table-range').html(this.value);

    let newArray = patients;
    patients = new Array(parseInt(this.value));

    newArray.forEach((patient) => {
        if(patient != undefined) {
            addPatient(patient.name, patient.surname, patient.pesel);
        }
    });

    reDrawTable();
}