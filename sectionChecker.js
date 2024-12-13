/**
 * Course Section Checker
 * 
 * This script automates the process of checking course section availability on a university platform.
 * It navigates the DOM to find course sections, processes availability, and sends notifications if spaces are available.
 * Additionally, it opens a YouTube video to alert the user of detected availability.
 * 
 * Usage:
 * Update the "cursosConSecciones" object with course codes and section numbers you want to track.
 * Example: { "TEST123": [10, 20], "EXAMPLE456": [30] }
 */

function mostrarSeccionesDeVariosCursos(cursosConSecciones) {
    const diccionariosPorCurso = {}; // Stores available spaces for sections by course

    /**
     * Processes the table containing section data and extracts available spaces for sections of interest.
     * 
     * @param {HTMLTableElement} tabla - The table element containing section data.
     * @param {Array<number>} seccionesInteres - Array of section numbers to track.
     * @returns {Object} - A dictionary of sections and their available spaces.
     */
    function procesarTextoYGuardarSecciones(tabla, seccionesInteres) {
        const seccionesDisponibles = {};
        const filas = tabla.querySelectorAll("tbody tr");

        filas.forEach((fila) => {
            const celdas = fila.querySelectorAll("td");

            if (celdas.length > 0) {
                const seccionTexto = celdas[0]?.textContent.trim().split(":")[1]?.trim(); // Extract section number
                const seccion = parseInt(seccionTexto, 10);

                const disponiblesTexto = celdas[4]?.textContent.trim(); // Extract available spaces
                const disponibles = parseInt(disponiblesTexto.replace(/\D/g, ""), 10);

                console.log(`Sección: ${seccion}, Disponibles: ${disponibles}`);

                if (seccionesInteres.includes(seccion) && !isNaN(disponibles)) {
                    seccionesDisponibles[seccion] = disponibles;
                }
            }
        });

        console.log("Secciones procesadas (final):", seccionesDisponibles);
        return seccionesDisponibles;
    }

    /**
     * Checks for available spaces and sends notifications or alerts if availability is detected.
     */
    function verificarDisponibilidadYMostrarMensaje() {
        const mensajes = [];

        for (const curso in diccionariosPorCurso) {
            const secciones = diccionariosPorCurso[curso];
            for (const seccion in secciones) {
                const disponibles = secciones[seccion];
                if (disponibles > 0) {
                    mensajes.push(`The course ${curso}, Section ${seccion} has ${disponibles} available spaces.`);
                }
            }
        }

        if (mensajes.length > 0) {
            console.log("Availability detected:", mensajes);

            const youtubeURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            window.open(youtubeURL);

            if (Notification.permission === "granted") {
                setTimeout(() => {
                    mensajes.forEach((mensaje) => {
                        new Notification("Course Availability Alert", {
                            body: mensaje,
                            icon: "https://image.shutterstock.com/image-vector/notification-bell-icon-vector-illustration-260nw-1108473484.jpg"
                        });
                    });
                }, 5000);
            } else {
                alert("Availability detected:\n" + mensajes.join("\n"));
            }
        } else {
            console.log("No available spaces in the selected sections.");
        }
    }

    /**
     * Navigates the DOM to find and process course data for the specified index.
     * 
     * @param {number} indiceCurso - The index of the current course being processed.
     */
    function procesarCurso(indiceCurso) {
        const codigoCurso = Object.keys(cursosConSecciones)[indiceCurso];
        const seccionesInteres = cursosConSecciones[codigoCurso];
        const acordeones = document.querySelectorAll("accordion-group");

        let acordeonEncontrado = null;

        acordeones.forEach((acordeon) => {
            const textoAcordeon = acordeon.textContent.trim();
            if (textoAcordeon.includes(codigoCurso)) {
                acordeonEncontrado = acordeon;
            }
        });

        if (acordeonEncontrado) {
            console.log(`Accordion found for course ${codigoCurso}`);
            acordeonEncontrado.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
                const toggle = acordeonEncontrado.querySelector(".accordion-toggle");
                if (toggle) {
                    toggle.click();
                    setTimeout(() => {
                        const tabla = acordeonEncontrado.querySelector("table");
                        if (tabla) {
                            const diccionarioSecciones = procesarTextoYGuardarSecciones(tabla, seccionesInteres);
                            diccionariosPorCurso[codigoCurso] = diccionarioSecciones;

                            if (indiceCurso + 1 < Object.keys(cursosConSecciones).length) {
                                procesarCurso(indiceCurso + 1);
                            } else {
                                verificarDisponibilidadYMostrarMensaje();
                            }
                        } else {
                            console.log(`No table found for course ${codigoCurso}`);
                        }
                    }, 1000);
                }
            }, 1000);
        } else {
            console.log(`Course ${codigoCurso} not found.`);
        }
    }

    procesarCurso(0);
}

// Request notification permissions on load
if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
        console.log("Notification permissions:", permission);
    });
}

// Example usage: Replace with your desired course codes and section numbers
const cursosConSecciones = {
    "TEST123": [10, 20], // Replace TEST123 with actual course codes
    "EXAMPLE456": [30]  // Replace EXAMPLE456 with actual course codes
};

mostrarSeccionesDeVariosCursos(cursosConSecciones);
