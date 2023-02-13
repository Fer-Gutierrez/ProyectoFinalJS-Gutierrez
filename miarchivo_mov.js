const listaMarcas = [
  { marca: "SLP", tasa: 65 },
  { marca: "Venzo", tasa: 65 },
  { marca: "Giant", tasa: 65 },
  { marca: "Delma", tasa: 65 },
];

const cantMovilidad = SolicitarDato();
if (cantMovilidad !== null) {
  cotizar(cantMovilidad);
}

function SolicitarDato() {
  let cant = prompt(
    'Ingrese la cantidad de medios de movilidad a cotizar\nPara salir escriba: "SALIR" '
  );

  if (cant.toLowerCase() === "salir") {
    return null;
  } else if (isNaN(parseInt(cant))) {
    alert("Debe ingresar un valor numérico, vuelva a intentarlo");
    SolicitarDato();
  } else if (parseInt(cant === 0)) {
    alert("Ingresó 0, vuelva a cargar la pagina para intentarlo");
    return null;
  } else {
    return parseInt(cant);
  }
}

function cotizar(cant) {
  const listaCot = new Array(0);

  for (let i = 0; i < cant; i++) {
    let marcaMov = prompt(`Ingrese la marca del medio de movilidad ${i + 1}`);
    let movEncontrada = listaMarcas.some(valor => valor.marca.toLowerCase() === marcaMov.toLowerCase());
    if(movEncontrada === false){
      let stringMarcas = "";
      listaMarcas.forEach(
        valor => (stringMarcas = `${stringMarcas}\n - ${valor.marca}`)
      );

      alert(
        `No contamos con el seguro del medio de movilidad ingresado.\nFavor de ingresar una de las siguientes marcas ${stringMarcas}`
      );

      i = i - 1;
      continue
    }

    let sumaMov;
    let tasaMov = obtenerTasa(marcaMov);
    if (isNaN(tasaMov)) {
      alert("Por el momento no contamos con un costo para esta marca. Favor intentelo con una marca distinta.");
      i = i - 1;
        continue;
    } else {
      sumaMov = Number(
        prompt(`Ingrese el precio de su medio de movilidad ${i + 1}`)
      );
      if (isNaN(sumaMov)) {
        alert("Debe ingresar un valor numérico. Intetelo nuevamente.");
        i = i - 1;
        continue;
      }

      let costoSeguro = (sumaMov * tasaMov) / 1000 / 12;

      listaCot.push({ marca: marcaMov, suma: sumaMov, costo: costoSeguro });
    }
  }

  if (listaCot.length > 0) {
    let stringCosto = "";
    listaCot.forEach(
      valor =>
        (stringCosto = `${stringCosto}\n - Mov: ${valor.marca} SA: $ ${
          valor.suma
        } --> Costo Mensual: $ ${Math.round(valor.costo)}`)
    );
    let costoTotal = 0;
    listaCot.forEach(valor => (costoTotal += Math.round(valor.costo)));

    alert(
      `El costo mensual del seguro es: $ ${costoTotal}\nCon los siguientes medios de movilidad:\n${stringCosto}`
    );
  } else {
    alert("No se pudo cotizar con la informacion suministrada");
  }
}

function obtenerTasa(marca) {
 let mov = listaMarcas.find(valor => valor.marca.toLowerCase() === marca.toLowerCase());
 return mov.tasa;
}
