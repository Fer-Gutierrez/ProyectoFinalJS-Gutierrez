//CLASES
class Movilidad {
  constructor(marca, sumaAsegurada) {
    (this.marca = marca), (this.sumaAsegurada = sumaAsegurada);
  }

  async obtenerTasa() {
    let tasa = await listaMarcasMovilidad
      .then(data => {
        let movEncontrada = data.find(valor => valor.marca.toLowerCase() === this.marca.toLowerCase());
        return movEncontrada.tasaBasica;
      })
      .catch(error => {
        console.error(error);
        alertaError( `No fue posible obtener tasa: ${error}`)
      })

    return tasa;
  }
}

//FETCHS
const listaMarcasMovilidad = fetch(`./json/listaMarcasMovilidad.json`)
  .then(response => response.json())
  .catch(error => {
    console.error(error);
    alertaError("No fue posible consultar la lista de marcas de movilidad")
  })

const listaPlanesMovilidad = fetch(`./json/listaPlanesMovilidad.json`)
  .then(response => response.json())
  .catch(error => {
    console.error(error);
    alertaError("No fue posible consultar la lista de planes de movilidad")
  })

const listaCoberturasMovilidad = fetch(`./json/listaCoberturasMovilidad.json`)
  .then(response => response.json())
  .catch(error => {
    console.error(error);
    alertaError("No fue posible consultar la lista de coberturas de movilidad")
  })


//SELECT MARCA
const selectMarca = document.querySelector("#marcaMov");
selectMarca.innerHTML = `<option selected="true" disabled="disabled">Seleccione una marca</option>`;
listaMarcasMovilidad
  .then(data => {
    data.forEach(marcaMov => {
      selectMarca.innerHTML += `<option value="${marcaMov.id}">${marcaMov.marca}</option>`;
    });
  })
  .catch(error => {
    console.error(error);
    alertaError(`No fue posible completar el select con las marcas: ${error}}`)
  })

//SELECT SUMA
const inputSumaMov = document.querySelector("#sumaMov");
inputSumaMov.addEventListener("click", () => inputSumaMov.select());
inputSumaMov.addEventListener("change", cambiarFormatoSuma);
function cambiarFormatoSuma() {
  let valor = quitarFormatoMoneda(inputSumaMov.value);
  if (isNaN(valor) || valor <= 0) {
    inputSumaMov.value = "";
    alertaInformativa("Suma asegurada deben ser numeros enteros positivos");
  } else {
    inputSumaMov.value = formatoMoneda(Math.ceil(valor));
  }
}

//SUBMIT COTIZAR
const formCotizar = document.querySelector("#form-cotizar");
formCotizar.addEventListener("submit", cotizar);
async function cotizar(e) {
  e.preventDefault();
  let marcaMov = selectMarca.options[selectMarca.selectedIndex].text;
  let sumaMov = quitarFormatoMoneda(inputSumaMov.value);

  if (isNaN(sumaMov)) {
    alertaInformativa("No es posible cotizar. Suma Asegurada debe ser numérica");
  } else {
    //Cotizamos
    let movilidad = new Movilidad(marcaMov, sumaMov);
    let tasa = await movilidad.obtenerTasa();
    let costoSeguro = (sumaMov * tasa) / 1000;

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
    parrafo.innerText = `Cotización para un medio de movilidad marca ${marcaMov} de ${formatoMoneda(
      sumaMov
    )}:`;
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
    listaPlanesMovilidad
      .then(data => {
        data.forEach(plan =>(filaEncabezado.innerHTML += `<th scope="col">${plan.nombre}</th>`));
        encabezadoTabla.append(filaEncabezado);
        tabla.append(encabezadoTabla);
      })
      .catch(error => {
        console.error(error);
        alertaError(`No fue posible completar el encabezado con los planes: ${error}}`)
      })

    //CuerpoTabla
    let cuerpoTabla = document.createElement("tbody");
    cuerpoTabla.className = "table-group-divider";
    listaCoberturasMovilidad.then(data => {
      data.forEach(cobertura => {
        let fila = document.createElement("tr");
        let columnaCob = document.createElement("td");
        columnaCob.innerText = cobertura.cobertura;
        fila.append(columnaCob);

        listaPlanesMovilidad
          .then(data => {
            data.forEach(plan => {
              let colummaPlan = document.createElement("td");
              let planEncontrado = cobertura.planes.some(
                valor => valor === plan.id
              );
              planEncontrado? (colummaPlan.innerHTML = `<i class="icon-check">`) : (colummaPlan.innerHTML = `<i class="icon-x">`);
              fila.append(colummaPlan);
            });
          })
          .catch(error => {
            console.error(error);
            alertaError(`No fue posible completar las coberturas por plan: ${error}}`);
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
      listaPlanesMovilidad
        .then(data => {
          data.forEach(plan => {
            filaCosto.innerHTML += `<td>${formatoMoneda(Math.ceil(costoSeguro * plan.factorRecargo))}</td>`;
            filaBoton.innerHTML += `<td><button id="btnContratar${plan.id}">Contratar</button></td>`;
          });
        })
        .catch(error => {
          console.error(error);
          alertaError(`No fue posible completar la fila costo y boton: ${error}}`)
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
      listaPlanesMovilidad
        .then(data => {
          data.forEach(plan => {
            let boton = document.querySelector(`#btnContratar${plan.id}`);
            boton.addEventListener("click", () =>
              agregarCotizacion(plan.id, plan.nombre, plan.factorRecargo)
            );
          });
        })
        .catch(error => {
          console.error(error);
          alertaError(`No fue posible agregar evento a boton contratar: ${error}}`)
        })

      //ViewPort hacia Seccion Planes
      let positionDivCotizacion = div.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + positionDivCotizacion.top - 50);
    })
    .catch(error => {
      console.error(error);
      alertaError(`No fue posible renderizar el cuerpo de la tabla: ${error}}`)
    });

    function agregarCotizacion(idPlan, nombrePlan, recargoPlan) {
      let cotizacion = new Cotizacion(
        "movilidad",
        idPlan,
        nombrePlan,
        movilidad,
        Math.ceil(costoSeguro * recargoPlan)
      );
      cotizacion.agregarLS();
    }
  }
}
