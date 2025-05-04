import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSlider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      filter: 'brightness(1.5)', // Reduced from 2 to 1.5
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'brightness(1)',
      zIndex: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        filter: { duration: 0.6 } // Faster transition
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      filter: 'brightness(1.5)', // Reduced from 2 to 1.5
      zIndex: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        filter: { duration: 0.2 } // Faster transition
      }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        ease: 'easeOut'
      }
    })
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.6,
        duration: 0.5,
        type: 'spring',
        stiffness: 400,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      backgroundColor: '#e0c32d',
      transition: {
        duration: 0.3
      }
    }
  };

  // Track slide direction for animations
  const [[page, direction], setPage] = useState([0, 0]);

  // Update page and direction when currentSlide changes
  useEffect(() => {
    const newDirection = page > currentSlide ? -1 : 1;
    setPage([currentSlide, newDirection]);
  }, [currentSlide]);

  // Flash animation effect
  const [isFlashing, setIsFlashing] = useState(false);
  
  // Trigger flash effect when slide changes
  useEffect(() => {
    setIsFlashing(true);
    const timer = setTimeout(() => setIsFlashing(false), 200); // Reduced duration
    return () => clearTimeout(timer);
  }, [page]);

  return (
    <Box sx={{ position: 'relative', height: '600px', overflow: 'hidden' }}>
      {/* Flash overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isFlashing ? 0.5 : 0, // Reduced intensity from 0.7 to 0.5
          transition: { duration: isFlashing ? 0.08 : 0.2 } // Faster transitions
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      />
      
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${slides[page].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Dark overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1
            }}
          />
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ maxWidth: '600px', color: 'white', position: 'relative' }}>
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {slides[page].title}
                </Typography>
              </motion.div>
              
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                <Typography variant="h6" sx={{ mb: 4 }}>
                  {slides[page].description}
                </Typography>
              </motion.div>
              
              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#F2D335',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                  }}
                  component={Link}
                  to={slides[page].buttonLink}
                >
                  {slides[page].buttonText}
                </Button>
              </motion.div>
            </Box>
          </Container>
        </motion.div>
      </AnimatePresence>
      
      {/* Slider Navigation */}
      <Box sx={{ 
        position: 'absolute', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '0 20px', 
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2 
      }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            onClick={goToPrevSlide}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            onClick={goToNextSlide}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </motion.div>
      </Box>
      
      {/* Slide Indicators */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 20, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        display: 'flex', 
        gap: 1,
        zIndex: 2 
      }}>
        {slides.map((_, index) => (
          <motion.div
            key={index}
            onClick={() => setCurrentSlide(index)}
            initial={{ opacity: 0.7 }}
            animate={{ 
              scale: index === page ? 1.2 : 1,
              opacity: index === page ? 1 : 0.7,
            }}
            whileHover={{ scale: 1.3, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: index === page ? '#F2D335' : 'white',
                cursor: 'pointer',
              }}
            />
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default HeroSlider;
