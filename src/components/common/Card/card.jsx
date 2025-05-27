import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardMedia, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FiYoutube } from "react-icons/fi";
import { FaCode } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

// Navigation for redirection

// Card Data
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function OutlinedCard({ 
  title, 
  subtitle, 
  description, 
  button, 
  image, 
  drawerData,
  id
}) {

  // OutlinedCard component with Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    // Ignore keyboard events for accessibility (e.g., Space, Enter)
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: 2
      }}
    >
      <Card sx={{ maxWidth: 345, width: '100%', height: 350 }}>
        <CardMedia
          
          component="img"
          height="140"
          image={image}
          alt="Card image"
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {subtitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={toggleDrawer(true)}
            sx={{
              '&:hover': {
                backgroundColor: '#FFD700',
                color: 'black'
              }
            }}
          >
            {button}
          </Button>
        </CardActions>
      </Card>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {/* Drawer Opened List */}
        <Box
          sx={{ width: 400, marginTop: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {drawerData && drawerData.length > 0 ? (
              drawerData.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.title || item.drawertitle}
                    secondary={item.description || item.drawerlist}
                  />
                </ListItem>
              ))
            ) : (
              <>
                <ListItem>
                  <ListItemText primary={drawerData?.drawertitle || ''} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary={drawerData?.drawerlist || ''} />
                </ListItem>
              </>
            )}
            <ListItem button onClick={() => window.open(`${drawerData?.path || ''}`, '_blank')} sx={{ display: 'flex', gap: '10px' }}>
              <ListItemText primary={
                id === 1 || id === 3 || id === 5 || id === 13 || id === 15 ? 
                <span style={{ display: 'flex', gap: '10px' }}>
                <IoDocumentTextOutline /> 
                Free Resource Documentation
                </span> :
                drawerData?.title || 
                <span style={{ display: 'flex', gap: '10px' }}>
                <FaCode />
                  Free sample
                </span>
              } />
            </ListItem>
            <ListItem button onClick={() => window.open(`${drawerData?.video || ''}`, '_blank')} sx={{ display: 'flex', gap: '10px' }}>
              <FiYoutube />
              <ListItemText primary={`Free Video Tutorials`} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
