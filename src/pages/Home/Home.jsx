import React from 'react'
import BoxBasic from '../../components/muibox'
import TemporaryDrawer from '../../components/common/Drawer/drawer'
import OutlinedCard from '../../components/common/Card/card'
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { Box, Drawer } from '@mui/material';
import CardTabs from '../../components/common/Card/cardtabs'
import { useState } from 'react';
import ResponsiveAppBar from '../../components/common/Navbar/navbar'
import Footer from '../../components/common/Footer/footer'
import { pagePath } from '../../samples/samplepath'


// Card Data
export const cardData = [
  {
    id: 1,
    title: 'How Does React Hooks Work?',
    subtitle: 'adjective',
    description: 'Understand the usage of React Hook',
    buttonText: 'Learn More',
    image: '/reacthook.jpg',
    button: 'Explore',
    path: 'https://legacy.reactjs.org/docs/hooks-intro.html',
    drawerDataIndex: 0
  },
  {
    id: 2,
    title: 'Example of React Hooks',
    subtitle: 'noun',
    description: 'A collection of React Hooks',
    buttonText: 'Explore',
    image: '/reacthook.jpg',
    button: 'Explore',
    path: '',
    drawerDataIndex: 1
  },
  {
    id: 3,
    title: 'JSX Syntax',
    subtitle: 'noun',
    description: 'HTML-like syntax used in React components.',
    buttonText: 'Explore',
    image: '/JSX.png',
    button: 'Explore',
    path: '',
    drawerDataIndex: 2
  },
  {
    id: 4,
    title: 'Example of JSX syntax',
    subtitle: 'noun',
    description: 'A collection of JSX syntax',
    buttonText: 'Explore',
    image: '/JSX.png',
    button: 'Explore',
    path: '',
    drawerDataIndex: 3
  },
  {
    id: 5,
    title: 'Props',
    subtitle: 'noun',
    description: 'Used to pass data from a parent component to a child component.',
    buttonText: 'Explore',
    image: '/reacthook.jpg',
    button: 'Explore',
    path: '',
    drawerDataIndex: 4
  },
  {
    id: 6,
    title: 'Example Of Props',
    subtitle: 'noun',
    description: 'A collection of Props',
    buttonText: 'Explore',
    image: '/reacthook.jpg',
    button: 'Explore',
    path: '',
    drawerDataIndex: 5
  },
  {
    id: 7,
    title: 'useEffect Hook',
    subtitle: 'side effect',
    description: 'Performs side effects in function components.',
    buttonText: 'Read More',
    image: '/reacthook.jpg',
    button: 'Explore',
    path: '',
    drawerDataIndex: 6
  },
  {
    id: 8,
    title: 'useState Hook',
    subtitle: 'state',
    description: 'Used to manage the current state of the component.',
    buttonText: 'Learn More',
    image: '/reacthook.jpg',
    button: 'Explore',
    path: '',
    drawerDataIndex: 7
  },
  {
    id: 9,
    title: 'useContext Hook',
    subtitle: 'context',
    description: 'Used to share values between components.',
    buttonText: 'Learn More',
    image: '/reacthook.jpg',
    button: 'Explore',
    path: '',
    drawerDataIndex: 8
  },
  {
    id: 10,
    title: 'useReducer Hook',
    subtitle: 'reducer',
    description: 'Used to manage the current state of the component.',
    buttonText: 'Learn More',
    image: '/reacthook.jpg',  
    button: 'Explore',
    path: '',
    drawerDataIndex: 9
  },
  {
    id: 11,
    title: 'useCallback Hook',
    subtitle: 'callback',
    description: 'Used to memoize callback functions.',
    buttonText: 'Learn More',
    image: '/reacthook.jpg',
    button: 'Explore',
    path: '',
    drawerDataIndex: 10
  },
  {
    id: 12,
    title: 'useTransition Hook',
    subtitle: 'transition',
    description: 'Used to manage the current state of the component.',
    buttonText: 'Learn More',
    image: '/reacthook.jpg',  
    button: 'Explore',
    path: '',
    drawerDataIndex: 11
  },
  {
    id: 13,
    title: 'React Routing',
    subtitle: 'routing',
    description: 'Used to navigate between different pages.',
    buttonText: 'Learn More',
    image: '/reactrouter.svg',
    button: 'Explore',
    path: '',
    drawerDataIndex: 12
  },
  {
    id: 14,
    title: 'How React Routing Works',
    subtitle: 'routing',
    description: 'Used to navigate between different pages.',
    buttonText: 'Learn More',
    image: '/reactrouter.svg',
    button: 'Explore',
    path: '',
    drawerDataIndex: 13
  }
];

// List of Items for drawer Data

export const drawerData = [
  {
    drawertitle: 'How does React Hook works?',
    drawerlist: 'React Hooks are functions provided by React that let you use state and other React features in functional components, without needing to write class components',
    path: 'https://legacy.reactjs.org/docs/hooks-intro.html',
    video: 'https://www.youtube.com/watch?v=1VVfMVQabx0'
  },
  {
    drawertitle: 'Example of React Hooks',
    path: '',
    video: '',
  },
  {
    drawertitle: 'JSX Syntax',
    drawerlist: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your React components.',
    path: 'https://www.w3schools.com/react/react_jsx.asp',
    video: 'https://www.youtube.com/watch?v=7fPXI_MnBOY&t=3s'
  },

  {
    drawertitle: 'Example of JSX Syntax',
    path: '',
    video: 'https://www.youtube.com/watch?v=jr5MJYB2gzM'
  },
  {
    drawertitle: 'Props',
    drawerlist: 'Props are used to pass data from a parent component to a child component.',
    path: 'https://legacy.reactjs.org/docs/components-and-props.html',
    video: 'https://www.youtube.com/watch?v=uvEAvxWvwOs&t=256s'
  },
  {
    drawertitle: 'Example of Props',
    path: '',
    video: ''
  },
  {
    drawertitle: 'useEffect Hook',
    drawerlist: 'useEffect is a Hook that lets you perform side effects in function components.',
    path: pagePath.useEffect,
    video: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U&t=693s'
  },

  {
    drawertitle: 'useState Hook',
    drawerlist: 'useState is a Hook that lets you add React state to function components.',
    path: pagePath.useState,
    video: 'https://www.youtube.com/watch?v=O6P86uwfdR0'
  },

  {
    drawertitle: 'useContext Hook',
    drawerlist: 'useContext is a Hook that lets you share values between components.',
    path: pagePath.useContext,
    video: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc'
  },

  {
    drawertitle: 'useReducer Hook',
    drawerlist: 'useReducer is a Hook that lets you add React state to function components.',
    path: pagePath.useReducer,
    video: 'https://www.youtube.com/watch?v=kK_Wqx3RnHk'
  },
  {
    drawertitle: 'useCallback Hook',
    drawerlist: 'useCallback is a Hook that lets you memoize callback functions.',
    path: pagePath.useCallback,
    video: 'https://www.youtube.com/watch?v=_AyFP5s69N4&t=46s'
  },
  {
    drawertitle: 'useTransition Hook',
    drawerlist: 'useTransition is a Hook that lets you add React state to function components.',
    path: pagePath.useTransition,
    video: 'https://www.youtube.com/watch?v=N5R6NL3UE7I'
  }, 
  {
    drawertitle: 'React Routing',
    drawerlist: 'React Router is a standard library for routing in React.',
    path: 'https://reactrouter.com/',
    video: 'https://www.youtube.com/watch?v=h7MTWLv3xvw'
  },
  {
    drawertitle: 'How React Routing Works',
    drawerlist: '',
    path: pagePath.reactRouting,
    video: 'https://www.youtube.com/watch?v=Ul3y1LXxzdU'
  }
  // {
  //   drawertitle: 'Example of React Routing',
  //   path: 'https://reactrouter.com/',
  //   video: 'https://www.youtube.com/watch?v=c02YoWR9gSY&t=157s'
  // }
]

// List Items sample Data
const listData = [
  {
    primary: 'Components',
    secondary: 'React apps are built using components, which are reusable, self-contained blocks of UI.',
    path: '/hooks'
  },
  {
    primary: 'JSX Syntax',
    secondary: 'JSX lets you write HTML-like syntax directly in your JavaScript code.',
    path: '/jsx'
  },
  {
    primary: 'Props(Properties)',
    secondary: 'Props are used to pass data from a parent component to a child component.',
    path: '/useeffect'
  },
  {
    primary: 'State',
    secondary: 'State is used to manage dynamic data inside a component.',
    path: '/usestate'
  },
];


const Home = () => {
  return (
    <>
     {/* Nav Bar */}
     

     {/* Main Page */}
      <div style={{
      
        height: 'auto',
        margin: '0 auto',
        width: '90%',
        fontSize: '20px',
        color: '#F7F7F7',
        padding: '2rem 0'
      }}>

        <BoxBasic />
        
        {/* Drawer Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
          marginBottom: '2rem'
        }}>
          <TemporaryDrawer />
        </div>

        {/* Introduction */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '3rem',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '1rem'
          }}>React Core Concepts</h2>
          <p style={{
            fontSize: '1.2rem',
            textAlign: 'center',
            margin: '1rem 0',
            maxWidth: '800px',
            lineHeight: '1.6',
            color: '#d9d9d9'
          }}>Explore the fundamental concepts of React and learn how to build modern, efficient web applications with ease.</p>
        </div>

        {/* List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '2rem',
          marginLeft: '2rem',
          marginRight: '2rem',
          borderRadius: '10px',
          padding: '1rem'
        }}>
          {/* Heading */}
          <h3 style={{
            color: '#fff',
            marginBottom: '1rem',
            borderBottom: '2px solid #fff',
            paddingBottom: '0.5rem',
            justifyContent: 'center',
            textAlign: 'center',
            display: 'flex'
          }}>React Core Concepts</h3>
          {listData.map((data, index) => (
            <Link to={data.path} key={index} style={{
              textDecoration: 'none',
              color: '#fff'
            }}>
              <List sx={{
                backgroundColor: '#3D3B40',
                borderRadius: '5px',
                marginBottom: '0.5rem',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}>
                <ListItem sx={{
                  padding: '1rem'
                }}>
                  <ListItemText 
                    primary={data.primary}
                    primaryTypographyProps={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }} 
                    secondary={data.secondary} 
                    secondaryTypographyProps={{
                      fontSize: '1rem',
                      color: '#888'
                    }}  
                  />
                </ListItem>
              </List>
            </Link>
          ))}
        </div>

        <Divider sx={{ 
          margin: '3rem 1rem', 
          borderColor: '#444',
          borderBottomWidth: 2
        }}/>

        {/* Tabs Navigation */}
        <CardTabs />

        {/* Continue Here */}
      </div>
      <Footer></Footer>
    </>
  )
}

export default Home
