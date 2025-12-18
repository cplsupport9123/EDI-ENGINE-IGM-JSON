# -----------------------------


# -----------------------------


# -----------------------------
# Create Project Structure
# -----------------------------
Write-Host "Creating folders..." -ForegroundColor Cyan

New-Item -ItemType Directory -Path "src/components" -Force
New-Item -ItemType Directory -Path "src/utils" -Force

# -----------------------------
# Create converter.js
# -----------------------------
Write-Host "Writing converter.js..." -ForegroundColor Cyan

@"
export const igmToJson = (igmText) => {
  const json = {
    headerField: {
      senderID: "AAACO2555KCSA009",
      receiverID: "INCCU1",
      versionNo: "SCE1102",
      indicator: "P",
      messageID: "SACHM22",
      sequenceOrControlNumber: 1,
      date: "",
      time: "",
      reportingEvent: "SCE"
    },
    master: {
      decRef: { msgTyp: "F", prtofRptng: "", jobNo: null, jobDt: "", rptngEvent: "" },
      authPrsn: { sbmtrTyp: "", sbmtrCd: "", authReprsntvCd: "" },
      vesselDtls: { modeOfTrnsprt: "", typOfTrnsprtMeans: "", trnsprtMeansId: "" },
      voyageDtls: { cnvnceRefNmbr: "", totalNoOfTrnsprtEqmtMnfsted: null, totalNmbrOfLines: null },
      mastrCnsgmtDec: []
    }
  };

  const lines = igmText.split("\n");
  let cargoStart = false, containStart = false, vesinfoStart = false;

  lines.forEach((line) => {
    const parts = line.split("");

    if (line.startsWith("HREC")) {
      json.headerField.date = parts[8] || "";
      json.headerField.time = parts[9] ? `T${parts[9].slice(0,4)}` : "";
    }

    if (line.startsWith("<cargo>")) cargoStart = true;
    if (line.startsWith("<END-cargo>")) cargoStart = false;

    if (cargoStart && line.startsWith("F")) {
      json.master.mastrCnsgmtDec.push({
        MCRef: {
          lineNo: parseInt(parts[6]),
          mstrBlNo: parts[7],
          mstrBlDt: parts[8]
        },
        trnsprtEqmt: []
      });
    }

    if (line.startsWith("<contain>")) containStart = true;
    if (line.startsWith("<END-contain>")) containStart = false;

    if (containStart && line.startsWith("F")) {
      const eq = {
        eqmtSeqNo: parseInt(parts[6]),
        eqmtId: parts[7],
        eqmtSealNmbr: parts[8],
        eqmtLoadStatus: parts[9],
        eqmtSize: parts[10],
        cntrAgntCd: parts[11]
      };

      if (json.master.mastrCnsgmtDec.length)
        json.master.mastrCnsgmtDec[json.master.mastrCnsgmtDec.length - 1].trnsprtEqmt.push(eq);
    }
  });

  return json;
};

export const jsonToIgm = (json) => {
  let igm = "";

  igm += `HRECZZ${json.headerField.senderID}ZZ${json.headerField.receiverID}ICES1_5${json.headerField.indicator}${json.headerField.messageID}${json.headerField.sequenceOrControlNumber}${json.headerField.date}${json.headerField.time}\n`;

  igm += "<manifest>\n<vesinfo>\n";
  igm += "<END-vesinfo>\n<cargo>\n";

  json.master.mastrCnsgmtDec.forEach((mc) => {
    igm += `F${mc.MCRef.lineNo}${mc.MCRef.mstrBlNo}${mc.MCRef.mstrBlDt}\n`;
  });

  igm += "<END-cargo>\n<contain>\n";

  json.master.mastrCnsgmtDec.forEach((mc) => {
    mc.trnsprtEqmt.forEach((eq) => {
      igm += `F${eq.eqmtSeqNo}${eq.eqmtId}${eq.eqmtSealNmbr}${eq.eqmtLoadStatus}${eq.eqmtSize}${eq.cntrAgntCd}\n`;
    });
  });

  igm += "<END-contain>\n<END-manifest>\n";

  return igm;
};
"@ | Set-Content -Path "src/utils/converter.js"


# -----------------------------
# Create FileUploader.jsx
# -----------------------------
Write-Host "Writing FileUploader.jsx..." -ForegroundColor Cyan

@"
import React, { useState } from "react";
import { igmToJson, jsonToIgm } from "../utils/converter";
import { Button, Typography, Stack } from "@mui/material";
import { saveAs } from "file-saver";

const FileUploader = () => {
  const [output, setOutput] = useState("");

  const handleFile = async (e, type) => {
    const file = e.target.files[0];
    const text = await file.text();

    let result = "";
    if (type === "igmToJson") {
      result = JSON.stringify(igmToJson(text), null, 2);
    } else {
      const json = JSON.parse(text);
      result = jsonToIgm(json);
    }

    setOutput(result);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "converted_output.txt");
  };

  return (
    <Stack spacing={3} sx={{ p: 4 }}>
      <Typography variant="h5">IGM ↔ JSON Converter</Typography>

      <Typography>Select IGM File:</Typography>
      <input type="file" accept=".igm,.txt" onChange={(e) => handleFile(e, "igmToJson")} />

      <Typography>Select JSON File:</Typography>
      <input type="file" accept=".json" onChange={(e) => handleFile(e, "jsonToIgm")} />

      <Button variant="contained" onClick={downloadOutput} disabled={!output}>
        Download Output
      </Button>

      <textarea
        style={{ width: "100%", height: "300px" }}
        value={output}
        readOnly
      ></textarea>
    </Stack>
  );
};

export default FileUploader;
"@ | Set-Content -Path "src/components/FileUploader.jsx"


# -----------------------------
# Update App.jsx
# -----------------------------
Write-Host "Writing App.jsx..." -ForegroundColor Cyan

@"
import React from "react";
import FileUploader from "./components/FileUploader";
import { CssBaseline, Container } from "@mui/material";

function App() {
  return (
    <Container maxWidth="md">
      <CssBaseline />
      <FileUploader />
    </Container>
  );
}

export default App;
"@ | Set-Content -Path "src/App.jsx"

Write-Host "`nProject setup complete!"
Write-Host "Run the app with: npm run dev" -ForegroundColor Green
