// App.js
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Alert,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  // Variables de estado
  const [nivel, setNivel] = useState(50); // Nivel inicial al 50%
  const [temperatura, setTemperatura] = useState(25); // Temperatura inicial en °C
  const [presion, setPresion] = useState(1); // Presión inicial en bar

  const [caudalEntrada, setCaudalEntrada] = useState(5); // Caudal de entrada inicial (L/s)
  const [caudalSalida, setCaudalSalida] = useState(5); // Caudal de salida inicial (L/s)
  const [calentadorEncendido, setCalentadorEncendido] = useState(false); // Calentador
  const [bombaEncendida, setBombaEncendida] = useState(false); // Bomba

  const [dataHistorica, setDataHistorica] = useState(() => {
    const datosGuardados = localStorage.getItem("dataHistorica");
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  });

  const [alarmas, setAlarmas] = useState({
    nivelAlto: false,
    nivelBajo: false,
    temperaturaAlta: false,
    presionAlta: false,
    cambioRapido: false,
    falloSensorNivel: false,
  });

  const [ultimoNivel, setUltimoNivel] = useState(nivel);

  // Simulación de fallos en sensores
  const [sensorNivelFuncionando, setSensorNivelFuncionando] = useState(true);

  // Actualizar variables cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular fallo de sensor de nivel con una probabilidad del 1%
      const probabilidadFallo = Math.random();
      if (probabilidadFallo < 0.01) {
        setSensorNivelFuncionando(false);
      }

      // Actualizar nivel
      setNivel((prevNivel) => {
        if (!sensorNivelFuncionando) {
          return prevNivel; // Mantener el nivel si el sensor falla
        }
        let nuevoNivel = prevNivel + caudalEntrada - caudalSalida;
        if (nuevoNivel > 100) nuevoNivel = 100;
        if (nuevoNivel < 0) nuevoNivel = 0;
        return nuevoNivel;
      });

      // Actualizar temperatura
      setTemperatura((prevTemp) => {
        let nuevaTemp = prevTemp + (calentadorEncendido ? 0.5 : -0.2);
        if (nuevaTemp > 100) nuevaTemp = 100;
        if (nuevaTemp < 0) nuevaTemp = 0;
        return nuevaTemp;
      });

      // Actualizar presión
      setPresion((prevPresion) => {
        let nuevaPresion = prevPresion + (bombaEncendida ? 0.1 : -0.05);
        if (nuevaPresion > 5) nuevaPresion = 5;
        if (nuevaPresion < 0) nuevaPresion = 0;
        return nuevaPresion;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    caudalEntrada,
    caudalSalida,
    calentadorEncendido,
    bombaEncendida,
    sensorNivelFuncionando,
  ]);

  // Monitorizar alarmas y guardar datos históricos
  useEffect(() => {
    // Calcular tasa de cambio de nivel
    const tasaCambioNivel = Math.abs(nivel - ultimoNivel);
    setUltimoNivel(nivel);

    // Actualizar alarmas
    setAlarmas({
      nivelAlto: nivel >= 80,
      nivelBajo: nivel <= 20,
      temperaturaAlta: temperatura >= 80,
      presionAlta: presion >= 4,
      cambioRapido: tasaCambioNivel > 10,
      falloSensorNivel: !sensorNivelFuncionando,
    });

    // Guardar datos históricos
    setDataHistorica((prevData) => {
      const nuevoData = [
        ...prevData,
        {
          time: new Date().toLocaleTimeString(),
          nivel: sensorNivelFuncionando ? nivel : null,
          temperatura,
          presion,
        },
      ];
      localStorage.setItem("dataHistorica", JSON.stringify(nuevoData));
      return nuevoData;
    });
  }, [nivel, temperatura, presion, sensorNivelFuncionando, ultimoNivel]);

  // Función para resetear datos históricos
  const resetData = () => {
    localStorage.removeItem("dataHistorica");
    setDataHistorica([]); // Resetear el estado local
  };

  // Función para restablecer el sensor de nivel
  const resetSensorNivel = () => {
    setSensorNivelFuncionando(true);
  };

  return (
    <div>
      {/* Barra de Navegación */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Simulación SCADA - Control de Nivel en Industria de Bebidas - Dilio
            Méndez
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Contenido Principal */}
      <Grid container spacing={3} style={{ padding: "20px" }}>
        {/* Sección de Gráficas */}
        <Grid item xs={12} md={8}>
          <ProcessChart data={dataHistorica} resetData={resetData} />
        </Grid>

        {/* Sección de Alarmas y Controles */}
        <Grid item xs={12} md={4}>
          <AlarmsPanel alarmas={alarmas} resetSensorNivel={resetSensorNivel} />
          <ControlPanel
            caudalEntrada={caudalEntrada}
            setCaudalEntrada={setCaudalEntrada}
            caudalSalida={caudalSalida}
            setCaudalSalida={setCaudalSalida}
            calentadorEncendido={calentadorEncendido}
            setCalentadorEncendido={setCalentadorEncendido}
            bombaEncendida={bombaEncendida}
            setBombaEncendida={setBombaEncendida}
          />
        </Grid>
      </Grid>
    </div>
  );
}

// Componente de Gráficas
function ProcessChart({ data, resetData }) {
  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={resetData}
        style={{ marginBottom: "20px" }}
      >
        Resetear Datos Históricos
      </Button>

      {/* Gráfica de Nivel del Tanque */}
      <Card>
        <CardContent>
          <Typography variant="h6">Nivel del Tanque</Typography>
          <LineChart width={600} height={200} data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} unit="%" />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="nivel"
              stroke="#8884d8"
              name="Nivel"
              isAnimationActive={false}
              connectNulls
            />
          </LineChart>
        </CardContent>
      </Card>

      {/* Gráfica de Temperatura */}
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6">Temperatura</Typography>
          <LineChart width={600} height={200} data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} unit="°C" />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="temperatura"
              stroke="#ff7300"
              name="Temperatura"
              isAnimationActive={false}
            />
          </LineChart>
        </CardContent>
      </Card>

      {/* Gráfica de Presión */}
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6">Presión</Typography>
          <LineChart width={600} height={200} data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={[0, 5]} unit="bar" />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="presion"
              stroke="#82ca9d"
              name="Presión"
              isAnimationActive={false}
            />
          </LineChart>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Panel de Alarmas
function AlarmsPanel({ alarmas, resetSensorNivel }) {
  return (
    <div>
      <Typography variant="h6">Alarmas</Typography>

      {/* Alarma de Nivel Alto */}
      {alarmas.nivelAlto && (
        <Alert severity="error" style={{ marginTop: "10px" }}>
          Alarma: Nivel Alto en el Tanque
        </Alert>
      )}

      {/* Alarma de Nivel Bajo */}
      {alarmas.nivelBajo && (
        <Alert severity="warning" style={{ marginTop: "10px" }}>
          Alarma: Nivel Bajo en el Tanque
        </Alert>
      )}

      {/* Alarma de Temperatura Alta */}
      {alarmas.temperaturaAlta && (
        <Alert severity="error" style={{ marginTop: "10px" }}>
          Alarma: Temperatura Alta
        </Alert>
      )}

      {/* Alarma de Presión Alta */}
      {alarmas.presionAlta && (
        <Alert severity="error" style={{ marginTop: "10px" }}>
          Alarma: Presión Alta
        </Alert>
      )}

      {/* Alarma de Cambio Rápido */}
      {alarmas.cambioRapido && (
        <Alert severity="warning" style={{ marginTop: "10px" }}>
          Alarma: Cambio Rápido en el Nivel del Tanque
        </Alert>
      )}

      {/* Alarma de Fallo en Sensor de Nivel */}
      {alarmas.falloSensorNivel && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={resetSensorNivel}>
              Restablecer Sensor
            </Button>
          }
          style={{ marginTop: "10px" }}
        >
          Alarma: Fallo en Sensor de Nivel
        </Alert>
      )}

      {/* Sin Alarmas Activas */}
      {!Object.values(alarmas).some((valor) => valor) && (
        <Alert severity="success" style={{ marginTop: "10px" }}>
          No hay alarmas activas.
        </Alert>
      )}
    </div>
  );
}

// Componente de Panel de Control
function ControlPanel({
  caudalEntrada,
  setCaudalEntrada,
  caudalSalida,
  setCaudalSalida,
  calentadorEncendido,
  setCalentadorEncendido,
  bombaEncendida,
  setBombaEncendida,
}) {
  return (
    <div style={{ marginTop: "20px" }}>
      <Typography variant="h6">Panel de Control</Typography>

      {/* Control de Caudales */}
      <Card style={{ marginTop: "10px" }}>
        <CardContent>
          <Typography variant="subtitle1">Caudales</Typography>
          <Grid container spacing={2} style={{ marginTop: "20px" }}>
            <Grid item xs={12}>
              <TextField
                label="Caudal de Entrada (L/s)"
                type="number"
                fullWidth
                value={caudalEntrada}
                onChange={(e) => setCaudalEntrada(Number(e.target.value))}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Caudal de Salida (L/s)"
                type="number"
                fullWidth
                value={caudalSalida}
                onChange={(e) => setCaudalSalida(Number(e.target.value))}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Control de Equipos */}
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="subtitle1">Equipos</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={calentadorEncendido}
                onChange={(e) => setCalentadorEncendido(e.target.checked)}
                color="primary"
              />
            }
            label="Calentador"
          />
          <FormControlLabel
            control={
              <Switch
                checked={bombaEncendida}
                onChange={(e) => setBombaEncendida(e.target.checked)}
                color="primary"
              />
            }
            label="Bomba"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
