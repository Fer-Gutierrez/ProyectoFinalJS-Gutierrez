//FUNCIONES COMUNES
function formatoMoneda(valor) {
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    minimumFractionDigits: 0,
    currency: "ars",
  });
  return formatter.format(valor);
}

function quitarFormatoMoneda(valor) {
  if (isNaN(valor)) {
    valor = valor.replace(/[a-zA-Z ,.$]/g, "");
  }
  return Number(valor.trim());
}

function alertaIngresoCarrito() {
  iziToast.success({
    timeout: 3000,
    pauseOnHover: false,
    progressBar: false,
    transitionIn: "fadeInLeft",
    message: "Seguro agregado al carrito",
  });
}

function alertaItemCarritoEliminado() {
  iziToast.info({
    icon: `bi bi-trash3`,
    backgroundColor: "#d78989",
    timeout: 3000,
    pauseOnHover: false,
    progressBar: false,
    transitionIn: "fadeInLeft",
    message: "Seguro eliminado del carrito",
  });
}

function alertaInformativa(message){
  iziToast.warning({
    timeout: 3000,
    pauseOnHover: false,
    progressBar: false,
    transitionIn: "fadeInRight",
    position: "topLeft",
    message,
});
}

function alertaError(messageError){
  iziToast.error({
    title: 'Error',
    timeout: 3000,
    pauseOnHover: false,
    progressBar: false,
    transitionIn: "fadeInLeft",
    position: "bottomLeft",
    message: messageError,
});
}

function actualizarCarrito() {
  let numerito =
    JSON.parse(localStorage.getItem("misCotizaciones"))?.length || 0;
  numeritoCarrito = document.querySelector("#numeritoCarrito");
  numeritoCarrito.innerText = numerito;
}

function consultarCarrito() {
  let misCotizaciones =
    JSON.parse(localStorage.getItem("misCotizaciones")) || [];
  mostrarModalCarrito(misCotizaciones);
}

function mostrarModalCarrito(arrayCotizaciones) {
  let modalBody = document.querySelector("#modal-body");
  let amountCarrito = 0;
  if (arrayCotizaciones.length > 0) {
    arrayCotizaciones.forEach((cot, indice) => {
      switch(cot.ramo){
        case "automotores":
          modalBody.innerHTML += `
          <div class="itemCarrito">
            <div class="info-itemCarrito">
              <span class="titulo-itemCarrito">${indice + 1} - Seguro de ${
            cot.ramo
          } por ${formatoMoneda(cot.costoSeguro)} por mes</span>
              <span class="subtitulo-itemCarrito">Plan ${cot.planNombre}: ${
            cot.bienAsegurado.marca
          } ${cot.bienAsegurado.modelo} ${
            cot.bienAsegurado.anio
          } de ${formatoMoneda(cot.bienAsegurado.sumaAsegurada)}</span>
            </div>
            <button id="eliminar-itemCarrito-${indice}" class="btnEliminar-itemCarrito"><i class="bi bi-trash3"></i></button>
          </div>`;
          break;
        case "movilidad":
          modalBody.innerHTML += `
          <div class="itemCarrito">
            <div class="info-itemCarrito">
              <span class="titulo-itemCarrito">${indice + 1} - Seguro de ${
            cot.ramo
          } por ${formatoMoneda(cot.costoSeguro)} por mes</span>
              <span class="subtitulo-itemCarrito">Plan ${cot.planNombre}: ${cot.bienAsegurado.marca} de ${formatoMoneda(cot.bienAsegurado.sumaAsegurada)}</span>
            </div>
            <button id="eliminar-itemCarrito-${indice}" class="btnEliminar-itemCarrito"><i class="bi bi-trash3"></i></button>
          </div>`;
          break;
        case "electronica":
          modalBody.innerHTML += `
          <div class="itemCarrito">
            <div class="info-itemCarrito">
              <span class="titulo-itemCarrito">${indice + 1} - Seguro de ${cot.ramo} por ${formatoMoneda(cot.costoSeguro)} por mes</span>
              <span class="subtitulo-itemCarrito">Plan ${cot.planNombre}: ${cot.bienAsegurado.familiaEq} ${cot.bienAsegurado.marcaEq} ${cot.bienAsegurado.modeloEq} de ${formatoMoneda(cot.bienAsegurado.sumaAsegurada)}</span>
            </div>
            <button id="eliminar-itemCarrito-${indice}" class="btnEliminar-itemCarrito"><i class="bi bi-trash3"></i></button>
          </div>`;
          break;
      }
      //total del carrito
      amountCarrito += cot.costoSeguro;
    });

    //Agrego el total del carrito
    let divAmount = document.createElement("div");
    divAmount.className = "totalCarrito";
    divAmount.innerHTML = `
    <span class="texto-totalCarrito">Total mensual:</span>
    <span class="texto-totalCarrito">${formatoMoneda(amountCarrito)}</span>
    `;
    modalBody.append(divAmount);

    //Agrego Boton Finalizar Compra
    let botonComprar = document.createElement("button");
    botonComprar.innerText = "Finalizar Compra";
    botonComprar.className = "btnComprar-carrito";
    modalBody.append(botonComprar);

    //Agregamos addEventListener a cada Boton Eliminar
    arrayCotizaciones.forEach((cot, indice) => {
      let botonEliminar = document.querySelector(
        `#eliminar-itemCarrito-${indice}`
      );
      botonEliminar.addEventListener("click", () => {
        eliminarItemCarrito(indice);
      });
    });
  } else {
    modalBody.innerHTML = `<span class="titulo-itemCarrito">No tienes seguros cotizados</span>`;
  }
}

function eliminarItemCarrito(indice) {
  let misCotizaciones = JSON.parse(localStorage.getItem("misCotizaciones"));
  misCotizaciones.splice(indice, 1);
  localStorage.setItem("misCotizaciones", JSON.stringify(misCotizaciones));
  actualizarCarrito();
  let modalBody = document.querySelector("#modal-body");
  modalBody.innerHTML = "";
  mostrarModalCarrito(misCotizaciones);
  alertaItemCarritoEliminado();
}

//CLASES EN COMUN
class Cotizacion {
  constructor(ramo, planId, planNombre, bienAsegurado, costoSeguro) {
    this.ramo = ramo;
    this.planId = planId;
    this.planNombre = planNombre;
    this.bienAsegurado = bienAsegurado;
    this.costoSeguro = costoSeguro;
  }

  agregarLS() {
    //Verificamos si existe un LS
    let misCotizaciones =
      JSON.parse(localStorage.getItem("misCotizaciones")) || [];

    //agregar al LS
    let cotizacion = this;
    misCotizaciones.push(cotizacion);
    localStorage.setItem("misCotizaciones", JSON.stringify(misCotizaciones));
    actualizarCarrito();
    alertaIngresoCarrito();
  }
}

//ELEMENTOS EN COMUN
//Boton Carrito
const botonCarrito = document.querySelector("#carrito");
botonCarrito.addEventListener("click", consultarCarrito);
//Modal para carrito
const modal = document.querySelector("#modal-carrito");
//Boton Cerarr --> MODAL CARRITO
const btnCerrarModal = modal.querySelector(".btn-close");
btnCerrarModal.addEventListener("click", () => {
  let modalBody = document.querySelector("#modal-body");
  modalBody.innerHTML = "";
});
//Boton hamburguesa
const btnHamburguesa = document.querySelector(".menuHamburguer");
const nav = document.querySelector("#nav-links");
const btnCloseNav = document.querySelector("#close-nav");
btnHamburguesa.addEventListener("click",()=>{;
  nav.classList.toggle("slide-in-top");
  nav.classList.toggle("visible");
  btnCloseNav.classList.toggle("oculto");
})
//Boton close mobile nav
btnCloseNav.addEventListener("click", ()=>{
  nav.classList.toggle("slide-in-top");
  nav.classList.toggle("visible");
  btnCloseNav.classList.toggle("oculto");
});

//EVENTOS EN COMUN
//Actualizar numerito carrito
actualizarCarrito();
//Comportamiento del nav con el scroll
window.addEventListener("scroll", bgcNavBar);
function bgcNavBar() {
  // window.scrollY
  let btnCotizar = document.getElementsByClassName("cta");
  let positionBtnCotizar = btnCotizar[0].getBoundingClientRect();
  const header = document.querySelector("#hero");
  const logoNav = document.querySelector("#logoNav");
  const ulNav = document.getElementsByClassName("navitem");
  const iMenuHamb = document.querySelector("#menuHamburguer");

  if (positionBtnCotizar.top <= 10) {
    header.className = "bgc-grey";
    logoNav.classList.add("black");
    for (let i = 0; i < ulNav.length; i++) {
      ulNav[i].classList.add("black");
    }
    iMenuHamb.classList.add("black");
  } else {
    header.className = "bgc-transparet";
    logoNav.classList.remove("black");
    for (let i = 0; i < ulNav.length; i++) {
      ulNav[i].classList.remove("black");
    }
    iMenuHamb.classList.remove("black");
  }
}