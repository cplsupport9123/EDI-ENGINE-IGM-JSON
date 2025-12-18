# IGM to JSON Converter

A modern, web-based utility designed to simplify the process of converting IGM (Import General Manifest) flat files into a structured JSON format and vice-versa. Built with React, Vite, and Material-UI, this tool provides a clean, user-friendly interface for handling shipping manifest data efficiently.



---

## ✨ Key Features

-   **Dual-Format Support:** Seamlessly import and parse both IGM Flat Files (`.txt`, `.igm`) and `.json` files.
-   **Interactive Dashboard:** Displays key voyage details (Voyage Ref, Total Lines, Containers, Weight) in an easy-to-read dashboard.
-   **Detailed Views:** Each Master Bill of Lading and its associated containers are presented in clear, organized cards.
-   **IGM Export:** Convert structured JSON data back into the standard IGM flat file format required for submissions, ensuring accuracy.
-   **Theme Toggle:** Switch between a comfortable Light and a sleek Dark mode.
-   **Responsive Design:** Fully functional on both desktop and mobile devices.
-   **PWA Ready:** Can be "installed" on a desktop or mobile device for a native-like experience.
-   **Help Guide:** An integrated pop-up modal explains the app's functionality to new users.

---

## 🚀 What It Does

This application addresses the common challenge of working with legacy IGM flat file formats. By converting them into a structured JSON, the data becomes easier to read, manipulate, and integrate with other modern systems.

The core functionality revolves around:

1.  **Parsing:** The app reads the specific, delimiter-separated format of an IGM file and maps it to a logical JSON object.
2.  **Visualization:** It then renders this JSON data in a hierarchical and visually intuitive dashboard.
3.  **Re-compilation:** Finally, it can take the JSON data and re-compile it back into the precise string format of an IGM flat file, ready for download and submission.

---

## 🛠️ How to Use

1.  **Import File:**
    -   Click on the central upload area.
    -   Select your `.igm`, `.txt`, or `.json` manifest file from your local system.

2.  **Review Data:**
    -   The app will automatically parse the file and populate the **Voyage Dashboard**.
    -   Review the summary statistics and scroll down to see individual cards for each Master Consignment.

3.  **Export to IGM Format:**
    -   Click the **"Export Parsed Data to IGM Text File"** button.
    -   A correctly formatted `.txt` file will be generated and downloaded to your device.

---

## 💻 Technical Stack

-   **Frontend:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **UI Library:** [Material-UI (MUI)](https://mui.com/)
-   **Styling:** [Emotion](https://emotion.sh/)
-   **File Handling:** [FileSaver.js](https://github.com/eligrey/FileSaver.js/)

---

## 📂 Project Structure

The project follows a standard Vite + React structure:

```
/
├── public/              # Static assets (logo, manifest.json)
├── src/
│   ├── assets/          # Image assets for components
│   ├── components/      # Reusable React components
│   │   ├── Footer.jsx
│   │   ├── HelpModal.jsx
│   │   └── NavBar.jsx
│   ├── App.jsx          # Main application component with core logic
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── .gitignore           # Git ignore file
├── firebase.json        # Firebase hosting configuration
├── index.html           # Main HTML entry file
├── package.json         # Project dependencies and scripts
├── README.md            # You are here!
└── vite.config.js       # Vite configuration
```

---

## ⚙️ Setup and Local Development

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd igm-to-json-converter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## 📦 Build and Deployment

### Building for Production

To create a production-ready build of the application, run:

```bash
npm run build
```

This will generate a `dist` folder containing the optimized static assets.

### Deployment

This project is configured for easy deployment to **Firebase Hosting**.

1.  Ensure you have the Firebase CLI installed (`npm install -g firebase-tools`).
2.  Log in to your Firebase account (`firebase login`).
3.  Run the deployment command:
    ```bash
    firebase deploy --only hosting
    ```

---

## ✍️ Author

Developed by **Debasish Debnath**.
