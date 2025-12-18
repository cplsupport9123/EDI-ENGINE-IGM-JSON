import React from 'react';
import { Modal, Box, Typography, Divider, Button, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '70%', md: '600px' },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
    maxHeight: '85vh',
    overflowY: 'auto',
};

const HelpModal = ({ open, handleClose }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="help-modal-title"
            aria-describedby="help-modal-description"
        >
            <Paper sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography id="help-modal-title" variant="h5" component="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        How to Use the IGM Converter
                    </Typography>
                    <Button onClick={handleClose} sx={{ minWidth: 'auto' }}><CloseIcon /></Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6" gutterBottom>What does this app do?</Typography>
                <Typography paragraph>
                    This tool is designed to simplify the process of working with shipping manifests. It can read both <strong>IGM Flat Files</strong> (in <code>.txt</code> or <code>.igm</code> format) and their <strong>JSON</strong> representations. After importing a file, it displays the data in a clear, organized dashboard and allows you to export it back into the IGM Flat File format required for submissions.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>How to Use:</Typography>
                <List>
                    <ListItem>
                        <ListItemIcon><UploadFileIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                            primary="1. Import Your File" 
                            secondary="Click the upload area and select your .igm, .txt, or .json manifest file. The app will automatically parse it." 
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><AssessmentIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                            primary="2. Review the Data" 
                            secondary="Once uploaded, the Voyage Dashboard will show key statistics like total containers and weight. Below, each Master Bill of Lading is displayed in its own card." 
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><DownloadIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                            primary="3. Export to IGM Format" 
                            secondary="After reviewing or if you converted a JSON file, click the 'Export Parsed Data to IGM Text File' button. This will generate and download a correctly formatted .txt file for you." 
                        />
                    </ListItem>
                </List>

                <Box sx={{ mt: 4, textAlign: 'right' }}>
                    <Button variant="contained" onClick={handleClose}>
                        Got it!
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default HelpModal;
