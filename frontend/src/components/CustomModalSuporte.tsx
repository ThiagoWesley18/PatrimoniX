import React from 'react';
import { Modal, Box, Typography, Button, IconButton, Fade, Backdrop } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


interface CustomModalProps {
    open: boolean;
    handleClose: () => void;
}

const CustomModalSuporte: React.FC<CustomModalProps> = ({ open, handleClose}) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 325,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        p: 3,
                        boxShadow: 24,
                        textAlign: 'center',
                        outline: 'none',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '-70px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 95,
                            height: 95,
                            bgcolor: '#82ce34',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 58, color: '#fff' }} />
                    </Box>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            color: 'grey.500',
                        }}
                        onClick={handleClose}
                    >
                        &times;
                    </IconButton>
                    <Typography id="modal-title" variant="h4" component="h2" sx={{ mt: 4 }}>
                        Sucesso!
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        O seu report foi enviado, obrigado por nos ajudar !
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleClose}
                        sx={{
                            mt: 4,
                            bgcolor: '#82ce34',
                            '&:hover': {
                                bgcolor: '#6fb32b',
                            },
                        }}
                    >
                        OK
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
};

export default CustomModalSuporte;
