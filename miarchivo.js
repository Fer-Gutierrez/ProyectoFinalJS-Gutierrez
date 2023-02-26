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

const listaModelos = [
  { id: 1, marca: "Volkswagen", modelo: "Gol", tasaBasica: 1.2 },
  { id: 2, marca: "Volkswagen", modelo: "Polo", tasaBasica: 1.2 },
  { id: 3, marca: "Volkswagen", modelo: "Saveiro", tasaBasica: 1.2 },
  { id: 4, marca: "Volkswagen", modelo: "Amarok", tasaBasica: 12 },
  { id: 5, marca: "Fiat", modelo: "Argo", tasaBasica: 1.4 },
  { id: 6, marca: "Fiat", modelo: "Palio", tasaBasica: 1.4 },
  { id: 7, marca: "Fiat", modelo: "Cronos", tasaBasica: 1.4 },
  { id: 8, marca: "Fiat", modelo: "Punto", tasaBasica: 1.4 },
  { id: 9, marca: "Honda", modelo: "Fit", tasaBasica: 0.8 },
  { id: 10, marca: "Honda", modelo: "Civic", tasaBasica: 0.8 },
  { id: 11, marca: "Honda", modelo: "City", tasaBasica: 0.8 },
  { id: 12, marca: "Honda", modelo: "CRV", tasaBasica: 0.8 },
  { id: 13, marca: "Toyota", modelo: "Corolla", tasaBasica: 1 },
  { id: 14, marca: "Toyota", modelo: "Yaris", tasaBasica: 1 },
  { id: 15, marca: "Toyota", modelo: "Hilux", tasaBasica: 1 },
  { id: 16, marca: "Toyota", modelo: "Etios", tasaBasica: 1 },
  { id: 17, marca: "Toyota", modelo: "SW4", tasaBasica: 1 },
  { id: 18, marca: "Peugeot", modelo: "207", tasaBasica: 1.5 },
  { id: 19, marca: "Peugeot", modelo: "208", tasaBasica: 1.5 },
  { id: 20, marca: "Peugeot", modelo: "308", tasaBasica: 1.5 },
  { id: 21, marca: "Peugeot", modelo: "408", tasaBasica: 1.5 },
];

const listaPlanes= [
  {id:1 ,nombre: "Tercero Basico", factorRecargo:1},
  {id:2 ,nombre: "Tercero Completo", factorRecargo:1.1},
  {id:3 ,nombre: "Todo Riesgo", factorRecargo:1.2}
];

const listaCoberturas = [
  {id: 1, cobertura:"RC contra terceros Parcial y Total", planes:[1,2,3]},
  {id: 2, cobertura:"Servicios de Grúa las 24 hs", planes:[1,2,3]},
  {id: 3, cobertura:"Incendio Total", planes:[1,2,3]},
  {id: 4, cobertura:"Incendio Parcial", planes:[2,3]},
  {id: 5, cobertura:"Robo Total", planes:[1,2,3]},
  {id: 6, cobertura:"Robo Parcial", planes:[2,3]},
  {id: 7, cobertura:"Accidente Total", planes:[3]},
  {id: 8, cobertura:"Cristales Parcial y Total", planes:[2,3]},
  {id: 9, cobertura:"Granizo Parcial y Total", planes:[2,3]},
  {id: 10, cobertura:"Parabrisas Parcial y Total", planes:[2,3]},
  {id: 11, cobertura:"Rotura de Cerraduras Sin Límite y Sin Deducible", planes:[3]},
  {id: 12, cobertura:"Accidentes Personales", planes:[3]},
  {id: 13, cobertura:"Extensión de Cobertura a Países Limítrofes", planes:[1,2,3]},
];


//GENERO LA LISTA DE MARCAS SIN DUPLICADOS
let marcas = listaModelos.map(valor => valor.marca);
const listaMarcas = marcas.filter((item, index) => {
  return marcas.indexOf(item) === index;
});

// ACTUALIZO CB VEHICULOS
const selectMarca = document.querySelector("#marcaVh");
selectMarca.innerHTML = `<option selected="true" disabled="disabled">Seleccione una marca</option>`;
for (vehiculo of listaMarcas) {
  selectMarca.innerHTML += `<option value="${vehiculo.index}">${vehiculo}</option>`;
}

// ACTUALIZO CB MODELOS
const selectModelo = document.querySelector("#modeloVh");
selectModelo.innerHTML = `<option selected="true" disabled="disabled">Seleccione una marca</option>`;
selectMarca.addEventListener("change", actualizarSelectModelo);

function actualizarSelectModelo() {
  let marcaSeleccionada = selectMarca.options[selectMarca.selectedIndex].text;
  selectModelo.innerHTML = `<option selected="true" disabled="disabled">Seleccione un modelo</option>`;
  let listaModelosFiltrados = listaModelos.filter(
    valor => valor.marca.toLowerCase() === marcaSeleccionada.toLowerCase()
  );
  for (modelo of listaModelosFiltrados) {
    selectModelo.innerHTML += `<option value="${modelo.index}">${modelo.modelo}</option>`;
  }
}

let btnCotizar = document.querySelector("#btn-cotizar");
btnCotizar.addEventListener("submit",cotizar)


//SUMAVH
function formatoMoneda(valor){
  const formatter = new  Intl.NumberFormat('es-AR',{
    style: 'currency',
    minimumFractionDigits: 0,
    currency: 'ars'  
  })
  return formatter.format(valor)
}

let inputSumaVh = document.querySelector("#sumaVh")
inputSumaVh.addEventListener("click", () =>{
  inputSumaVh.select()
})
inputSumaVh.addEventListener("change",cambiarFormatoSumaVh)
function cambiarFormatoSumaVh(){
  let valor = inputSumaVh.value
  if(isNaN(valor)){
    valor = valor.replace(/[a-zA-Z .,$]/g,"")
  }
  inputSumaVh.value = formatoMoneda(Math.ceil(valor))
};
function quitarFormato(valor){
  if(isNaN(valor)){
    valor = valor.replace(/[a-zA-Z ,.$]/g,"")
  }
  return Number(valor.trim())
}

//SUBMIT COTIZAR
formCotizar = document.querySelector("#form-cotizar")
formCotizar.addEventListener("submit",cotizar)

function cotizar(e) {
  e.preventDefault();
  let sumaVh = quitarFormato(inputSumaVh.value);
  let anioVh = Number(document.querySelector("#anioVh").value);


  

  if(isNaN(sumaVh) || isNaN(anioVh)){
    alert("No es posible cotizar ya que los valores de Suma Asegurada y Año ingresados no son numéricos")
  }else{
    //MOSTRAMOS UN NUEVO DIV CON LAS COBERTURAS Y PLANES DISPONIBLES
  }
 

    let vehiculo = new Vehiculo(marcaVh, modeloVh, anioVh, sumaVh, tieneGasVh);
    let recargoAnio = vehiculo.obtenerRecargoAnio();
    let recargoGas = vehiculo.obtenerRecargoGas();
    tasaVh = vehiculo.obtenerTasa();
    let costoSeguro =
      ((vehiculo.sumaAsegurada * tasaVh) / 1000) * recargoAnio * recargoGas;

    listaCot.push({ vehiculo, costoSeguro });
  

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
