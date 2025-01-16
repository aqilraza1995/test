import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";

interface Modal {
  open: boolean;
  title: string;
  onClick: () => void;
  handleClose: () => void;
  children: React.ReactNode;
}

const CustomModal: FC<Modal> = ({
  open,
  title,
  onClick,
  handleClose,
  children,
}) => {
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onClick} type="submit">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomModal;
