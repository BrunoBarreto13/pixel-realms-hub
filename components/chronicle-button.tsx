import React from 'react';

interface ChronicleButtonProps {
  text: string;
  outlined?: boolean;
  width?: string;
  onClick?: () => void;
  borderRadius?: string;
  hoverColor?: string;
  customBackground?: string;
  customForeground?: string;
  hoverForeground?: string;
}

export const ChronicleButton: React.FC<ChronicleButtonProps> = ({
  text,
  outlined = false,
  width,
  onClick,
  borderRadius = "20px",
  hoverColor = "#156ef6",
  customBackground = "#151419",
  customForeground = "#fff",
  hoverForeground = "#fff"
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width,
        borderRadius,
        background: outlined ? 'transparent' : customBackground,
        color: customForeground,
        border: `1px solid ${outlined ? customForeground : 'transparent'}`,
        cursor: 'pointer',
        padding: '10px 20px',
        fontWeight: 600,
        fontSize: '0.875rem',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
         e.currentTarget.style.background = hoverColor || '#156ef6';
         e.currentTarget.style.color = hoverForeground || '#fff';
         e.currentTarget.style.borderColor = hoverColor || '#156ef6';
      }}
      onMouseLeave={(e) => {
         e.currentTarget.style.background = outlined ? 'transparent' : (customBackground || '#151419');
         e.currentTarget.style.color = customForeground || '#fff';
         e.currentTarget.style.borderColor = outlined ? (customForeground || '#fff') : 'transparent';
      }}
    >
      {text}
    </button>
  );
};