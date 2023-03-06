//CLASES
class Movilidad {
  constructor(marca, sumaAsegurada) {
    (this.marca = marca), (this.sumaAsegurada = sumaAsegurada);
  }

  obtenerTasa() {
    let movEncontrada = listaMarcasMovilidad.find(
      valor => valor.marca.toLowerCase() === this.marca.toLowerCase()
    );
    return movEncontrada.tasaBasica;
  }
}

//LISTAS
const listaMarcasMovilidad = [
  { id: 1, marca: "SLP", tasaBasica: 35 },
  { id: 2, marca: "Venzo", tasaBasica: 40 },
  { id: 3, marca: "Giant", tasaBasica: 38 },
  { id: 4, marca: "Delma", tasaBasica: 32 },
];
const listaPlanesMovilidad = [
  { id: 1, nombre: "Robo Básico", factorRecargo: 1 },
  { id: 2, nombre: "Robo y Daño", factorRecargo: 1.15 },
  { id: 3, nombre: "Todo Riesgo", factorRecargo: 1.4 },
];
const listaCoberturasMovilidad = [
  { id: 1, cobertura: "Robo Total medio de movilidad", planes: [1, 2, 3] },
  { id: 2, cobertura: "Daños por la tentativa de robo", planes: [1, 2, 3] },
  { id: 3, cobertura: "Hurto en la vivienda del asegurado", planes: [1, 2, 3] },
  { id: 4, cobertura: "Daño total", planes: [2, 3] },
  { id: 5, cobertura: "Robo de accesorios", planes: [2, 3] },
  { id: 6, cobertura: "Robo de documentos personales", planes: [2, 3] },
  {
    id: 7,
    cobertura: "Daños a equipos electrónicos (hasta $ 20.000)",
    planes: [3],
  },
  {
    id: 8,
    cobertura: "Responsabilidad Civil por el uso de movilidad",
    planes: [3],
  },
  { id: 9, cobertura: "Asistencia a la movilidad", planes: [1, 2, 3] },
];

//SELECT MARCAS
const selectMarca = document.querySelector("#marcaMov");
selectMarca.innerHTML = `<option selected="true" disabled="disabled">Seleccione una marca</option>`;
for (let marcaMov of listaMarcasMovilidad) {
  selectMarca.innerHTML += `<option value="${marcaMov.id}">${marcaMov.marca}</option>`;
}

//SELECT SUMAVH
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
const formCotizar = document.querySelector("#form-cotizar-mov");
formCotizar.addEventListener("submit", cotizar);
function cotizar(e) {
  e.preventDefault();
  let marcaMov = selectMarca.options[selectMarca.selectedIndex].text;
  let sumaMov = quitarFormatoMoneda(inputSumaMov.value);

  if (isNaN(sumaMov)) {
    alertaInformativa(
      "No es posible cotizar. Suma Asegurada y Año ingresados deben ser numéricos"
    );
  } else {
    //Cotizamos
    let movilidad = new Movilidad(marcaMov, sumaMov);
    let tasa = movilidad.obtenerTasa();
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
    listaPlanesMovilidad.forEach(
      plan =>
        (filaEncabezado.innerHTML += `<th scope="col">${plan.nombre}</th>`)
    );
    encabezadoTabla.append(filaEncabezado);
    tabla.append(encabezadoTabla);

    //CuerpoTabla
    let cuerpoTabla = document.createElement("tbody");
    cuerpoTabla.className = "table-group-divider";
    listaCoberturasMovilidad.forEach(cobertura => {
      let fila = document.createElement("tr");
      let columnaCob = document.createElement("td");
      columnaCob.innerText = cobertura.cobertura;
      fila.append(columnaCob);

      listaPlanesMovilidad.forEach(plan => {
        let colummaPlan = document.createElement("td");
        let planEncontrado = cobertura.planes.some(valor => valor === plan.id);
        if (planEncontrado) {
          colummaPlan.innerHTML = `<i class="icon-check">`;
        } else {
          colummaPlan.innerHTML = `<i class="icon-x">`;
        }
        fila.append(colummaPlan);
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
    listaPlanesMovilidad.forEach(plan => {
      filaCosto.innerHTML += `<td>${formatoMoneda(
        Math.ceil(costoSeguro * plan.factorRecargo)
      )}</td>`;
      filaBoton.innerHTML += `<td><button id="btnContratar${plan.id}">Contratar</button></td>`;
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

    //AgregadO Evento a Boton Contratar
    listaPlanesMovilidad.forEach(plan => {
      let boton = document.querySelector(`#btnContratar${plan.id}`);
      boton.addEventListener("click", () =>
        agregarCotizacion(plan.id, plan.nombre, plan.factorRecargo)
      );
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

    //ViewPort hacia Seccion Planes
    let positionDivCotizacion = div.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + positionDivCotizacion.top - 50);
  }
}


