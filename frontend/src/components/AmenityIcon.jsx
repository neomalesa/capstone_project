import React from 'react';

const AmenityIcon = ({ name }) => {
  const normalizedName = name.toLowerCase();

  // Airbnb style SVG configurations
  const svgProps = {
    viewBox: "0 0 32 32",
    fill: "currentColor",
    style: { display: 'block', height: '24px', width: '24px', flexShrink: 0 }
  };

  switch (normalizedName) {
    case 'kitchen':
      return (
        <svg {...svgProps}>
          <path d="M24 2a4 4 0 0 1 4 4v9h-2V6a2 2 0 0 0-2-2h-3v26h-2V2zM12 2v28h-2V16H4V6a4 4 0 0 1 4-4h4zm-2 2H8a2 2 0 0 0-2 2v10h4V4z"></path>
        </svg>
      );
    case 'dedicated workspace':
    case 'workspace':
      return (
        <svg {...svgProps}>
          <path d="M28 21v7h-2v-5H6v5H4v-7a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2zM14 6h4v8h-4V6zm-5 4a3 3 0 0 1 3-3h1v8H9v-5zm14 5v-8h-1a3 3 0 0 0-3 3v5h4z"></path>
          <path d="M6 17h20v2H6z"></path>
        </svg>
      );
    case 'pool':
      return (
        <svg {...svgProps}>
          <path d="M2 20s2.67-1.5 6-1.5 6 1.5 6 1.5 2.67 1.5 6 1.5 6-1.5 6-1.5v2s-2.67 1.5-6 1.5-6-1.5-6-1.5-2.67-1.5-6-1.5S2 22 2 22v-2zm0 6s2.67-1.5 6-1.5 6 1.5 6 1.5 2.67 1.5 6 1.5 6-1.5 6-1.5v2s-2.67 1.5-6 1.5-6-1.5-6-1.5-2.67-1.5-6-1.5S2 28 2 28v-2z"></path>
          <path d="M10 2H8v14h2V2zm14 0h-2v14h2V2zm-2 6h-8V6h8v2zm0 6h-8v-2h8v2z"></path>
        </svg>
      );
    case 'elevator':
      return (
        <svg {...svgProps}>
          <path d="M24 2H8a4 4 0 0 0-4 4v20a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4zM15 28H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7v24zm11-2a2 2 0 0 1-2 2h-7V4h7a2 2 0 0 1 2 2v20z"></path>
          <path d="M10.29 18.29L11.71 16.88 10 15.17V26H8V15.17l-1.71 1.71-1.41-1.41L8.5 11.83l3.62 3.63L10.29 18.29zM25.41 15.17l1.71-1.71 1.41 1.41L24.91 18.5l-3.62-3.63 1.41-1.41L24.41 15.17V4.33h2v10.84z"></path>
        </svg>
      );
    case 'wifi':
      return (
        <svg {...svgProps}>
          <path d="M16 26a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
          <path d="M16 16c-2.43 0-4.72.84-6.52 2.39L8.14 17A10.96 10.96 0 0 1 16 14c3 0 5.8 1.1 7.86 3l-1.34 1.39A8.96 8.96 0 0 0 16 16zm0-6C10.74 10 5.86 11.85 2.1 14.9L.77 13.51A18.94 18.94 0 0 1 16 8c5.78 0 11.11 2.06 15.23 5.51l-1.33 1.39A16.94 16.94 0 0 0 16 10zm0-6C8.84 4 2.22 6.57-2.6 11.12l-1.37-1.44C1.3 4.7 8.35 2 16 2c7.65 0 14.7 2.7 19.97 7.68l-1.37 1.44C29.78 6.57 23.16 4 16 4z"></path>
        </svg>
      );
    case 'free parking on premises':
    case 'free parking':
      return (
        <svg {...svgProps}>
          <path d="M26 14v-1.5A3.5 3.5 0 0 0 22.5 9h-13A3.5 3.5 0 0 0 6 12.5V14a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2v3h2v-3h16v3h2v-3a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM8 12.5A1.5 1.5 0 0 1 9.5 11h13a1.5 1.5 0 0 1 1.5 1.5V14H8v-1.5zM26 23H6v-7h20v7z"></path>
          <path d="M9.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM22.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
        </svg>
      );
    case 'tv':
      return (
        <svg {...svgProps}>
          <path d="M28 6H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9v3h-3v2h12v-2h-3v-3h9a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm0 16H4V8h24v14z"></path>
        </svg>
      );
    case 'washer':
      return (
        <svg {...svgProps}>
          <path d="M24 2H8a4 4 0 0 0-4 4v20a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4zm2 24a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v20z"></path>
          <path d="M16 24a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-12a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM10 7h2v2h-2zM14 7h2v2h-2zM20 7h2v2h-2z"></path>
        </svg>
      );
    case 'carbon monoxide alarm':
      return (
        <svg {...svgProps}>
          <path d="M28 6v19.17L2.83 0H6a4 4 0 0 1 4 4v2l18 18h2V6a2 2 0 0 0-2-2h-6.17L28 0v6zm-6.17 24L0 8.17V26a4 4 0 0 0 4 4h22v-2H4a2 2 0 0 1-2-2v-14.17l19.83 19.83V30zM30.7 32.12l-1.42 1.41L1.41 4.12 2.83 2.7l27.87 29.42z"></path>
        </svg>
      );
    case 'smoke alarm':
      return (
        <svg {...svgProps}>
          <path d="M30.7 32.12l-1.42 1.41L1.41 4.12 2.83 2.7l27.87 29.42z"></path>
          <path d="M16 4a12 12 0 0 1 11.53 8.7L25.6 12.1A10 10 0 0 0 16 6a10 10 0 0 0-8.66 15l-1.73 1a12 12 0 0 1 10.39-18z"></path>
          <path d="M16 28a12 12 0 0 1-11.53-8.7L6.4 19.9A10 10 0 0 0 16 26a10 10 0 0 0 8.66-15l1.73-1a12 12 0 0 1-10.39 18z"></path>
        </svg>
      );
    default:
      return (
        <svg {...svgProps}>
          <path d="M28.7 8.3L12.5 24.5l-7.2-7.2 1.4-1.4 5.8 5.8 14.8-14.8 1.4 1.4z"></path>
        </svg>
      );
  }
};

export default AmenityIcon;
