import useCopy from "@/shared/hooks/useCopy";
import { CopyAll } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";

interface IProps {
  ID: string;
  label?: string;
}

const IDKey = ({ ID, label }: IProps) => {
  const copier = useCopy();

  const handleCopy = () => {
    copier(ID);
  };

  return (
    <Tooltip title={`Copy ${label ?? "ID"} "${ID}"`} arrow>
      <Box
        sx={{
          padding: "5px",
          borderRadius: "5px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: ".3s",
          maxWidth: "120px",
          width: "100%",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            "& span": {
              color: "#fff",
            },
          },
        }}
        onClick={handleCopy}
      >
        <Typography
          variant="body2"
          component="span"
          sx={{
            maxWidth: "80px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: ".3s",
            fontSize: "12px",
          }}
        >
          {`${label ?? "ID"}: ${ID}`}
        </Typography>
        <CopyAll
          color="primary"
          sx={{
            fontSize: "20px",
            transition: ".3s",
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default IDKey;
