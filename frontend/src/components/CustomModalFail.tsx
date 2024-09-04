import React from 'react';
import { Modal, Box, Typography, Button, IconButton, Fade, Backdrop } from '@mui/material';
import Fail from '@mui/icons-material/Close';


interface CustomModalProps {
    open: boolean;
    handleClose: () => void;
    mensagem: string;
}

const CustomModalFail: React.FC<CustomModalProps> = ({ open, handleClose, mensagem }) => {
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
                            bgcolor: '#ee222b',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Fail sx={{ fontSize: 58, color: '#fff' }} />
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
                        Falha!
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        {mensagem}
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleClose}
                        sx={{
                            mt: 4,
                            bgcolor: '#ee222b',
                            '&:hover': {
                                bgcolor: '#ee222b',
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

export default CustomModalFail;
