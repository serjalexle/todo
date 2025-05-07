import { getAllRoles } from "@/shared/api/admin/rolesApi";
import { IRole } from "@/shared/types/role";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

interface IProps {
  handleChange: Dispatch<SetStateAction<IRole | null>>;
  value: IRole | null;
}

const RoleSelector = ({ handleChange, value }: IProps) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly IRole[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleChangeAutocomplete = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: IRole | null
  ) => {
    handleChange(newValue);
  };

  const handleGetRoles = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles({
        count: 100,
        page: 1,
      });
      setOptions(response.result.roles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setOpen(true);
    await handleGetRoles();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <Autocomplete
      sx={{ width: 300 }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      getOptionLabel={(option) => option.name}
      onChange={handleChangeAutocomplete}
      value={value}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default RoleSelector;
