import React, { useState, useMemo } from 'react';
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    Container,
    Box,
    Typography,
    Paper,
    AppBar,
    Toolbar,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    Input,
    Grid,
    Divider,
    IconButton,
    Button,
    Chip,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/Info';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HelpModal from './components/HelpModal';

// --- 1. THEME DEFINITION ---

const getTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: '#d32f2f', // Red
        },
        secondary: {
            main: '#ff9800', // Orange (Used for Export Button)
        },
        background: {
            default: mode === 'dark' ? '#181818' : '#fafafa',
            paper: mode === 'dark' ? '#232323' : '#fff',
        },
        warning: {
            main: '#ffb300',
        },
        info: {
            main: '#29b6f6',
        },
    },
    typography: {
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
});

// --- 2. UI SUB-COMPONENTS (REWRITTEN WITH MUI/SX) ---

const EquipmentTable = ({ equipmentList }) => (
    <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
            📦 Equipment List ({equipmentList.length})
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'action.hover' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'divider' }}>Container ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'divider' }}>Size/Type</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'divider' }}>Seal No.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'divider' }}>VGM (KGS)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {equipmentList.map((eq, i) => (
                        <TableRow key={i}>
                            <TableCell sx={{ fontWeight: 'bold' }}>{eq.eqmtId}</TableCell>
                            <TableCell>{eq.eqmtSize} / {eq.eqmtTyp}</TableCell>
                            <TableCell>{eq.eqmtSealNmbr}</TableCell>
                            <TableCell>{eq.cntrWeight ? eq.cntrWeight.toFixed(2) : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
);

const MBLCard = ({ mc }) => {
    const isStraight = mc.MCRef.consolidatedIndctr === 'S';

    return (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4, bgcolor: 'background.paper' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                        📄 {mc.MCRef.mstrBlNo}
                    </Typography>
                    <Chip
                        label={isStraight ? 'STRAIGHT BILL' : 'CONSOLIDATED'}
                        color={isStraight ? 'success' : 'info'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Type of Package</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>Gross Weight</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ borderBottom: 'none' }}>{mc.trnsprtDocMsr.typsOfPkgs}</TableCell>
                                        <TableCell sx={{ borderBottom: 'none' }}>{mc.trnsprtDocMsr.grossWeight} {mc.trnsprtDocMsr.unitOfWeight}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    <TableRow><TableCell sx={{ color: 'text.secondary', borderBottom: 'none' }}>Consignee</TableCell><TableCell sx={{ borderBottom: 'none' }}>{mc.trnsprtDoc.cnsgnesName?.substring(0, 20)}...</TableCell></TableRow>
                                    <TableRow><TableCell sx={{ color: 'text.secondary', borderBottom: 'none' }}>Packages</TableCell><TableCell sx={{ borderBottom: 'none' }}>{mc.trnsprtDocMsr.nmbrOfPkgs}</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 2, bgcolor: 'info.dark', color: '#fff' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Description:</Typography>
                    <Typography variant="body2">{mc.trnsprtDoc.goodsDescAsPerBl?.substring(0, 100)}...</Typography>
                </Alert>

                {mc.trnsprtEqmt && mc.trnsprtEqmt.length > 0 && (
                    <EquipmentTable equipmentList={mc.trnsprtEqmt} />
                )}
            </CardContent>
        </Card>
    );
};


// --- 3. CORE CONVERSION LOGIC: IGM TEXT -> JSON ---

const parseIGMTextToJSON = (text) => {
    // ... (Existing IGM Text to JSON logic remains the same) ...
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    const json = {
      headerField: {reportingEvent: 'SCE'},
      master: {
        decRef: {rptngEvent: 'SCE'},
        vesselDtls: {},
        voyageDtls: {},
        mastrCnsgmtDec: []
      }
    };
  
    let currentSection = '';
    const mcMap = new Map(); 
  
    lines.forEach(line => {
      const parts = line.split(//); 
      if (line.includes('<manifest>')) return;
      if (line.includes('<vesinfo>')) { currentSection = 'vesinfo'; return; }
      if (line.includes('<cargo>')) { currentSection = 'cargo'; return; }
      if (line.includes('<contain>')) { currentSection = 'contain'; return; }
      if (line.includes('<END-')) { currentSection = ''; return; }
  
      if (line.startsWith('HREC')) {
        json.headerField = {
          ...json.headerField,
          senderID: parts[2],
          receiverID: parts[4],
          versionNo: parts[5],
          indicator: parts[6],
          messageID: parts[7],
          sequenceOrControlNumber: parseInt(parts[8] || 0),
          date: parts[9],
          time: parts[10] ? `T${parts[10].substring(0,2)}:${parts[10].substring(2,4)}` : ''
        };
        json.master.decRef.jobNo = parseInt(parts[8] || 0);
        json.master.decRef.jobDt = parts[9];
      } 
      
      else if (currentSection === 'vesinfo') {
        json.master.decRef = {...json.master.decRef, prtofRptng: parts[1], msgTyp: parts[0]};
        json.master.vesselDtls = {trnsprtMeansId: parts[3], shipTyp: parts[13] || 'GENERAL'};
        json.master.voyageDtls = {cnvnceRefNmbr: parts[5], totalNoOfTrnsprtEqmtMnfsted: 0, totalNmbrOfLines: 0};
        json.master.authPrsn = {sbmtrCd: parts[9]};
      } 
      
            else if (currentSection === 'cargo') {
                const lineNo = parts[7];
                // Convert BL date from ddmmyyyy to yyyymmdd if possible
                let blDate = parts[10];
                if (blDate && blDate.length === 8) {
                    // If format is ddmmyyyy, convert to yyyymmdd
                    blDate = blDate.substring(4,8) + blDate.substring(2,4) + blDate.substring(0,2);
                }
                const mc = {
                    MCRef: {
                        lineNo: parseInt(lineNo),
                        mstrBlNo: parts[9],
                        mstrBlDt: blDate,
                        consolidatedIndctr: 'S', 
                    },
          locCstm: {
            destPrt: parts[26], 
            typOfCrgo: parts[24], 
            natrOfCrgo: parts[23],
            crgoMvmt: parts[25],
          },
          trnsprtDoc: {
            prtOfAcptCdd: parts[11],
            prtOfReceiptCdd: parts[12],
            cnsgnesName: parts[17], 
            cnsgneStreetAddress: parts[18],
            cnsgneCity: parts[19],
            cnsgnePstcd: parts[20],
            cnsgnesCd: parts[40],
            goodsDescAsPerBl: parts[34]
          },
          trnsprtDocMsr: {
            nmbrOfPkgs: parseInt(parts[27] || 0),
            typsOfPkgs: parts[28],
            grossWeight: parseFloat(parts[29] || 0),
            unitOfWeight: parts[30]
          },
          trnshpr: {trnshprBond: parts[38]},
          trnsprtEqmt: []
        };
        mcMap.set(lineNo, mc);
        json.master.mastrCnsgmtDec.push(mc);
      } 
      
      else if (currentSection === 'contain') {
        const linkLineNo = parts[7]; 
        let weight = parseFloat(parts[14] || 0);
        if (weight <= 100) { weight = weight * 1000; } // Convert MT to KGS

        const eq = {
          eqmtSeqNo: parts[12] ? parseInt(parts[12]) : 1,
          eqmtId: parts[9],
          eqmtSealNmbr: parts[10],
          eqmtTyp: 'CN',
          eqmtSize: parts[15],
          eqmtLoadStatus: parts[11],
          cntrAgntCd: parts[11],
          cntrWeight: weight
        };
        if (mcMap.has(linkLineNo)) {
          mcMap.get(linkLineNo).trnsprtEqmt.push(eq);
        }
      }
    });
    json.master.voyageDtls.totalNmbrOfLines = json.master.mastrCnsgmtDec.length;
    let totalEq = 0;
    json.master.mastrCnsgmtDec.forEach(mc => totalEq += mc.trnsprtEqmt.length);
    json.master.voyageDtls.totalNoOfTrnsprtEqmtMnfsted = totalEq;
  
    return json;
};

// --- 4. CORE CONVERSION LOGIC: JSON -> IGM TEXT ---

const convertJSONToIGMText = (data) => {
    // ... (Existing JSON to IGM Text logic remains the same) ...
    const DELIMITER = ''; 
    const NEWLINE = '\n';

    const h = data.headerField;
    const m = data.master;
    const v = m.vesselDtls;
    const voy = m.voyageDtls;
    const d = m.decRef;
    
    let output = '';
    output += `HREC${DELIMITER}ZZ${DELIMITER}${h.senderID}${DELIMITER}ZZ${DELIMITER}${h.receiverID}${DELIMITER}${h.versionNo || 'ICES1_5'}${DELIMITER}${h.indicator || 'P'}${DELIMITER}${DELIMITER}${h.messageID}${DELIMITER}${d.jobNo}${DELIMITER}${h.date}${DELIMITER}${h.time.replace('T', '')}${NEWLINE}`;
    output += `<manifest>${NEWLINE}`;

    // Add <vesinfo> opening tag before vesinfo data
    output += `<vesinfo>${NEWLINE}`;
    const vesinfoParts = [
        d.msgTyp || 'F', d.prtofRptng, '', '', v.trnsprtMeansId, '5LAV6', voy.cnvnceRefNmbr, 'OSL', m.authPrsn?.sbmtrCd || '', 'CAPT.', d.prtofRptng, 'LKCMB', '', '', 'C', '3', v.shipTyp || 'GENERAL', `${h.date} 00:00`, '', 'N', 'N', 'N', 'N', 'N', 'N', d.prtofRptng + 'KKP1'
    ];
    output += vesinfoParts.join(DELIMITER) + NEWLINE;
    output += `<END-vesinfo>${NEWLINE}`;
    
    output += `<cargo>${NEWLINE}`;
    m.mastrCnsgmtDec.forEach(mc => {
        const lineNo = mc.MCRef.lineNo;
        const td = mc.trnsprtDoc;
        const tdm = mc.trnsprtDocMsr;
        const lc = mc.locCstm;

                // Convert BL date from yyyymmdd to ddmmyyyy for IGM text
                let blDate = mc.MCRef.mstrBlDt;
                if (blDate && blDate.length === 8) {
                    // If format is yyyymmdd, convert to ddmmyyyy
                    blDate = blDate.substring(6,8) + blDate.substring(4,6) + blDate.substring(0,4);
                }
                const cargoParts = [
                        d.msgTyp || 'F', d.prtofRptng, v.trnsprtMeansId, '5LAV6', voy.cnvnceRefNmbr, '', '', 
                        lineNo, '0', mc.MCRef.mstrBlNo, blDate, 
                        td.prtOfAcptCdd, td.prtOfReceiptCdd, '', '', 
                        td.cnsgnrsName, td.cnsgneStreetAddress, td.cnsgneCity, td.cnsgnePstcd, td.cnsgnesName, 
                        td.cnsgneStreetAddress, td.cnsgneCity, td.cnsgnePstcd, 
                        lc.natrOfCrgo || 'C', lc.itemTyp || 'OT', lc.crgoMvmt || 'LC', lc.destPrt, 
                        tdm.nmbrOfPkgs, tdm.typsOfPkgs, tdm.grossWeight.toFixed(3), tdm.unitOfWeight, 
                        '', '', tdm.marksNoOnPkgs, td.goodsDescAsPerBl, 
                        'ZZZZZ', 'ZZZ', mc.trnshpr?.trnshprBond || '', '', 'R', m.authPrsn?.sbmtrCd
                ];
                output += cargoParts.join(DELIMITER) + NEWLINE;
    });
    output += `<END-cargo>${NEWLINE}`;

    output += `<contain>${NEWLINE}`;
    m.mastrCnsgmtDec.forEach(mc => {
        mc.trnsprtEqmt.forEach(eq => {
            const weightInMT = eq.cntrWeight / 1000;

            const containParts = [
                d.msgTyp || 'F', d.prtofRptng, v.trnsprtMeansId, '5LAV6', voy.cnvnceRefNmbr, '', '', 
                mc.MCRef.lineNo, '0', eq.eqmtId, eq.eqmtSealNmbr, m.authPrsn?.sbmtrCd || '', 
                eq.eqmtLoadStatus, '1', weightInMT.toFixed(2), eq.eqmtSize, eq.socFlag || 'N'
            ];
            output += containParts.join(DELIMITER) + NEWLINE;
        });
    });
    output += `<END-contain>${NEWLINE}`;
    // Add <END-manifest> after <END-contain>
    output += `<END-manifest>${NEWLINE}`;
    output += `TREC${DELIMITER}${d.jobNo}`;
    
    return output;
};

// --- 5. DOWNLOAD HANDLER ---

const downloadIGMText = (igmContent, jobNo) => {
    const blob = new Blob([igmContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SGM_EXPORT_${jobNo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


// --- 6. MAIN APPLICATION COMPONENT (Corrected MUI Structure) ---

const App = () => {
    const [themeMode, setThemeMode] = useState('dark');
    const theme = getTheme(themeMode);
    const [manifestData, setManifestData] = useState(null);
    const [error, setError] = useState(null);
    const [fileType, setFileType] = useState('');
    const [helpOpen, setHelpOpen] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileType(file.name);
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const content = e.target.result;
            try {
                let json;
                if (content.trim().startsWith('{')) {
                    json = JSON.parse(content);
                } else if (content.includes('HREC') || content.includes('<manifest>')) {
                    json = parseIGMTextToJSON(content);
                } else {
                    throw new Error("Unknown file format");
                }
                
                setManifestData(json);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(`Failed to parse file. Ensure it is valid JSON or standard IGM Flat File format. Details: ${err.message}`);
                setManifestData(null);
            }
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        if (!manifestData) return;
        try {
            const igmText = convertJSONToIGMText(manifestData);
            downloadIGMText(igmText, manifestData.master.decRef.jobNo);
        } catch (err) {
            console.error(err);
            setError(`Failed to export file. Details: ${err.message}`);
        }
    };

    const totals = useMemo(() => {
        if (!manifestData) return { containers: 0, weight: 0 };

        let totalContainers = 0;
        let totalWeight = 0;

        manifestData.master.mastrCnsgmtDec.forEach(mc => {
            if (mc.trnsprtEqmt) {
                totalContainers += mc.trnsprtEqmt.length;
                mc.trnsprtEqmt.forEach(eq => {
                    if (eq.cntrWeight) {
                        totalWeight += eq.cntrWeight;
                    }
                });
            }
        });

        return { containers: totalContainers, weight: totalWeight };
    }, [manifestData]);


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar themeMode={themeMode} setThemeMode={setThemeMode} />
            <Box sx={{ minHeight: '70vh', bgcolor: 'background.default' }}>
                <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 5 } }}>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={10} lg={8}>
                            <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 4, borderRadius: 3, boxShadow: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'primary.dark' }}>
                                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                    <UploadFileIcon color="primary" sx={{ fontSize: 48 }} />
                                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', fontSize: { xs: 22, sm: 32 } }}>
                                        Supports <b>JSON</b> and <b>IGM Flat File</b> formats for import and export.
                                    </Typography>
                                    <Input
                                        type="file"
                                        inputProps={{ accept: '.json,.txt,.igm' }}
                                        onChange={handleFileUpload}
                                        sx={{ width: '100%', color: 'primary.main', bgcolor: 'background.default', borderRadius: 2, p: 1, border: '1px solid', borderColor: 'primary.main' }}
                                    />
                                    {fileType && <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Selected: {fileType}</Typography>}
                                    {error && <Alert severity="error" sx={{ width: '100%' }}>⚠️ {error}</Alert>}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                    {manifestData && (
                        <>
                            <Grid container spacing={4} justifyContent="center">
                                <Grid item xs={12} md={10} lg={8}>
                                    <Box sx={{ textAlign: 'right', mb: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            startIcon={<UploadFileIcon />}
                                            onClick={handleExport}
                                            sx={{ fontWeight: 600, borderRadius: 2, boxShadow: 2 }}
                                        >
                                            ⬇️ Export Parsed Data to IGM Text File
                                        </Button>
                                    </Box>
                                    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 4, bgcolor: 'background.paper' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <InfoIcon color="info" /> Voyage Dashboard
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', borderLeft: '5px solid', borderColor: 'primary.main', boxShadow: 1, color: 'text.primary' }}>
                                                        <Typography variant="body2" color="text.secondary">Voyage Ref</Typography>
                                                        <Typography variant="h6" color="primary" fontWeight={700}>{manifestData.master.voyageDtls.cnvnceRefNmbr}</Typography>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', borderLeft: '5px solid', borderColor: 'secondary.main', boxShadow: 1, color: 'text.primary' }}>
                                                        <Typography variant="body2" color="text.secondary">Total Lines</Typography>
                                                        <Typography variant="h6" color="secondary" fontWeight={700}>{manifestData.master.voyageDtls.totalNmbrOfLines}</Typography>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', borderLeft: '5px solid', borderColor: 'warning.main', boxShadow: 1, color: 'text.primary' }}>
                                                        <Typography variant="body2" color="text.secondary">Total Containers</Typography>
                                                        <Typography variant="h6" color="warning.main" fontWeight={700}>{totals.containers}</Typography>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', borderLeft: '5px solid', borderColor: 'info.main', boxShadow: 1, color: 'text.primary' }}>
                                                        <Typography variant="body2" color="text.secondary">Total Weight (KGS)</Typography>
                                                        <Typography variant="h6" color="info.main" fontWeight={700}>{totals.weight.toFixed(2)}</Typography>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={10} lg={8}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AssignmentIcon color="primary" /> Master Consignments
                                    </Typography>
                                    {manifestData.master.mastrCnsgmtDec.map((mc, index) => (
                                        <MBLCard key={index} mc={mc} />
                                    ))}
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Container>
            </Box>
            <Footer setHelpOpen={setHelpOpen} />
            <HelpModal open={helpOpen} handleClose={() => setHelpOpen(false)} />
        </ThemeProvider>
    );
};

export default App;