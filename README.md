# Buscaminas — Ejercicio 2

![version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![license](https://img.shields.io/badge/license-MIT-lightgrey.svg)

**Descripción general**

Juego clásico de Buscaminas implementado con HTML, CSS y JavaScript puro. Es una implementación educativa, minimalista y funcional pensada para practicar manipulación dinámica del DOM, manejo de estados y recorridos recursivos para descubrir celdas vacías.

**Demo**: Abre [Ejercicio2/index.html](Ejercicio2/index.html) en tu navegador para jugar localmente.

**Inicio Rápido y Comandos**

| Comando | Descripción |
|---|---|
| `open Ejercicio2/index.html` | Abrir la página directamente (macOS). |
| `python3 -m http.server 8000 --directory Ejercicio2` | Servir la carpeta local y abrir http://localhost:8000 (recomendado para evitar restricciones de CORS). |

**Stack Tecnológico**

- **Lenguajes:** HTML5, CSS3, JavaScript (Vanilla).
- **No requiere** dependencias externas ni frameworks.

**Arquitectura del Sistema**

La aplicación es una página estática que mantiene el estado del juego en memoria en un único objeto JavaScript. La UI se compone de una cuadrícula de botones (celdas) generada dinámicamente.

**Estructura del proyecto**

- [Ejercicio2/index.html](Ejercicio2/index.html) : Página principal del juego.
- [Ejercicio2/styles.css](Ejercicio2/styles.css) : Estilos CSS básicos y responsivos.
- [Ejercicio2/script.js](Ejercicio2/script.js) : Lógica completa del juego (generación, control, temporizador).
- [Ejercicio2/README.md](Ejercicio2/README.md) : Documentación que estás leyendo.

**Documentación técnica (Deep Dive)**

- **Estado principal:** `gameState` — contiene `size`, `mines`, `board`, `revealedSafeCells`, `isGameOver`, `secondsElapsed`, `timerId`, `hasStarted`.
- **Representación de celdas:** cada celda es un objeto con `{ row, column, isMine, adjacentMines, isRevealed, isFlagged, element }`.
- **Colocación de minas:** `placeMines()` selecciona posiciones aleatorias y marca `isMine=true` evitando duplicados.
- **Cálculo de adyacencia:** `calculateAdjacentMines()` itera por la matriz y calcula `adjacentMines` usando `getNeighborPositions()`.
- **Revelado recursivo:** `revealCell(r,c)` marca la celda como revelada; si `adjacentMines===0` invoca recursivamente el revelado de vecinos hasta encontrar bordes con números.
- **Banderas:** clic derecho (evento `contextmenu`) alterna `isFlagged` y actualiza la apariencia de la celda.
- **Temporizador:** se inicia en el primer clic válido con `startTimer()` y cuenta segundos en `gameState.secondsElapsed`.
- **Fin de partida:** si se descubre una mina se llama a `revealAllMines()` y se muestra `Game Over`. La victoria se detecta cuando `revealedSafeCells === totalCells - mines`.
- **Validaciones:** la UI valida que `mines < size*size` antes de crear el tablero.

**Cómo jugar (resumen rápido)**

- Clic izquierdo: revelar celda.
- Clic derecho: marcar/quitar bandera.
- Si revelas una mina: fin de partida.
- Revela todas las celdas sin mina para ganar; el tiempo se muestra en pantalla.

**Instalación y configuración (Setup)**

Requisitos mínimos: un navegador moderno. Para servir localmente (opcional) se recomienda Python 3:

```bash
git clone git@github.com:RevertDeveloper/Ejercicio_Javascript.git
cd Ejercicio_Javascript/<ruta_a_los_ejercicios>/Ejercicio2
python3 -m http.server 8000 --directory .
# luego abrir http://localhost:8000 en el navegador
```

También puedes abrir directamente el archivo `index.html` desde el explorador de archivos.

**Contribución y licencia**

- **Contribuir:** crea un fork, añade cambios mínimos y abre un Pull Request. Describe el cambio y cómo probarlo.
- **Pruebas:** no hay tests automatizados en este ejercicio (es demo simple).
- **Licencia:** MIT (recomendado). Añade un `LICENSE` si deseas indicar formalmente la licencia.

**Mejoras sugeridas (opcional)**

- Guardar mejor tiempo por tamaño de tablero en `localStorage`.
- Añadir contador de minas restantes y niveles predefinidos (Fácil/Medio/Difícil).
- Botón de reiniciar partida sin regenerar la página.

---

Si quieres, puedo añadir el `LICENSE` (MIT) o preparar el despliegue en GitHub Pages.
