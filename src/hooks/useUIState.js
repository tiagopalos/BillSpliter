import { useState } from 'react';

export const useUIState = () => {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showChart, setShowChart] = useState(false);

  return { showClearModal, setShowClearModal, showChart, setShowChart };
};
