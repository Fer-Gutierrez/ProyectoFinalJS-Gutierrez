//CLASES
class Vehiculo {
  constructor(marca, modelo, anio, sumaAsegurada, tieneGas) {
    this.marca = marca;
    this.modelo = modelo;
    this.anio = anio;
    this.sumaAsegurada = sumaAsegurada;
    this.tieneGas = tieneGas;
  }

  obtenerRecargoAnio() {
    return this.anio < 2010? 1.5: this.anio < 2012? 1.3: this.anio < 2016? 1.15: this.anio < 2020? 1.07: 1;
  }
  obtenerRecargoGas() {
    return this.tieneGas ? 1.2 : 1;
  }
}

//FETCHS
const listaPlanes = fetch(`./json/listaPlanesAutomotores.json`)
  .then(response => response.json())
  .catch(error => {
    console.error(error);
    alertaError("No fue posible consultar la lista de planes")
  });

const listaCoberturas = fetch(`./json/listaCoberturasAutomotores.json`)
  .then(response => response.json())
  .catch(error => {
    console.error(error);
    alertaError("No fue posible consultar la lista de coberturas")
  })

//FUNCIONES
async function obtenerMarcas() {
  try {
    let response = await fetch("https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json");
    let data = await response.json();
    selectMarca.innerHTML = `<option selected="true" disabled="disabled" value="-1">Seleccione una marca</option>`;
    selectModelo.innerHTML = `<option selected="true" disabled="disabled" value="-1">Seleccione una marca</option>`;
    data.Results.sort((a,b)=>{
      return (a.MakeName < b.MakeName)? -1:(a.MakeName > b.MakeName)? 1:0
    });
    let marcasMinusculas = data.Results.map(valor=> {
      let minusculas = valor.MakeName.toLowerCase();
      let primeraMayusculas = minusculas[0].toUpperCase() + minusculas.substring(1);
      return {MakeId: valor.MakeId, MakeName: primeraMayusculas };
    })
    marcasMinusculas.forEach(marca => {
      selectMarca.innerHTML += `<option value="${marca.MakeId}">${marca.MakeName}</option>`;
    });
  } catch (error) {
    console.log(error);
    alertaError(`No fue posible obtener marcas: ${error}`);
  }
}
async function obtenerModelos(id, marca, anio) {
  try {
    if (anio !== "" && id !=="-1") {
      let response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${id}/modelyear/${anio}?format=json`);
      let data = await response.json();
      selectModelo.innerHTML = `<option selected="true" disabled="disabled" value="-1">Seleccione un modelo</option>`;
      if(data.Results.length >0){
        data.Results.forEach(valor => {
          selectModelo.innerHTML += `<option value="${valor.Model_ID}">${valor.Model_Name}</option>`;
        });
      }else{
        alertaInformativa(`No existen modelos de la marca ${marca} para el año ${anio}.`)
        inputAnio.value = "";
        selectModelo.innerHTML = `<option selected="true" disabled="disabled" value="-1">Seleccione un año</option>`;
      }
    }else if(anio === ""){
      selectModelo.innerHTML = `<option selected="true" disabled="disabled" value="-1">Seleccione el año</option>`;
    }else if(id === "-1"){
      selectModelo.innerHTML = `<option selected="true" disabled="disabled" value="-1">Seleccione una marca</option>`;
    }
  } catch (error) {
    console.log(error);
    alertaError(`No fue posible obtener modelos: ${error}`);
  }
}
function verificarAnio(){
  if (isNaN(inputAnio.value) || inputAnio.value.length != 4){
    alertaInformativa("El año debe ser numérico con 4 caractéres");
    inputAnio.value = ""
    return false
  }else if(inputAnio.value < 1998){
    alertaInformativa("No es posible cotizar vehículos anteriores al año 1998");
    inputAnio.value = 1998  
    return false
  };
  return true
}

// SELECTS e INPUTS
const selectMarca = document.querySelector("#marcaVh");
const selectModelo = document.querySelector("#modeloVh");
const selectGas = document.querySelector("#tieneGas");
const inputAnio = document.querySelector("#anioVh");
const inputSumaVh = document.querySelector("#sumaVh");

obtenerMarcas();
selectMarca.addEventListener("change", () =>
  obtenerModelos(
    selectMarca.options[selectMarca.selectedIndex].value,
    selectMarca.options[selectMarca.selectedIndex].text,
    inputAnio.value
  )
);

inputAnio.addEventListener("change", () =>{
  if(verificarAnio()){
    obtenerModelos(selectMarca.options[selectMarca.selectedIndex].value,
      selectMarca.options[selectMarca.selectedIndex].text,
      inputAnio.value
    )};
  }
);

inputSumaVh.addEventListener("click", () => inputSumaVh.select());
inputSumaVh.addEventListener("change", cambiarFormatoSumaVh);
function cambiarFormatoSumaVh() {
  let valor = quitarFormatoMoneda(inputSumaVh.value);
  if (isNaN(valor) || valor <= 0) {
    inputSumaVh.value = "";
    alertaInformativa("Suma asegurada deben ser numeros enteros positivos");
  } else {
    inputSumaVh.value = formatoMoneda(Math.ceil(valor));
  }
}

//SUBMIT COTIZAR
const formCotizar = document.querySelector("#form-cotizar");
formCotizar.addEventListener("submit", cotizar);
function cotizar(e) {
  e.preventDefault();
  let marcaVh = selectMarca.options[selectMarca.selectedIndex].text;
  let modeloVh = selectModelo.options[selectModelo.selectedIndex].text;
  let sumaVh = quitarFormatoMoneda(inputSumaVh.value);
  let anioVh = Number(inputAnio.value);
  let tieneGasVh = selectGas.options[selectGas.selectedIndex].text.toLowerCase() === "si"? true : false;

  if (isNaN(sumaVh) || isNaN(anioVh)) {
    alertaInformativa("No es posible cotizar. Suma Asegurada y Año ingresados deben ser numéricos");
  } else if(selectMarca.options[selectMarca.selectedIndex].value === "-1" || selectModelo.options[selectModelo.selectedIndex].value === "-1"){
    alertaInformativa("Debe seleccionar una marca y modelo para cotizar.")
  } else {
    //Costo Seguro:
    let vehiculo = new Vehiculo(marcaVh, modeloVh, anioVh, sumaVh, tieneGasVh);
    let recargoAnio = vehiculo.obtenerRecargoAnio();
    let recargoGas = vehiculo.obtenerRecargoGas();
    let tasaVh = 2.2;
    let costoSeguro =((vehiculo.sumaAsegurada * tasaVh) / 1000) * recargoAnio * recargoGas;

    /** RENDERIZAR **/
    //Div
    let div = document.querySelector("#cotizacion");
    if (div != null) {
      div.remove();
    }
    div = document.createElement("div");
    div.id = "cotizacion";
    div.className = "informacion";

    //SubtituloDiv
    let tituloDiv = document.createElement("h2");
    tituloDiv.className = "subtitulo animate__animated animate__slideInDown";
    tituloDiv.innerText = "Planes Disponibles";
    div.append(tituloDiv);

    //ParrafoDiv
    let parrafo = document.createElement("p");
    if (tieneGasVh === false) {
      parrafo.innerText = `Cotización para un ${marcaVh} ${modeloVh} ${anioVh} de ${formatoMoneda(
        sumaVh
      )} sin Equipo de Gas:`;
    } else {
      parrafo.innerText = `Cotización para un ${marcaVh} ${modeloVh} ${anioVh} de ${formatoMoneda(
        sumaVh
      )} con Equipo de Gas:`;
    }
    div.append(parrafo);

    //DivTabla
    let divTabla = document.createElement("div");
    divTabla.className = "table-responsive";

    //Tabla
    let tabla = document.createElement("table");
    tabla.id = "tabla-costo";
    tabla.className = "table scale-in-center";

    //EncabezadoTabla
    let encabezadoTabla = document.createElement("thead");
    let filaEncabezado = document.createElement("tr");
    filaEncabezado.innerHTML = `<th scope="col">Coberturas</th>`;
    listaPlanes.then(data =>{
      data.forEach(
        plan =>
          (filaEncabezado.innerHTML += `<th scope="col">${plan.nombre}</th>`)
      );
    })
    .catch(error => {
      console.error(error);
      alertaError(`Imposible rellnar encabezado con planes: ${error}`);
    });
    encabezadoTabla.append(filaEncabezado);
    tabla.append(encabezadoTabla);

    //CuerpoTabla
    let cuerpoTabla = document.createElement("tbody");
    cuerpoTabla.className = "table-group-divider";
    listaCoberturas.then(data =>{
      data.forEach(cobertura => {
        let fila = document.createElement("tr");
        let columnaCob = document.createElement("td");
        columnaCob.innerText = cobertura.cobertura;
        fila.append(columnaCob);
  
        listaPlanes.then(data =>{
          data.forEach(plan => {
            let colummaPlan = document.createElement("td");
            let planEncontrado = cobertura.planes.some(valor => valor === plan.id);
            if (planEncontrado) {
              colummaPlan.innerHTML = `<i class="icon-check">`;
            } else {
              colummaPlan.innerHTML = `<i class="icon-x">`;
            }
            fila.append(colummaPlan);
          });
        })
        .catch(error => {
          console.error(error);
          alertaError(`Imposible rellnar coberturas con planes: ${error}`);
        });

        cuerpoTabla.append(fila);
      });

      //Fila Costo:
      let filaCosto = document.createElement("tr");
      filaCosto.className = "fila-costo";
      filaCosto.innerHTML = `<td>Costo</td>`;

      //Fila Boton Contratar:
      let filaBoton = document.createElement("tr");
      filaBoton.className = "fila-boton";
      filaBoton.innerHTML = "<td></td>";

      //Rellenado de filaCosto y filaBoton
      listaPlanes.then(data=>{
        data.forEach(plan => {
          filaCosto.innerHTML += `<td>${formatoMoneda(
            Math.ceil(costoSeguro * plan.factorRecargo)
          )}</td>`;
          filaBoton.innerHTML += `<td><button id="btnContratar${plan.id}">Contratar</button></td>`;
        });
      })
      .catch(error => {
        console.error(error);
        alertaError(`Imposible rellnar fila costo y fila boton: ${error}`);
      });

      //Agregamos elementos al HTML
      cuerpoTabla.append(filaCosto);
      cuerpoTabla.append(filaBoton);
      tabla.append(cuerpoTabla);
      divTabla.append(tabla);
      div.append(divTabla);
      const seccionCotizador = document.querySelector("#cotizador");
      seccionCotizador.append(div);
      formCotizar.reset();
      selectModelo.innerHTML = `<option selected="true" disabled="disabled" value="-1">Seleccione una marca</option>`

      //AgregadO Evento a Boton Contratar
      listaPlanes.then(data =>{
        data.forEach(plan => {
          let boton = document.querySelector(`#btnContratar${plan.id}`);
          boton.addEventListener("click", () =>
            agregarCotizacion(plan.id, plan.nombre, plan.factorRecargo)
          );
        });
      })
      .catch(error => {
        console.error(error);
        alertaError(`Imposible agregar evento al boton contratar: ${error}`);
      });

       //ViewPort hacia Seccion Planes
      let positionDivCotizacion = div.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + positionDivCotizacion.top - 50);
    })
    .catch(error => {
      console.error(error);
      alertaError(`Imposible renderizar cuerpo de tabla: ${error}`);
    });
    
    function agregarCotizacion(idPlan, nombrePlan, recargoPlan) {
      let cotizacion = new Cotizacion(
        "automotores",
        idPlan,
        nombrePlan,
        vehiculo,
        Math.ceil(costoSeguro * recargoPlan)
      );
      cotizacion.agregarLS();
    }   
  }
}