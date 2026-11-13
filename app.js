(function () {
  const NUMERO_WHATSAPP = "5493513239815";

  const pasos = {
    1: document.getElementById("paso-1"),
    2: document.getElementById("paso-2"),
    3: document.getElementById("paso-3"),
    4: document.getElementById("paso-4")
  };

  const inputNombre = document.getElementById("input-nombre");
  const inputEmprendimiento = document.getElementById("input-emprendimiento");
  const inputCelular = document.getElementById("input-celular");
  const inputValor = document.getElementById("input-valor");

  const errorPaso1 = document.getElementById("error-paso-1");
  const errorPaso3 = document.getElementById("error-paso-3");
  const errorPaso4 = document.getElementById("error-paso-4");

  const gridCaja25 = document.getElementById("grid-caja-25");
  const gridCaja14 = document.getElementById("grid-caja-14");
  const textoResumen = document.getElementById("texto-resumen");

  const btnPaso1Siguiente = document.getElementById("btn-paso1-siguiente");
  const btnSolo14 = document.getElementById("btn-solo-14");
  const btnPaso2Volver = document.getElementById("btn-paso2-volver");
  const btnPaso2Siguiente = document.getElementById("btn-paso2-siguiente");
  const btnSolo25 = document.getElementById("btn-solo-25");
  const btnPaso3Volver = document.getElementById("btn-paso3-volver");
  const btnPaso3Siguiente = document.getElementById("btn-paso3-siguiente");
  const btnPaso4Volver = document.getElementById("btn-paso4-volver");
  const btnConfirmar = document.getElementById("btn-confirmar");

  const seleccionCaja25 = new Set();
  const seleccionCaja14 = new Set();

  function estaDisponible(estado) {
    return String(estado).trim().toLowerCase() !== "reservado";
  }

  function ocultarErrores() {
    errorPaso1.hidden = true;
    errorPaso3.hidden = true;
    errorPaso4.hidden = true;
  }

  function mostrarPaso(numeroPaso) {
    ocultarErrores();
    Object.values(pasos).forEach(function (el) {
      el.classList.remove("activo");
    });
    pasos[numeroPaso].classList.add("activo");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function vincularLimpiezaError(inputEl, errorEl, todosInputs) {
    inputEl.addEventListener("input", function () {
      if (inputEl.value.trim() !== "") {
        inputEl.classList.remove("input-error");
      }
      if (
        todosInputs.every(function (el) {
          return el.value.trim() !== "";
        })
      ) {
        errorEl.hidden = true;
      }
    });
  }

  const inputsPaso1 = [inputNombre, inputEmprendimiento, inputCelular];
  inputsPaso1.forEach(function (inputEl) {
    vincularLimpiezaError(inputEl, errorPaso1, inputsPaso1);
  });
  vincularLimpiezaError(inputValor, errorPaso4, [inputValor]);

  function renderizarBotonera(contenedor, diasConfig, inicio, fin, seleccionSet) {
    contenedor.innerHTML = "";
    const config = diasConfig || {};

    for (let dia = inicio; dia <= fin; dia++) {
      const estado = config[dia] !== undefined ? config[dia] : "Disponible";
      if (!estaDisponible(estado)) {
        continue;
      }

      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "btn-dia";
      boton.textContent = String(dia);
      boton.dataset.dia = String(dia);
      boton.setAttribute("aria-pressed", seleccionSet.has(dia) ? "true" : "false");

      if (seleccionSet.has(dia)) {
        boton.classList.add("activo");
      }

      boton.addEventListener("click", function () {
        if (seleccionSet.has(dia)) {
          seleccionSet.delete(dia);
          boton.classList.remove("activo");
          boton.setAttribute("aria-pressed", "false");
        } else {
          seleccionSet.add(dia);
          boton.classList.add("activo");
          boton.setAttribute("aria-pressed", "true");
          errorPaso3.hidden = true;
        }
      });

      contenedor.appendChild(boton);
    }
  }

  function limpiarVisualBotonera(contenedor) {
    const botones = contenedor.querySelectorAll(".btn-dia");
    botones.forEach(function (btn) {
      btn.classList.remove("activo");
      btn.setAttribute("aria-pressed", "false");
    });
  }

  function actualizarResumen() {
    const cant25 = seleccionCaja25.size;
    const cant14 = seleccionCaja14.size;

    if (cant25 > 0 && cant14 > 0) {
      textoResumen.textContent =
        "Elegíste " + cant25 + " días de la Caja de 25 días y " + cant14 + " de la Caja de 14 días";
    } else if (cant25 > 0) {
      textoResumen.textContent = "Elegiste " + cant25 + " de la Caja de 25 días";
    } else if (cant14 > 0) {
      textoResumen.textContent = "Elegiste " + cant14 + " de la Caja de 14 días";
    } else {
      textoResumen.textContent =
        "Elegíste 0 días de la Caja de 25 días y 0 de la Caja de 14 días";
    }
  }

  function ordenarDias(seleccionSet) {
    return Array.from(seleccionSet).sort(function (a, b) {
      return a - b;
    });
  }

  btnPaso1Siguiente.addEventListener("click", function () {
    let primerVacio = null;

    inputsPaso1.forEach(function (inputEl) {
      if (inputEl.value.trim() === "") {
        inputEl.classList.add("input-error");
        if (!primerVacio) {
          primerVacio = inputEl;
        }
      } else {
        inputEl.classList.remove("input-error");
      }
    });

    if (primerVacio) {
      errorPaso1.hidden = false;
      primerVacio.focus();
      return;
    }

    mostrarPaso(2);
  });

  btnSolo14.addEventListener("click", function () {
    seleccionCaja25.clear();
    limpiarVisualBotonera(gridCaja25);
    mostrarPaso(3);
  });

  btnPaso2Volver.addEventListener("click", function () {
    mostrarPaso(1);
  });

  btnPaso2Siguiente.addEventListener("click", function () {
    mostrarPaso(3);
  });

  btnSolo25.addEventListener("click", function () {
    seleccionCaja14.clear();
    limpiarVisualBotonera(gridCaja14);
    if (seleccionCaja25.size > 0) {
      actualizarResumen();
      mostrarPaso(4);
    } else {
      mostrarPaso(2);
    }
  });

  btnPaso3Volver.addEventListener("click", function () {
    mostrarPaso(2);
  });

  btnPaso3Siguiente.addEventListener("click", function () {
    if (seleccionCaja25.size + seleccionCaja14.size === 0) {
      errorPaso3.hidden = false;
      return;
    }

    actualizarResumen();
    mostrarPaso(4);
  });

  btnPaso4Volver.addEventListener("click", function () {
    mostrarPaso(3);
  });

  btnConfirmar.addEventListener("click", function () {
    const valor = inputValor.value.trim();

    if (valor === "") {
      inputValor.classList.add("input-error");
      errorPaso4.hidden = false;
      inputValor.focus();
      return;
    }

    inputValor.classList.remove("input-error");
    errorPaso4.hidden = true;

    const nombre = inputNombre.value.trim();
    const emprendimiento = inputEmprendimiento.value.trim();

    const lista25 = ordenarDias(seleccionCaja25);
    const lista14 = ordenarDias(seleccionCaja14);

    const dias25Texto = lista25.join(", ");
    const dias14Texto = lista14.join(", ");

    let detalleReservas = "";
    if (lista25.length > 0 && lista14.length > 0) {
      detalleReservas =
        "los días " + dias25Texto + " de la Caja de 25 y los días " + dias14Texto + " de la Caja de 14";
    } else if (lista25.length > 0) {
      detalleReservas = "los días " + dias25Texto + " de la Caja de 25";
    } else if (lista14.length > 0) {
      detalleReservas = "los días " + dias14Texto + " de la Caja de 14";
    } else {
      detalleReservas =
        "los días " + dias25Texto + " de la Caja de 25 y los días " + dias14Texto + " de la Caja de 14";
    }

    const mensaje =
      "Hola Fran, soy " +
      nombre +
      " de " +
      emprendimiento +
      " te escribo para reservar " +
      detalleReservas +
      " por un total de " +
      valor +
      ". Aguardo Confirmación";

    const url = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank", "noopener,noreferrer");
  });

  const datosDias = window.DIAS_CAJA || { caja25: {}, caja14: {} };
  renderizarBotonera(gridCaja25, datosDias.caja25, 1, 25, seleccionCaja25);
  renderizarBotonera(gridCaja14, datosDias.caja14, 12, 25, seleccionCaja14);
})();
