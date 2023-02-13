
class Vehiculo {
  constructor(marca, modelo, anio, sumaAsegurada, tieneGas) {
    this.marca = marca;
    this.modelo = modelo;
    this.anio = anio;
    this.sumaAsegurada = sumaAsegurada;
    this.tieneGas = tieneGas;
  }

  obtenerRecargoAnio() {
    if (this.anio < 2010) {
      return 2;
    } else if (this.anio < 2012) {
      return 1.3;
    } else if (this.anio < 2016) {
      return 1.15;
    } else if (this.anio < 2020) {
      return 1.07;
    } else {
      return 1;
    }
  }

  obtenerRecargoGas() {
    if (this.tieneGas === true) {
      return 1.2;
    } else {
      return 1;
    }
  }

  obtenerTasa() {
    let vhEncontrado = listaMarcas.find(
      valor => valor.marca.toLowerCase() === this.marca.toLowerCase()
    );
    return vhEncontrado.tasa;
  }
}

const listaMarcas = [
  { marca: "Volkswagen", modelo: "Gol", tasa: 1.5 },
  { marca: "Volkswagen", modelo: "Polo", tasa: 1.5 },
  { marca: "Volkswagen", modelo: "Saveiro", tasa: 1.5 },
  { marca: "Volkswagen", modelo: "Amarok", tasa: 1.5 },
  { marca: "Fiat", modelo: "Argo", tasa: 2 },
  { marca: "Fiat", modelo: "Palio", tasa: 2 },
  { marca: "Fiat", modelo: "Cronos", tasa: 2 },
  { marca: "Fiat", modelo: "Punto", tasa: 2 },
  { marca: "Honda", modelo: "Fit", tasa: 0.8 },
  { marca: "Honda", modelo: "Civic", tasa: 0.8 },
  { marca: "Honda", modelo: "City", tasa: 0.8 },
  { marca: "Honda", modelo: "CRV", tasa: 0.8 },
  { marca: "Toyota", modelo: "Corolla", tasa: 1 },
  { marca: "Toyota", modelo: "Yaris", tasa: 1 },
  { marca: "Toyota", modelo: "Hilux", tasa: 1 },
  { marca: "Toyota", modelo: "Etios", tasa: 1 },
  { marca: "Toyota", modelo: "SW4", tasa: 1 },
  { marca: "Peugeot", modelo: "207", tasa: 2.5 },
  { marca: "Peugeot", modelo: "208", tasa: 2.5 },
  { marca: "Peugeot", modelo: "308", tasa: 2.5 },
  { marca: "Peugeot", modelo: "408", tasa: 2.5 },
];

const cantvehiculos = SolicitarDato();
if (cantvehiculos !== null) {
  cotizar(cantvehiculos);
}

function SolicitarDato() {
  let cantVehiculos = prompt(
    'Ingrese la cantidad de vehiculos a cotizar\nPara salir escriba: "SALIR" '
  );

  if (cantVehiculos.toLowerCase() === "salir") {
    return null;
  } else if (isNaN(parseInt(cantVehiculos))) {
    alert("Debe ingresar un valor numérico, vuelva a intentarlo");
    SolicitarDato();
  } else if (parseInt(cantVehiculos === 0)) {
    alert("Ingresó 0, vuelva a cargar la pagina para intentarlo");
    return null;
  } else {
    return parseInt(cantVehiculos);
  }
}


function cotizar(cant) {
  const listaCot = new Array(0);

  for (let i = 0; i < cant; i++) {
    let marcaVh = prompt(`Ingrese la marca del vehículo ${i + 1}`);
    let modeloVh;
    let tieneGasVh;
    let anioVh;
    let sumaVh;
    let tasaVh;

    let marcaEncontrada = listaMarcas.some(
      valor => valor.marca.toLowerCase() === marcaVh.toLowerCase()
    );
    if (marcaEncontrada === false) {
      let arraySoloMarcas = listaMarcas.map(valor => valor.marca);
      let marcasSinDuplicados = arraySoloMarcas.filter((item, index) => {
        return arraySoloMarcas.indexOf(item) === index;
      });

      let stringMarcas = "";
      marcasSinDuplicados.forEach(
        valor => (stringMarcas = `${stringMarcas}\n - ${valor}`)
      );

      alert(
        `No contamos con el seguro del vehiculo ingresado.\nFavor de ingresar una de las siguientes marcas ${stringMarcas}`
      );

      i = i - 1;
      continue;
    }

    modeloVh = prompt(`Ingrese el modelo del vehículo ${i + 1}`);
    let listaMarcaFiltada = listaMarcas.filter(valor => valor.marca.toLowerCase() === marcaVh.toLowerCase()); 
    let modeloEncontrado = listaMarcaFiltada.some(
      valor => valor.modelo.toLowerCase() === modeloVh.toLowerCase()
    );

    if(modeloEncontrado === false){
      let stringModelos = "";
      listaMarcaFiltada.forEach(
        valor => (stringModelos = `${stringModelos}\n - ${valor.modelo}`)
      );

      alert(
        `No contamos con el seguro del modelo ingresado.\nFavor de ingresar una de los siguientes modelos de la marca ${marcaVh}: ${stringModelos}`
      );

      i = i - 1;
      continue;
    }

    let tieneGas = prompt(
      `Responda Si o No.\n¿Suvehículo tiene Equipo de Gas?`
    );
    if (tieneGas.toLowerCase() !== "no" && tieneGas.toLowerCase() !== "si") {
      alert(`Debe ingresar Si o No.\nFavor de intentarlo nuevamente.`);
      i = i - 1;
      continue;
    } else if (tieneGas === "si") {
      tieneGasVh = true;
    } else if (tieneGas === "no") {
      tieneGasVh = false;
    }

    sumaVh = Number(prompt(`Ingrese el precio del vehículo ${i + 1}`));
    if (isNaN(sumaVh)) {
      alert("Debe ingresar un valor numérico. Intetelo nuevamente.");
      i = i - 1;
      continue;
    }

    anioVh = parseInt(prompt(`Ingrese el año del vehículo ${i + 1}`));
    if (isNaN(anioVh)) {
      alert("Debe ingresar un valor numérico. Intetelo nuevamente.");
      i = i - 1;
      continue;
    } else if (anioVh < 2000) {
      alert(
        `No aseguramos vehículos antesriores al año 2000.\nVuelva a cargar la página para internarlo`
      );
      continue;
    }

    let vehiculo = new Vehiculo(marcaVh, modeloVh, anioVh, sumaVh, tieneGasVh);
    let recargoAnio = vehiculo.obtenerRecargoAnio();
    let recargoGas = vehiculo.obtenerRecargoGas();
    tasaVh = vehiculo.obtenerTasa();
    let costoSeguro =
      ((vehiculo.sumaAsegurada * tasaVh) / 1000) * recargoAnio * recargoGas;

    listaCot.push({ vehiculo, costoSeguro });
  }

  if (listaCot.length > 0) {
    let stringCosto = "";
    listaCot.forEach(
      valor =>
        (stringCosto = `${stringCosto}\n - Vhc: ${valor.vehiculo.marca} ${
          valor.vehiculo.modelo
        } ${valor.vehiculo.anio} SA: $ ${
          valor.vehiculo.sumaAsegurada
        } --> Costo Mensual: $ ${Math.round(valor.costoSeguro)}`)
    );
    let costoTotal = 0;
    listaCot.forEach(valor => (costoTotal += Math.round(valor.costoSeguro)));

    alert(
      `El costo mensual del seguro es: $ ${costoTotal}\nCon los siguientes vehículos:\n${stringCosto}`
    );
  } else {
    alert("No se pudo cotizar con la informacion suministrada");
  }
}
