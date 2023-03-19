//CLASES
class Electronica {
  constructor(familiaEq, marcaEq, modeloEq, sumaAsegurada) {
    this.familiaEq = familiaEq, 
    this.marcaEq = marcaEq,
    this.modeloEq = modeloEq,
    this.sumaAsegurada = sumaAsegurada
  }

  async obtenerTasa() {
    let tasa = await listaFamiliasEquipos
      .then(data => {
      let familiaEncontrada = data.find(valor => valor.familiaEq.toLowerCase() === this.familiaEq.toLowerCase())
      return familiaEncontrada.tasaBasica
      })
      .catch(error => {
        console.error(error);
        alertaError(`No fue posible obtener tasa: ${error}}`)
      })
    
    return tasa;
  }
}

//FETCHS
const listaFamiliasEquipos = fetch(`./json/listaFamiliasEquipos.json`)
  .then(response => response.json())
  .catch(error => {
    console.error(error);
    alertaError(`No fue posible obtener familias de equipos: ${error}}`)
  })

const listaPlanesElectronica = fetch(`./json/listaPlanesElectronica.json`)
  .then(response => response.json())
  .catch(error => {
    console.error(error);
    alertaError(`No fue posible obtener planes de electronica: ${error}}`)
  })

  const listaCoberturasElectronica = fetch(`./json/listaCoberturasElectronica.json`)
    .then(response => response.json())
    .catch(error => {
      console.error(error);
      alertaError(`No fue posible obtener coberturas de electronica: ${error}}`)
    })

//SELECT FAMILIA
const selectFamilia = document.querySelector("#familiaEq");
selectFamilia.innerHTML = `<option selected="true" disabled="disabled">Seleccione un tipo</option>`;
listaFamiliasEquipos.then(data =>{
  data.forEach(familia => selectFamilia.innerHTML += `<option value="${familia.id}">${familia.familiaEq}</option>`)
})
.catch(error => {
  console.error(error);
  alertaError(`No fue posible completar el select con las familias de equipos: ${error}}`)
})

//SELECT SUMA
const inputSumaEq = document.querySelector("#sumaEq");
inputSumaEq.addEventListener("click", () => inputSumaEq.select());
inputSumaEq.addEventListener("change", cambiarFormatoSuma);
function cambiarFormatoSuma() {
  let valor = quitarFormatoMoneda(inputSumaEq.value);
  if (isNaN(valor) || valor <= 0) {
    inputSumaEq.value = "";
    alertaInformativa("Suma asegurada deben ser numeros enteros positivos");
  } else {
    inputSumaEq.value = formatoMoneda(Math.ceil(valor));
  }
}

//SELECT MARCA
const inputMarcaEq = document.querySelector("#marcaEq");
//SELECT MODELO
const inputModeloEq = document.querySelector("#modeloEq");

//SUBMIT COTIZAR
const formCotizar = document.querySelector("#form-cotizar");
formCotizar.addEventListener("submit", cotizar);
async function cotizar(e) {
  e.preventDefault();
  let familaEq = selectFamilia.options[selectFamilia.selectedIndex].text;
  let marcaEq = inputMarcaEq.value;
  let modeloEq = inputModeloEq.value;
  let sumaEq = quitarFormatoMoneda(inputSumaEq.value);

  if (isNaN(sumaEq)) {
    alertaInformativa("No es posible cotizar. Suma Asegurada deben ser numérica");
  } else {
    //Cotizamos
    let electronico = new Electronica(familaEq, marcaEq, modeloEq, sumaEq);
    let tasa = await electronico.obtenerTasa();
    let costoSeguro = (sumaEq * tasa) / 1000;

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
    parrafo.innerText = `Cotización para ${familaEq} ${marcaEq} ${modeloEq} de ${formatoMoneda(sumaEq)}:`;
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
    listaPlanesElectronica.then(data =>{
      data.forEach(
        plan =>
          (filaEncabezado.innerHTML += `<th scope="col">${plan.nombre}</th>`)
      );
    })
    .catch(error => {
      console.error(error);
      alertaError(`No fue posible completar el encabezado de taba con los planes: ${error}}`)
    })
    encabezadoTabla.append(filaEncabezado);
    tabla.append(encabezadoTabla);

    //CuerpoTabla
    let cuerpoTabla = document.createElement("tbody");
    cuerpoTabla.className = "table-group-divider";

    listaCoberturasElectronica.then(data =>{
      data.forEach(cobertura => {
        let fila = document.createElement("tr");
        let columnaCob = document.createElement("td");
        columnaCob.innerText = cobertura.cobertura;
        fila.append(columnaCob);
  
        listaPlanesElectronica.then(data =>{
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
          alertaError(`No fue posible completar las coberturas con los planes: ${error}}`)
        })
        
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
      listaPlanesElectronica.then(data =>{
        data.forEach(plan => {
          filaCosto.innerHTML += `<td>${formatoMoneda(
            Math.ceil(costoSeguro * plan.factorRecargo)
          )}</td>`;
          filaBoton.innerHTML += `<td><button id="btnContratar${plan.id}">Contratar</button></td>`;
        });
      })
      .catch(error => {
        console.error(error);
        alertaError(`No fue posible completar la fila costo y boton contratar: ${error}}`)
      })

      //Agregamos elementos al HTML
      cuerpoTabla.append(filaCosto);
      cuerpoTabla.append(filaBoton);
      tabla.append(cuerpoTabla);
      divTabla.append(tabla);
      div.append(divTabla);
      const seccionCotizador = document.querySelector("#cotizador");
      seccionCotizador.append(div);
      formCotizar.reset();

      //AgregadO Evento a Boton Contratar
      listaPlanesElectronica.then(data =>{
        data.forEach(plan => {
          let boton = document.querySelector(`#btnContratar${plan.id}`);
          boton.addEventListener("click", () =>
            agregarCotizacion(plan.id, plan.nombre, plan.factorRecargo)
          );
        });
      })
      .catch(error => {
        console.error(error);
        alertaError(`No fue posible agregar evento al boton contratar: ${error}}`)
      })

      //ViewPort hacia Seccion Planes
      let positionDivCotizacion = div.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + positionDivCotizacion.top - 50);

    })
    .catch(error => {
      console.error(error);
      alertaError(`No fue posible renderizar la tabla: ${error}}`)
    })
    
    function agregarCotizacion(idPlan, nombrePlan, recargoPlan) {
      let cotizacion = new Cotizacion(
        "electronica",
        idPlan,
        nombrePlan,
        electronico,
        Math.ceil(costoSeguro * recargoPlan)
      );
      cotizacion.agregarLS();
    }
  }
}


