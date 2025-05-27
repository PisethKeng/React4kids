import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { cardData, drawerData } from '../../../pages/Home/Home';
import OutlinedCard from '../Card/card';

export default function Cardtabs() {
  const [tabIndex, setTabIndex] = useState(0);

  // Mapping of tabs to card IDs
  const tabCardMapping = {
    0: [1, 2],              // Components
    1: [3, 4],              // JSX Syntax
    2: [5, 6],              // Props
    3: [7, 8, 9, 10, 11, 12], // State
    4: [13, 14]             // Routing
  };

  // Filter cards by selected tab
  const getCardsForTab = () => {
    const cardIds = tabCardMapping[tabIndex] || [];
    return cardData.filter(card => cardIds.includes(card.id));
  };

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      {/* Tabs Section */}
      <Box sx={{
        borderBottom: 2,
        borderColor: 'divider',
        border: 'solid #151515 2px',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#3D3B40',
        borderRadius: '2px',
        width: '70%',
        justifySelf: 'center',
        padding: '3px',
        margin: '0 auto',
        marginTop: '2rem'
      }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Components" />
          <Tab label="JSX Syntax" />
          <Tab label="Props" />
          <Tab label="State" />
          <Tab label="Routing" />
        </Tabs>
      </Box>

      {/* Cards Section */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        justifyContent: 'center',
        margin: '2rem auto',
        maxWidth: '1200px',
        padding: '0 1rem'
      }}>
        {getCardsForTab().map((card) => (
          <OutlinedCard
            key={card.id}
            id={card.id}
            title={card.title}
            subtitle={card.subtitle}
            description={card.description}
            button={card.button}
            image={card.image}
            path={card.path}
            drawerData={drawerData[card.drawerDataIndex]}
            video={drawerData[card.drawerDataIndex]}
          />
        ))}
      </Box>
    </>
  );
}
