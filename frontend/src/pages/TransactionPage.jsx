import React, { useState, useEffect } from "react";
import { getChanges } from "../services/api";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TransactionList from "../components/TransactionList";

function TransactionPage() {
  const [changes1, setChanges1] = useState([]);
  const [changes2, setChanges2] = useState([]);
  const [changes3, setChanges3] = useState([]);
  const [changes4, setChanges4] = useState([]);
  const [changes5, setChanges5] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const aquireChanges = async () => {
        try {
          const changes1 = await getChanges(1);
          const changes2 = await getChanges(2);
          const changes3 = await getChanges(3);
          const changes4 = await getChanges(4);
          const changes5 = await getChanges(5);

          setChanges1(changes1);
          setChanges2(changes2);
          setChanges3(changes3);
          setChanges4(changes4);
          setChanges5(changes5);
        } catch (error) {
          console.log(error);
        }
      };
      aquireChanges();
      setIsOpen(true);
    }
  }, [location.state]);

  const handleClose = () => setIsOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <TransactionList />
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sprint 1
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {changes1.map((change) => (
              <li key={change.id}>{change.message}</li>
            ))}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sprint 2
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {changes2.map((change) => (
              <li key={change.id}>{change.message}</li>
            ))}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sprint 3
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {changes3.map((change) => (
              <li key={change.id}>{change.message}</li>
            ))}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sprint 4
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {changes4.map((change) => (
              <li key={change.id}>{change.message}</li>
            ))}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sprint 5
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {changes5.map((change) => (
              <li key={change.id}>{change.message}</li>
            ))}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default TransactionPage;
