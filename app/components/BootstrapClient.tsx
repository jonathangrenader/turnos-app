
'use client';

import { useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function BootstrapClient() {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return null;
}

export default BootstrapClient;
