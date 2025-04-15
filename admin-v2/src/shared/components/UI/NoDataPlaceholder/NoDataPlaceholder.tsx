import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { FilterAltOff } from "@mui/icons-material";
import { IFilterQuery } from "@/shared/types/common";

interface NoDataPlaceholderProps {
  filterQuery: IFilterQuery;
  clearFilters: () => void;
  removeFilter: (key: keyof IFilterQuery) => void;
}

const NoDataPlaceholder = ({
  filterQuery,
  clearFilters,
  removeFilter,
}: NoDataPlaceholderProps) => {
  const filterEntries = Object.entries(filterQuery)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => {
      return !!value && (Array.isArray(value) ? value.length : true);
    });

  return (
    <Box
      sx={{
        width: "100%",
        py: 5,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Typography variant="h6" gutterBottom>
        No results found for the current filters
      </Typography>

      {filterEntries.length > 0 ? (
        <>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 2, mb: 2 }}
          >
            {filterEntries.map(([key, value]) => (
              <Chip
                key={key}
                label={`${key}: ${
                  Array.isArray(value) ? value.join(", ") : value
                }`}
                onDelete={() => removeFilter(key)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
          <Button
            onClick={clearFilters}
            startIcon={<FilterAltOff />}
            variant="outlined"
            color="error"
            sx={{ mt: 1 }}
          >
            Clear all filters
          </Button>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      )}
    </Box>
  );
};

export default NoDataPlaceholder;
