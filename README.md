# SCADA Simulation System in React

Welcome to the **SCADA Simulation System** repository! This project is designed to provide an educational platform for understanding the basics of SCADA systems using React. It simulates a control system for a beverage industry, focusing on key variables such as **level**, **temperature**, and **pressure**, while also incorporating alarms and sensor failure scenarios.

---

## 🚀 Features

- **Real-time Monitoring**: Visualize the level, temperature, and pressure in real-time using interactive charts.
- **Alarm System**: Alerts for high/low levels, high temperature, high pressure, rapid changes, and sensor failures.
- **Control Panel**: Adjust flow rates and toggle equipment like heaters and pumps.
- **Data Persistence**: Historical data storage with options to reset.
- **Responsive Design**: Modern UI using Material-UI for a seamless experience across devices.

---

## 📊 System Variables

### Level Control

- **Functionality**: Monitors the liquid level in a tank, simulating inflow and outflow.
- **Alarms**:
  - **High Level**: Triggered when the level exceeds 80%.
  - **Low Level**: Triggered when the level drops below 20%.
  - **Rapid Change**: Alerts when the level changes rapidly, indicating potential issues.

### Temperature Control

- **Functionality**: Simulates temperature changes with a heater that can be toggled on/off.
- **Alarms**:
  - **High Temperature**: Triggered when the temperature exceeds 80°C.

### Pressure Control

- **Functionality**: Simulates pressure changes with a pump that can be toggled on/off.
- **Alarms**:
  - **High Pressure**: Triggered when the pressure exceeds 4 bar.

---

## ⚠️ Alarm and Failure Management

- **Sensor Failures**: Simulates random sensor failures with a 1% probability each second.
  - **Level Sensor Failure**: Alerts when the level sensor fails, with an option to reset the sensor.
- **Alarm Notifications**: Visual alerts using Material-UI's Alert component, providing clear and immediate feedback.

---

## 🛠️ Control Panel

- **Flow Rates**: Adjust the inflow and outflow rates to see their impact on the system.
- **Equipment Control**: Toggle the heater and pump to manage temperature and pressure.

---

## 📈 Data Visualization

- **Charts**: Real-time line charts for level, temperature, and pressure using Recharts.
- **Historical Data**: Stores data locally, allowing for trend analysis and reset functionality.

---

## 🖥️ User Interface

- **Modern Design**: Utilizes Material-UI for a clean, contemporary look.
- **Responsive Layout**: Ensures usability across different screen sizes and devices.

---

## 📚 How It Works

1. **Initialization**: The system starts with default values for level, temperature, and pressure.
2. **Real-time Updates**: Variables are updated every second, simulating real-world dynamics.
3. **Alarm Activation**: Alarms are triggered based on predefined thresholds and conditions.
4. **User Interaction**: Users can adjust settings via the control panel to observe changes.
5. **Data Management**: Historical data is stored and can be reset for fresh analysis.

---

## 📝 Getting Started

To run this project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/JoseMendezA/scada-simulation.git
   cd scada-simulation
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Application**:
   ```bash
   npm start
   ```

4. **Open in Browser**: Navigate to `http://localhost:3000` to view the simulation.

---

## 🤝 Contributing

We welcome contributions to enhance this educational tool. Feel free to fork the repository, make changes, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for exploring the SCADA Simulation System! We hope this tool aids in your understanding of SCADA systems and their applications in industrial settings.
