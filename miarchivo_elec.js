const listaBienes = [
  { tipoBien: "Notebook", tasa: 40 },
  { tipoBien: "Celular", tasa: 85 },
  { tipoBien: "Consola", tasa: 60 },
  { tipoBien: "Tablet", tasa: 65 }
];

const cantBienes = SolicitarDato();
if (cantBienes !== null){
  cotizar(cantBienes);
}


function SolicitarDato() {
  let cant = prompt('Ingrese la cantidad de equipos a cotizar\nPara salir escriba: "SALIR" ');

if(cant.toLowerCase() === "salir"){
  return null
}else if (isNaN(parseInt(cant))) {
    alert("Debe ingresar un valor numérico, vuelva a intentarlo");
    SolicitarDato();
  } else if (parseInt(cant === 0)) {
    alert("Ingresó 0, vuelva a cargar la pagina para intentarlo");
    return null;
  } else{
    return parseInt(cant);
  }
}

function cotizar(cant) {
  const listaCot = new Array(0);

  for (let i = 0; i < cant; i++) {
    let bien = prompt(`Ingrese la familia del equipo electrónico ${i + 1}`);
    let bienEncontrado = listaBienes.some(valor => valor.tipoBien.toLowerCase() === bien.toLowerCase())
    if(bienEncontrado === false){
      let stringMarcas = "";
      listaBienes.forEach(
        valor => (stringMarcas = `${stringMarcas}\n - ${valor.tipoBien}`)
      );

      alert(
        `No contamos con el seguro del equipo ingresado.\nFavor de ingresar una de las siguientes familias: ${stringMarcas}`
      );

      i = i - 1;
      continue;
    }
    let sumaBien;
    let tasaBien = obtenerTasa(bien);
    if (isNaN(tasaBien)) {
      alert("Por el momento no contamos con un costo para esta familia de equipos. Favor intentelo con una familia distinta.");
      i = i - 1;
      continue;
    } else {
      sumaBien = Number(prompt(`Ingrese el precio del equipo ${i + 1}`));
      if (isNaN(sumaBien)) {
        alert("Debe ingresar un valor numérico. Intetelo nuevamente.");
        i = i - 1;
        continue;
      }

      let costoSeguro = (sumaBien * tasaBien / 1000)/ 12
      listaCot.push({tipoBien: bien, suma: sumaBien, costo: costoSeguro});

    }
  }

if (listaCot.length >0){
  let stringCosto = ""
  listaCot.forEach(valor => stringCosto = `${stringCosto}\n - Equipo: ${valor.tipoBien} SA: $ ${valor.suma} --> Costo Mensual: $ ${Math.round(valor.costo)}`)
  let costoTotal =0;
  listaCot.forEach(valor => costoTotal+= Math.round(valor.costo));

  alert(`El costo mensual del seguro es: $ ${costoTotal}\nCon los siguientes equipos:\n${stringCosto}`)


}else{
  alert("No se pudo cotizar con la informacion suministrada")
}

}

function obtenerTasa(tipoBien) {
 let bien = listaBienes.find(valor => valor.tipoBien.toLowerCase() === tipoBien.toLowerCase())
 return bien.tasa
}