import { formatDate } from '@/shared/utils/formatDate';
import { Box, Tooltip, Typography } from '@mui/material';
import React, { useState, useMemo } from 'react';

interface IProps {
  date: string | number;
}

const DateShower = ({ date }: IProps) => {
  const [isFormatted, setIsFormatted] = useState(true);

  const formattedDate = useMemo(() => {
    if (!date) return 'No date';
    return formatDate(date, true);
  }, [date]);

  const timestamp = useMemo(() => {
    return date ? new Date(date).getTime() : 'Invalid date';
  }, [date]);

  const toggleFormat = () => setIsFormatted((prev) => !prev);

  const displayedDate = useMemo(() => {
    if (!date) return 'No date';
    if (!isFormatted) return timestamp;

    const [datePart, timePart] = formattedDate.split(' ');
    return (
      <>
        {datePart}{' '}
        <Typography
          variant='body2'
          component='span'
          color='white'
          sx={{
            transition: '.3s',
            backgroundColor: 'primary.main',
            p: '2px 5px',
            borderRadius: '5px',
          }}
        >
          {timePart}
        </Typography>
      </>
    );
  }, [date, isFormatted, formattedDate, timestamp]);

  return (
    <Box
      component='span'
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '150px',
        cursor: 'pointer',
      }}
    >
      <Tooltip
        title={`Convert to "${isFormatted ? 'Timestamp' : 'Formatted string'}"`}
        arrow
        disableTouchListener
      >
        <Typography
          variant='body2'
          component='span'
          color={date ? 'text' : 'error'}
          onClick={toggleFormat}
          sx={{
            transition: '.3s',
          }}
        >
          {displayedDate}
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default DateShower;
