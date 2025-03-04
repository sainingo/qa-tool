# AMRS QA Tool

## Overview
AMRS QA Tool is a web-based application designed to assist in quality assurance (QA) for the AMPATH Medical Record System (AMRS). It provides users with the ability to run automated tests, analyze data integrity, and ensure compliance with healthcare data standards.

## Features
- **Automated Testing:** Run automated test cases to verify AMRS functionality.
- **Data Integrity Checks:** Validate and ensure accuracy of medical records.
- **User-Friendly Dashboard:** View real-time reports and analysis.
- **Role-Based Access Control (RBAC):** Secure access to test results and system configurations.
- **API Integration:** Connect with AMRS REST API for live data verification.

## Technologies Used
- **Frontend:** React.js (Vite), Carbon Design System
- **Backend:** N/A (Relies on AMRS API)
- **Deployment:** Vercel

## Installation & Setup
### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/your-org/amrs-qa-tool.git
cd amrs-qa-tool
```

### Install Dependencies
```bash
npm install  # or yarn install
```

### Configure Environment Variables
Create a `.env` file in the root directory and add:
```env
VITE_API_URL=https://ngx.ampath.or.ke/amrs/ws/rest/v1
```

### Run the Application Locally
```bash
npm run dev  # or yarn dev
```
The application will be available at `http://localhost:5173/`.

## Deployment
The tool is deployed on **Vercel**.

### Deploy Manually
```bash
vercel deploy
```
Or push to the `main` branch to trigger automatic deployment.

## API Configuration
Since the tool relies on AMRS API, ensure CORS issues are handled by:
- Using a CORS proxy (e.g., `corsproxy.io`)
- Implementing a Vercel API route proxy

## Troubleshooting
### CORS Issues
- Ensure requests are made through `/api/proxy` if using a Vercel proxy.
- Use `corsproxy.io` if direct API calls are blocked.

### Path Resolution Errors
- Ensure import paths match exact casing.
- Add aliasing in `vite.config.js`:
  ```javascript
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  }
  ```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Added new feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

## License
This project is licensed under the **MIT License**.