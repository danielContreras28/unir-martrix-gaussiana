import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

const App = () => {
  // declaramos un boolean para saber si se puede instalar la PWA
  const [isRealyforInstall, setIsRealyforInstall] = useState<boolean>(false);
  // declaramos un prompt para instalar la PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  // declaramos la matrix de 4 x 4 con valores 0
  const [matrixInput, setMatrixInput] = useState<Array<Array<number | string>>>(
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
  );
  // declaramos un array de objetos html para mostrar los pasos
  const [steps, setSteps] = useState<Array<JSX.Element>>([]);
  // creamos un handler para cambiar el valor de la celda
  const handlerChangeInput = (
    event: ChangeEvent<HTMLInputElement>,
    i: number,
    j: number
  ) => {
    // capturamos el valor del input
    const value = event.target.value;
    // creamos una copia de la matrix
    const newMatrix = [...matrixInput];
    // cambiamos el valor de la celda
    newMatrix[i][j] = value;
    // actualizamos la matrix
    setMatrixInput(newMatrix);
  };

  // creamos un handler para calcular la eliminacion gaussiana
  const handlerCalculate = () => {
    // llamamos a la funcion donde validamos que todo los valores
    const matrix = validDataMatrix(matrixInput);
    const loaderSteps = [];
    const rowCount = matrix.length;
    const colCount = matrix[0].length;
    const scaleFactors = matrix.map((row) =>
      Math.max(...row.slice(0, colCount - 1))
    );

    // guardamos el paso en un array de objetos html
    loaderSteps.push(<p>Matriz inicial:</p>);
    // guardamos la paso en un array de objetos html
    loaderSteps.push(printMatrix(matrix));

    for (let i = 0; i < rowCount; i++) {
      // Encuentra el pivote escalado
      let maxRow = i;
      let maxRatio = Math.abs(matrix[i][i]) / scaleFactors[i];
      for (let k = i + 1; k < rowCount; k++) {
        const ratio = Math.abs(matrix[k][i]) / scaleFactors[k];
        if (ratio > maxRatio) {
          maxRatio = ratio;
          maxRow = k;
        }
      }

      // Intercambia las filas si es necesario
      if (maxRow !== i) {
        [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
        // guardamos el paso en un array de objetos html
        loaderSteps.push(
          <p>{`Intercambiada fila ${i} con fila ${maxRow}:`}</p>
        );
        // guardamos la paso en un array de objetos html
        loaderSteps.push(printMatrix(matrix));
      }

      // Asegúrate de que el pivote no sea cero
      if (matrix[i][i] === 0) {
        // guardamos el paso en un array de objetos html
        loaderSteps.push(
          <p>El pivote es cero, el sistema puede ser singular.</p>
        );
        return;
      }

      // Normaliza la fila del pivote
      const pivot = matrix[i][i];
      matrix[i] = matrix[i].map((value) => value / pivot);
      // guardamos el paso en un array de objetos html
      loaderSteps.push(<p>{`Normalizada fila ${i}:`}</p>);
      // guardamos la paso en un array de objetos html
      loaderSteps.push(printMatrix(matrix));

      // Elimina las filas por debajo del pivote
      for (let j = i + 1; j < rowCount; j++) {
        const factor = matrix[j][i];
        matrix[j] = matrix[j].map((value, k) => value - factor * matrix[i][k]);
        // guardamos el paso en un array de objetos html
        loaderSteps.push(<p>{`Eliminada fila ${j} con fila ${i}:`}</p>);
        // guardamos la paso en un array de objetos html
        loaderSteps.push(printMatrix(matrix));
      }
    }
    // guardamos el paso en un array de objetos html
    loaderSteps.push(<p>Matriz final (forma escalonada):</p>);
    // guardamos la paso en un array de objetos html
    loaderSteps.push(printMatrix(matrix));

    setSteps(loaderSteps);
  };

  const printMatrix = (matrix: Array<Array<number>>): JSX.Element => (
    <div>
      {matrix.map((row, i) => (
        <div key={i} className="fila">
          {row.map((value, j) => (
            <div key={j} className="item">
              {parseFloat(value.toFixed(2))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  // funcion donde validamos que todo los valores de la matrix sean numeros de lo contrario cambiamos el valor de la celda a 0
  const validDataMatrix = (
    matrix: Array<Array<number | string>>
  ): Array<Array<number>> =>
    matrix.map((row) =>
      row.map((col) => (!isNaN(Number(col)) ? Number(col) : 0))
    );

  // funtion for install app
  const installApp = async () => {
    if(deferredPrompt){
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log("user choice", result);
      setDeferredPrompt(null);
      setIsRealyforInstall(false);
    }
  };

  // creamos un Effect para detectar el evento beforeinstallprompt y mostrar el prompt de instalación
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsRealyforInstall(true);
    });
  }, []);

  return (
    <div className="App">
      <div className="container-btn-install-app">
        {/* si es posible instalar la app mostramos el boton */}
        {isRealyforInstall && (
          <button
            className="btn"
            onClick={() => installApp()}
          >
            Instalar App
          </button>
        )}
      </div>
      <div className="container">
        <div className="box">
          <h1>
            Calculadora Eliminación Gaussiana por el método del pivotaje parcial
            escalado
          </h1>
          {/* recoremps la matrix */}
          <div className="matrix">
            {matrixInput.map((row, i) => (
              <div key={i} className="fila">
                {/* recorremos la fila */}
                {row.map((col, j) => (
                  <input
                    key={j}
                    className="input"
                    value={col}
                    onChange={(e) => handlerChangeInput(e, i, j)}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* button que clacula la eliminacion gaussiana */}
          <button className="btn" onClick={handlerCalculate}>
            Calcular
          </button>
        </div>
        <div className="box solution">
          {/* recoremps los pasos */}
          <div className="matrix">
            {steps.length > 0 &&
              steps.map((step, i) => <div key={i}>{step}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
