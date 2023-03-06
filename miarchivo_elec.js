//CLASES
class Electronica {
  constructor(familiaEq, marcaEq, modeloEq, sumaAsegurada) {
    this.familiaEq = familiaEq, 
    this.marcaEq = marcaEq,
    this.modeloEq = modeloEq,
    this.sumaAsegurada = sumaAsegurada
  }

  obtenerTasa() {
    let FamiliaEncontrada = listaFamiliasEquipos.find(
      valor => valor.familiaEq.toLowerCase() === this.familiaEq.toLowerCase()
    );
    return FamiliaEncontrada.tasaBasica;
  }
}

//LISTAS
const listaFamiliasEquipos = [
  { id: 1, familiaEq: "Notebook", tasaBasica: 10 },
  { id: 2, familiaEq: "Celular", tasaBasica: 15 },
  { id: 3, familiaEq: "Consola", tasaBasica: 12 },
  { id: 4, familiaEq: "Tablet", tasaBasica: 13 },
];
const listaPlanesElectronica = [
  { id: 1, nombre: "Robo Domicilio", factorRecargo: 1 },
  { id: 2, nombre: "Robo Mundo Entero", factorRecargo: 1.3 },
  { id: 3, nombre: "Todo Riesgo Domicilio", factorRecargo: 1.5 },
  { id: 4, nombre: "Todo Riesgo Mundo", factorRecargo: 1.6 },
];
const listaCoberturasElectronica = [
  { id: 1, cobertura: "Incendio en domicilio", planes: [1, 2, 3, 4] },
  { id: 2, cobertura: "Robo en domicilio", planes: [1, 2, 3, 4] },
  { id: 3, cobertura: "Incendio en el mundo entero", planes: [2, 4] },
  { id: 4, cobertura: "Robo en el mundo entero", planes: [2, 4] },
  { id: 5, cobertura: "Daños por accidente en domicilio", planes: [3, 4] },
  { id: 6, cobertura: "Daños por accidente en el mundo entero", planes: [4] },
];

//SELECT FAMILIA
const selectFamilia = document.querySelector("#familiaEq");
selectFamilia.innerHTML = `<option selected="true" disabled="disabled">Seleccione un tipo</option>`;
for (let familia of listaFamiliasEquipos) {
  selectFamilia.innerHTML += `<option value="${familia.id}">${familia.familiaEq}</option>`;
}

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

function cotizar(cant) {
  let costoSeguro = (sumaBien * tasaBien) / 1000 / 12;
  listaCot.push({ tipoBien: bien, suma: sumaBien, costo: costoSeguro });
}

//SUBMIT COTIZAR
const formCotizar = document.querySelector("#form-cotizar");
formCotizar.addEventListener("submit", cotizar);
function cotizar(e) {
  e.preventDefault();
  let familaEq = selectFamilia.options[selectFamilia.selectedIndex].text;
  let marcaEq = inputMarcaEq.value;
  let modeloEq = inputModeloEq.value;
  let sumaEq = quitarFormatoMoneda(inputSumaEq.value);

  if (isNaN(sumaEq)) {
    alertaInformativa(
      "No es posible cotizar. Suma Asegurada deben ser numérica"
    );
  } else {
    //Cotizamos
    let electronico = new Electronica(familaEq, marcaEq, modeloEq, sumaEq);
    let tasa = electronico.obtenerTasa();
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
    listaPlanesElectronica.forEach(
      plan =>
        (filaEncabezado.innerHTML += `<th scope="col">${plan.nombre}</th>`)
    );
    encabezadoTabla.append(filaEncabezado);
    tabla.append(encabezadoTabla);

    //CuerpoTabla
    let cuerpoTabla = document.createElement("tbody");
    cuerpoTabla.className = "table-group-divider";
    listaCoberturasElectronica.forEach(cobertura => {
      let fila = document.createElement("tr");
      let columnaCob = document.createElement("td");
      columnaCob.innerText = cobertura.cobertura;
      fila.append(columnaCob);

      listaPlanesElectronica.forEach(plan => {
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
    listaPlanesElectronica.forEach(plan => {
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
    listaPlanesElectronica.forEach(plan => {
      let boton = document.querySelector(`#btnContratar${plan.id}`);
      boton.addEventListener("click", () =>
        agregarCotizacion(plan.id, plan.nombre, plan.factorRecargo)
      );
    });

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

    //ViewPort hacia Seccion Planes
    let positionDivCotizacion = div.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + positionDivCotizacion.top - 50);
  }
}
