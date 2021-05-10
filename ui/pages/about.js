import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const Index = () => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <div>
        <Typography variant="h3">
          Club Autonomo y decentralizado
        </Typography>
        <Typography variant="h6">
          Aca habria que escribir algo
        </Typography>
      </div>
      <Link href="/">
        <a className={classes.text}>Home</a>
      </Link>
    </main>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    width: '100%',
    margin: '100px auto',
    maxWidth: 1100,
    textAlign: 'center'
  },
  text: {
    fontSize: 18
  }
}));

export default Index;
