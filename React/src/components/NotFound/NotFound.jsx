import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';

import useStyles from './styles';

const NotFound = () => {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.notFoundDiv}>
        <h2>Page Not Found !!  </h2>
      </div>
    </main>
  );
}

export default NotFound;