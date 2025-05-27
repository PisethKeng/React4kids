import * as React from 'react';
import Box from '@mui/material/Box';

export default function BoxBasic() {
  return (
    <>
    <div style={{display: 'flex', justifyContent: 'center'}}>
    <Box component="section" sx={{ p: 2, border: '5px solid #F5F5F5', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%', justifyContent: 'center', marginTop: '20px', fontFamily: 'winky-rough'}}>
      <h1>Welcome to React4Kids Website</h1>
      <p style={{ textAlign: 'center', margin: '1rem 0' }}>This is a side project created by a solo developer whose is struggling to learn React.</p>
      <p style={{ textAlign: 'center', margin: '1rem 0' }}>I'm trying to create a website that can help kids learn React</p>
      <p style={{ textAlign: 'center', margin: '1rem 0' }}>I'm also trying to learn how to use MUI with prebuilt components</p>  
    </Box>
    </div>
    </>
  );
}
